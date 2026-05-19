# TDEE + BMR Calculator Split — Design Spec

**Date:** 2026-05-17
**Owner:** igroylova
**Status:** Draft — pending spec-review and user approval
**Branch:** `feature/tdee-bmr-split` (off `main`, parallel with `feature/bmi-calculator`)

## Goal

Capture the high-volume "tdee calculator" (1.22M/mo) and "bmr calculator" (450k/mo) query families with dedicated landing pages whose intent matches the search — instead of routing every visitor through `/calorie-deficit-calculator` and losing the share that came for a different calculation. Each page funnels into the same AI-meal-plan → App Store conversion path the deficit calculator already uses, so the back-end and conversion-tracking surface stays identical.

## Out of scope

- BMI calculator (`/bmi-calculator`) — in-flight on a parallel branch, has its own spec.
- Google Ads campaign configuration (manual in the Ads UI).
- Human-quality translation polish — machine translations ship in v1; copywriter pass is a follow-up track.
- Localized URL slugs (e.g. `/calculadora-tdee`) — out of scope; URL stays English on every locale, same pattern as deficit/bmi.
- Component-level React tests — no Testing Library setup in repo. Pure-math tests + manual QA only.
- Performance budgeting (LCP/INP), A/B tests on upgrade-CTA copy, schema.org `HowTo` — separate tracks.

## URLs and routing

- `/tdee-calculator` (EN — no locale prefix)
- `/{locale}/tdee-calculator` for `locale ∈ { de, ru, es, fr }`
- `/bmr-calculator` (EN — no locale prefix)
- `/{locale}/bmr-calculator` for `locale ∈ { de, ru, es, fr }`

Uses the existing `[locale]` segment under `app/(content)/[locale]/`. `generateStaticParams` returns all five locales. `localePrefix: 'as-needed'` in `i18n/routing.ts` keeps the EN URL bare.

`app/(content)/[locale]/layout.tsx` forces `robots: { index: false, follow: true }` for non-default locales. Both new pages override this with `robots: { index: true, follow: true }` on every locale, identical to what `calorie-deficit-calculator/page.tsx` does (lines 42–46). Goal: all five language versions get indexed.

## Architecture

### Decision: one parameterized widget

The existing deficit calculator widget at `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx` is moved to `components/calculator/calorie-calculator.tsx` and parameterized with a `mode: 'bmr' | 'tdee' | 'deficit'` prop plus a `messagesNamespace` prop that selects which i18n namespace to read labels from. All three pages render the same component with different props.

Rejected alternatives:
- **Composition-of-atoms** (extract FormFields/ResultPanel/PlanView into reusable pieces, each page composes its own widget). More files, two-step refactor, premature abstraction — the three pages differ only in what's shown/hidden, not in structure. Revisit if/when SEO genuinely requires divergent page layouts.
- **HOC / render-props** — overkill.

### File layout

**New files:**

- `components/calculator/calorie-calculator.tsx` — the parameterized widget (Client Component). Identical state machine and code paths to today's deficit widget, with conditional rendering by `mode`.
- `app/(content)/[locale]/tdee-calculator/page.tsx` — Server Component: metadata, hero + widget mount with `mode="tdee"`, SEO body, FAQ, related guides, footer.
- `app/(content)/[locale]/bmr-calculator/page.tsx` — Server Component: same shape with `mode="bmr"`.

**Edited files:**

- `app/(content)/[locale]/calorie-deficit-calculator/page.tsx` — replace local `./calculator-widget` import with `@/components/calculator/calorie-calculator`, pass `mode="deficit"` and `messagesNamespace="deficitCalculator"`.
- `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx` — **deleted** after the move. Behavior is preserved by the shared widget.
- `lib/deficit/calc.ts` — two additions:
  1. Extend `validate(input)` to `validate(input, mode?: 'bmr' | 'tdee' | 'deficit' = 'deficit')`. Default keeps existing call sites zero-change. New mode-aware required-field checks documented under "Validation" below.
  2. **Export a new `computeBmr(input: BmrInput): number`** where `BmrInput = { weight, weightUnit, height, heightUnit, age, gender }` (a Pick of `CalcInput` minus activity/goal/pace). Internally just calls the existing private `mifflin()` helper with unit-normalized values. BMR mode uses `computeBmr` to display the hero number without needing activity. TDEE and deficit modes continue to use `calculate()` (which already computes BMR internally and exposes it on `CalcResult.bmr`).
- `components/seo/related-guides.tsx` — add `tdeeCalculator: '/tdee-calculator'` and `bmrCalculator: '/bmr-calculator'` to `SLUG_TO_HREF`.
- `messages/{en,de,ru,es,fr}.json` — add two new top-level namespaces `tdeeCalculator` and `bmrCalculator` plus `relatedLinks.descTdeeCalculator`, `relatedLinks.descBmrCalculator`, `footer.tdeeCalculator`, `footer.bmrCalculator`.
- `app/sitemap.ts` — add `/tdee-calculator` and `/bmr-calculator` × 5 locales each with the same `priority` and `changeFrequency` as `/calorie-deficit-calculator`.

Folder name `lib/deficit/` is acknowledged as awkward now that two more calculators live alongside it — a rename to `lib/calorie/` is **out of scope** for this PR to keep the diff focused. Tracked as a follow-up cleanup task.

**Reused as-is, no edits:**

- `lib/deficit/calc.ts` math (`calculate`, `paceRates`, `macroSplit`, `kgToLb`, `lbToKg`, `inToCm`, `ACTIVITY_MULTIPLIER`, type exports) — formulas unchanged. Only `validate` gains a new parameter; `computeBmr` is purely additive.
- `lib/deficit/meal-plan-api.ts` — `fetchSession`, `generatePlan`, `ratePlan`, error kinds — no changes.
- `lib/use-app-store-link.ts` — `useAppStoreLink(buttonLocation)`.
- `components/{nav, footer, container, app-store-badge}`, `components/seo/{content-section, faq-section, related-guides}`.
- `i18n/{routing, navigation}.ts`.

### Component API

```ts
type Mode = 'bmr' | 'tdee' | 'deficit';

type Props = {
  mode: Mode;
  messagesNamespace: 'bmrCalculator' | 'tdeeCalculator' | 'deficitCalculator';
};

export function CalorieCalculator({ mode, messagesNamespace }: Props);
```

The widget reads all labels via `useTranslations(messagesNamespace)`. Same key shape across namespaces (`form.*`, `result.*`, `upgrade.*`, `plan.*`, `conversion.*`). Each page's `t('h1')`, `t('intro')`, SEO body and FAQ are rendered by the page Server Component, not the widget.

### Widget internal state — shared FormState

All form fields (`weight, weightUnit, heightCm, heightFt, heightIn, heightUnit, age, gender, activity, goal, pace, diet, allergies`) live in one `FormState`, unchanged from today's deficit widget. By `mode` the widget controls **what is shown to the user**; hidden fields hold defaults.

**Defaults by mode:**

| Field    | `bmr` default | `tdee` default | `deficit` default (current) |
| -------- | ------------- | -------------- | ---------------------------- |
| activity | `''` (hidden) | `''` (required, shown) | `''` (required, shown) |
| goal     | `'maintain'` (hidden) | `'maintain'` (hidden) | `'lose'` (shown) |
| pace     | `'normal'` (hidden) | `'normal'` (hidden) | `'normal'` (shown when goal≠maintain) |
| diet     | `'none'` (hidden) | `'none'` (hidden) | `'none'` (shown on result) |
| allergies| `[]` (hidden) | `[]` (hidden) | `[]` (shown on result) |

`goal='maintain'` on TDEE ensures the internal `calculate()` call doesn't clamp below `MIN_KCAL` and weekly delta evaluates to zero — neither is displayed in TDEE mode but their values must be sane in case of inspection.

BMR mode does **not** call `calculate()` for the hero number — it calls `computeBmr(input)` instead. The hidden `activity=''` value is therefore never passed to the math layer in BMR mode; it only becomes relevant when the user moves into the upgrade flow, at which point the field is no longer hidden and the user must pick a real value.

### Phase machine

```
Mode: bmr / tdee
  Phase 'form'        → submit → validate(input, mode) → calculate() (tdee) or
                                  computeBmr() (bmr) → setPhase('result')
  Phase 'result' (compact)  → click upgrade CTA → setSubPhase('upgrading')
  Phase 'result' (upgrading) → submit → validate(input, 'deficit') → fetchSession + generatePlan
                              → setPhase('plan') on success
  Phase 'plan'        → identical to deficit's plan phase

Mode: deficit (unchanged)
  Phase 'form'        → submit → validate(input, 'deficit') → calculate() → setPhase('result')
  Phase 'result'      → submit (diet+allergies inline) → generatePlan → setPhase('plan')
  Phase 'plan'        → unchanged
```

The `result` phase in `bmr|tdee` carries an additional sub-state `compact | upgrading` (a single boolean `upgrading: boolean` is enough; no enum required).

### FormView rendering by mode

| Input | bmr | tdee | deficit |
| ----- | --- | ---- | ------- |
| weight + unit toggle | shown | shown | shown |
| height + unit toggle | shown | shown | shown |
| age   | shown | shown | shown |
| gender | shown | shown | shown |
| activity (select) | **hidden** | shown | shown |
| goal (3-segment) | **hidden** | **hidden** | shown |
| pace (select, conditional) | **hidden** | **hidden** | shown when goal≠maintain |
| diet (4-segment) | hidden | hidden | (shown on result, not form) |
| allergies (chip input) | hidden | hidden | (shown on result, not form) |
| submit button label | `form.submitBmr` | `form.submitTdee` | `form.submit` |

### ResultView rendering by mode

**bmr:**
- Hero number: `computeBmr(input).toLocaleString()` + small "kcal/day" label. (Uses the new `computeBmr` export; `calculate()` is not called here because activity is unknown.)
- Subtitle: `t('result.bmrSubtitle')` — "Your resting metabolism — calories your body burns at rest" (EN; localized per namespace).
- Explanation line: `t('result.bmrExplain')` — "This is your BMR — calories your body needs even at full rest. Add your activity level to get your daily total."
- Edit link → back to form.
- Hidden: BMR+TDEE plate, weekly delta line, macro plate, clamped note.
- Below result: upgrade CTA card (`upgrade.title` + `upgrade.subtitle` + button).
- On entering the upgrade flow and posting `generatePlan`, the widget invokes `calculate(input, …)` once activity/goal/pace are filled — exact same code path as TDEE and deficit at that point.

**tdee:**
- Hero number: `result.tdee.toLocaleString()` + small "kcal/day" label.
- Subtitle: `t('result.tdeeSubtitle')` — "Your daily calorie burn — eat this to maintain weight".
- Supporting plate: small "Resting (BMR): {bmr}" line, and the macro plate computed for maintain.
- Edit link.
- Hidden: weekly delta (zero for maintain), clamped note, target line.
- Below result: upgrade CTA card.

**deficit (unchanged):**
- Hero: `result.target` big.
- Plate: BMR + TDEE, weekly delta, macros.
- Diet + allergies inline (current behavior).
- Primary CTA: "Get my first day plan".

### Upgrade panel (bmr/tdee only, sub-phase `upgrading`)

Renders the inputs that weren't on the main form, so we can hit `generatePlan`:

| Mode | Fields revealed |
| ---- | --------------- |
| bmr  | activity (select), goal (3-segment), pace (conditional select), diet (4-segment), allergies (chip) |
| tdee | goal (3-segment), pace (conditional select), diet (4-segment), allergies (chip) |

Same components as the form view (`SegmentButton`, `AllergiesInput`, `<select>`). Bottom of panel: button `t('upgrade.cta')` — "Get my plan". Validation on click: `validate(input, 'deficit')`. Errors render inline next to their fields.

Toggling the panel:
- Trigger button has `aria-expanded={upgrading}`, controlling element id.
- On expand, focus moves to the first revealed field (activity for bmr, goal-segment for tdee).
- `role="region"` and `aria-label` on the panel.

### Plan view — shared, mode-agnostic

The existing `PlanView` (meals list, totals, rationale, rating control, App Store CTA stack) is reused unchanged for all three modes. The `button_location` strings sent to `app_click` are mode-prefixed (see Analytics).

## Validation

`lib/deficit/calc.ts`:

```ts
export function validate(
  input: Partial<CalcInput>,
  mode: 'bmr' | 'tdee' | 'deficit' = 'deficit',
): ValidationError | null
```

Required fields by mode:

| Field | bmr | tdee | deficit |
| ----- | --- | ---- | ------- |
| weight, weightUnit | required + range 30–250 kg | required + range | required + range |
| height, heightUnit | required + range 120–250 cm | required + range | required + range |
| age   | required + range 14–100 | required + range | required + range |
| gender | required | required | required |
| activity | not checked | required | required |
| goal  | not checked | not checked | required |
| pace  | not checked | not checked | required |

Default parameter value `'deficit'` keeps all existing callers (deficit widget's `handleSubmit`) zero-change. The new widget always passes an explicit mode.

For the upgrade flow on bmr/tdee, the second validation pass uses `validate(input, 'deficit')` because by then we need all fields for `generatePlan`.

## i18n namespaces

### `bmrCalculator` — intent: "what is BMR / my BMR"

Top-level keys (mirrors `deficitCalculator` shape where applicable):

- `metadata.{title, description, ogTitle, ogDescription}`
- `h1`, `intro`
- `trustFree`, `trustNoAccount`, `trustPrivate`
- `form.*` — same keys as deficit's `form.*` plus `form.submitBmr`
- `result.bmrSubtitle`, `result.bmrExplain`, `result.edit`, `result.kcalUnit`
- `upgrade.title`, `upgrade.subtitle`, `upgrade.cta`
- `plan.*` — same keys as deficit's plan namespace (slot labels, totals, errors). **Duplicated, not shared**: each namespace is self-contained so the widget reads plan labels from whichever namespace is passed via `messagesNamespace` prop. The translation script copies the canonical `deficitCalculator.plan.*` block into the new namespaces in EN, then the standard translate pipeline produces DE/RU/ES/FR.
- `conversion.title`, `conversion.subtitle`, `conversion.cta`
- `seo.h2_what`, `seo.h2_how`, `seo.h2_plan`, plus `what_p1..p3`, `how_p1..p3`, `plan_p1..p3` with **distinct copy** focused on BMR. Cross-link markers (`<tdee>`, `<deficit>`) consumed by `t.rich` in the page Server Component.
- `faq.q1..q5`, `faq.a1..a5` — questions tailored to BMR intent (see Section 3 of the brainstorm: "Is BMR the same as TDEE?", etc.).

### `tdeeCalculator` — intent: "how many calories I burn per day"

Same shape as `bmrCalculator`, with:
- `form.submitTdee` instead of `form.submitBmr`
- `result.tdeeSubtitle` instead of `result.bmrSubtitle`
- SEO and FAQ tailored to TDEE intent (e.g. "TDEE vs BMR", "Should I recalculate after weight loss")

### `deficitCalculator` — already exists, minimal additions

- Existing keys remain. No removals.
- Add nothing new — the deficit page does not use the `upgrade.*` panel (its result has direct diet+allergies inline + Get-plan button).
- **In scope for v1:** the deficit page's `seo.plan_*` blocks gain one extra sentence with `<tdee>`/`<bmr>` markers cross-linking to TDEE/BMR (one-line edit per locale, five locales). Without it the cross-linking promise below would be unidirectional.

### Cross-linking

Each page links to the other two through `t.rich` markers consumed in the SEO body:
- BMR page: links to `/tdee-calculator` and `/calorie-deficit-calculator`.
- TDEE page: links to `/bmr-calculator` and `/calorie-deficit-calculator`.
- Deficit page: gain links to `/tdee-calculator` and `/bmr-calculator` (single edit to existing `seo.plan_*` block).

This counteracts the original problem from the other side: even if a TDEE-intent searcher lands on `/calorie-deficit-calculator`, a visible signpost reroutes them. The dedicated landing pages remain the canonical entry points for their intent.

### Related guides

- BMR page: `['tdeeCalculator', 'deficitCalculator', 'foodDiary', 'stayConsistent']`
- TDEE page: `['bmrCalculator', 'deficitCalculator', 'foodDiary', 'mfpAlternative']`
- Deficit page: add `'tdeeCalculator', 'bmrCalculator'`, replacing two lower-value entries from the current four.

### FAQ JSON-LD

`FaqSection` renders JSON-LD `FAQPage` schema for every page. Each page contributes its own Q/A set → three independent rich snippet candidates in SERP.

### Translation workflow

- EN copy authored by hand for both new namespaces.
- DE/RU/ES/FR translated via the existing script flow (mirrors how `deficitCalculator` and `bmiCalculator` namespaces were populated).
- Copy-quality polish by a human translator is an explicit follow-up track; v1 ships with machine translations + a note in `docs/`.

## Conversion funnel and analytics

### Funnel by mode

```
calculator_viewed (mode=bmr)
  → calculator_completed (mode=bmr)
  → upgrade_clicked (mode=bmr)               ← only bmr/tdee
  → plan_cta_clicked (mode=bmr)
  → plan_generated (mode=bmr)
  → app_click (button_location=bmr_calculator_plan)
```

Three parallel funnels by mode. Dashboard overlay compares conversion rates between them.

### Event changes

| Event | Param changes |
| ----- | ------------- |
| `calculator_viewed` | add `mode: Mode`. Keep `page: 'bmr_calculator' \| 'tdee_calculator' \| 'calorie_deficit_calculator'` for one release cycle to avoid breaking existing reports. Deprecate `page` in a follow-up. |
| `calculator_completed` | add `mode` |
| `plan_cta_clicked` | add `mode` |
| `plan_generated` | add `mode` |
| `upgrade_clicked` | **new event**. Params: `mode`, `locale`. Fires when user clicks "Want a personalized meal plan?" on the bmr/tdee result, before they fill the upgrade form. Not fired on deficit (no upgrade step). |
| `plan_rated` | unchanged. (Rating belongs to the plan, not the entry point. Add mode later if reporting needs it.) |
| `app_click` | mode-prefixed `button_location` values: `bmr_calculator_result_used`, `bmr_calculator_result_used_badge`, `bmr_calculator_plan`, `bmr_calculator_plan_badge`, and the same for `tdee_*`. Deficit `button_location` strings unchanged. |
| `click_platform` (from `useAppStoreLink`) | unchanged, global event. |

### localStorage keys

Per-mode gate (1 plan per browser per calculator) — keys become:
- `nuvvoo_${mode}_plan_used`
- `nuvvoo_${mode}_plan_data`

For `mode='deficit'` this resolves to `nuvvoo_deficit_plan_used` / `nuvvoo_deficit_plan_data` — **identical to the current keys**. No migration needed; existing users with a cached deficit plan continue to see it after deploy.

`STORAGE_VERSION` does not change. (The shape of stored data is unchanged.)

Rationale for per-mode gate: a user who walks through three separate funnels has higher intent than one who tries multiple goals on the same page. Three AI generations across three calculators is acceptable spend; the marketing yield is worth more than the AI cost.

## Edge cases and error handling

### API errors in upgrade flow

Reuse existing error kinds (`session_expired`, `rate_limited_hourly`, `rate_limited_daily`, generic). Behavior 1:1 with today's deficit widget:
- 401 → rotate session token, retry once.
- Hourly/daily rate limit → inline error in the upgrade panel.
- Generic → inline "Something went wrong. Try again."

Error is rendered inside the upgrade panel; the phase remains `result/upgrading` so the user can fix and retry without losing their inputs.

### `alreadyUsed` state on bmr/tdee

When the per-mode gate is set and there's no cached plan to rehydrate, the result view shows the BMR/TDEE number plus the App Store conversion stack (CTA + badge + trust line), replacing the upgrade CTA card. Pattern mirrors deficit's `alreadyUsed` branch on its result view.

### TDEE searcher hits TDEE page with goal=maintain hidden

By design. The big number on `/tdee-calculator` is the maintenance value (TDEE). Selecting a goal happens inside the upgrade panel, which is the right step for "now I want a plan".

### Switching modes within the same browser

Different localStorage keys per mode → each calculator is independent. By design.

### BMR / TDEE at extreme inputs

BMR has no clamp (it's a physiological constant). At min validate inputs (30 kg, 120 cm, 14 y, female): BMR ≈ 750. At max (250 kg, 250 cm, 14 y, male): BMR ≈ 4070. TDEE = BMR × {1.2..1.9}. All values render as-is. No new clamps introduced; existing `MIN_KCAL` clamp on `target` is irrelevant to BMR/TDEE display.

### Unit switching post-calculate

Unit toggle is present in the form view only. After Calculate, the form fields are not editable until the user clicks Edit (which returns to phase `form`). Same as today's deficit widget.

### SSR

Widget is `'use client'`. Server pages render metadata + static SEO body + FAQ + footer. Widget mounts on the client with no SSR'd interactive state. No change to today's SSR strategy.

## Sitemap and robots

`app/sitemap.ts`:
- Add `/tdee-calculator` and `/bmr-calculator` entries for all five locales.
- Same `priority` and `changeFrequency` as `/calorie-deficit-calculator`.
- The EN URL is bare; locale URLs are prefixed.

Per-page `generateMetadata` returns `robots: { index: true, follow: true }` for every locale (overrides the layout's noindex-for-non-default).

## Testing

### Pure-math unit tests — `lib/deficit/calc.test.ts`

Add cases:
- `validate(input, 'bmr')` — happy path with weight/height/age/gender only; missing-required for each of the four; out-of-range for each.
- `validate(input, 'tdee')` — same as bmr plus activity required; activity-out-of-list returns required error.
- `validate(input, 'deficit')` — existing tests remain green (no behavior change for explicit `'deficit'`).
- `validate(input)` with no mode arg — defaults to `'deficit'`; existing tests remain green.
- Documentation test: same input × three modes yields three distinct validation outcomes.
- `computeBmr` — happy path (known input → known Mifflin-St Jeor output), kg vs lb input matches within rounding, cm vs ft+in matches, male vs female sign of the trailing constant. Cross-check: `computeBmr(input)` equals `calculate({...input, activity: 'sedentary', goal: 'maintain', pace: 'normal'}).bmr` (consistency between the two entry points).

`calculate`, `paceRates`, `macroSplit` — formulas not changed. Existing tests must remain green.

### Component tests

Skipped — no React Testing Library setup in the repo. Pure-math + manual QA only. Adding the test harness is an explicit follow-up if/when needed.

### Manual QA checklist

Smoke runs 3 pages × 5 locales = 15; full runs all five locales on EN-equivalent flows.

| Scenario | bmr | tdee | deficit |
| -------- | --- | ---- | ------- |
| Page loads, metadata correct (title, description, canonical, alternates) | ✓ | ✓ | ✓ |
| Form requires weight/height/age/gender; submit shows BMR | ✓ | — | — |
| Form requires + activity; submit shows TDEE | — | ✓ | — |
| Form requires all; submit shows target + weekly + macros | — | — | ✓ |
| Upgrade CTA → reveals inline panel → submit → AI plan | ✓ | ✓ | (Get plan already on result) |
| 401 session-token rotation in upgrade flow / get-plan | ✓ | ✓ | ✓ |
| Hourly/daily rate-limit shows inline error | ✓ | ✓ | ✓ |
| localStorage rehydrates plan on reload | ✓ | ✓ | ✓ |
| `alreadyUsed` shows App Store stack instead of upgrade | ✓ | ✓ | ✓ |
| Cross-link from SEO body navigates correctly | ✓ | ✓ | ✓ |
| Related guides show two sister calculators | ✓ | ✓ | ✓ |
| Sitemap.xml contains new URLs × 5 locales | ✓ | ✓ | — |
| `robots: index, follow` on every locale (inspect via DevTools) | ✓ | ✓ | — |
| FAQ JSON-LD present and valid | ✓ | ✓ | ✓ |

### Regression checklist for deficit (we are refactoring its widget)

- Form → result → plan → rating → App Store flow works unchanged.
- localStorage with key `nuvvoo_deficit_plan_data` rehydrates plan (same key as before).
- `MIN_KCAL` clamp behavior unchanged.
- Diet + allergies inline on result view unchanged (not moved to upgrade panel).
- All existing events fire; new params `mode='deficit'` present.
- `button_location` strings for App Store CTAs remain `deficit_calculator_*` (unchanged).

### Cross-browser smoke

- Safari mobile (iOS) — primary US audience.
- Chrome desktop.
- Firefox — skip.

### Build / lint guards

- `npm run typecheck` clean.
- `npm run build` clean — i18n key parity across five locales (no missing keys in any namespace).
- `curl http://localhost:3000/sitemap.xml | grep -c tdee-calculator` returns 5; same for bmr.

## Release strategy

- Single PR into `main`, parallel with `feature/bmi-calculator`. Trivial merge conflicts expected in `messages/*.json` (new namespaces alongside `bmiCalculator`) and `components/seo/related-guides.tsx` (both PRs extend `SLUG_TO_HREF`).
- Order of merge does not matter; whichever lands first wins the merge-base, the second resolves the conflicts in its own merge.
- No feature flag — two new pages, no impact on existing traffic.
- Rollback: revert the PR. localStorage keys are unchanged for deficit users (zero state migration).

## Acceptance criteria

1. `/tdee-calculator` and `/bmr-calculator` exist for all five locales with correct metadata, indexable, and discoverable through `sitemap.xml`.
2. Each page renders a hero with `t('h1')`, `t('intro')`, a trust line, and the shared widget in the right mode.
3. BMR mode: form asks weight/height/age/gender; result shows BMR big with subtitle and explanation; upgrade panel reveals activity + goal + pace + diet + allergies; submit produces an AI plan.
4. TDEE mode: form additionally asks activity; result shows TDEE big with subtitle and a small BMR line + macro plate; upgrade panel reveals goal + pace + diet + allergies; submit produces an AI plan.
5. Deficit mode: behavior unchanged from current production.
6. All three modes share the same `PlanView`, same rating control, same App Store CTA stack.
7. Analytics events carry `mode` parameter; `upgrade_clicked` fires on bmr/tdee upgrade-CTA click.
8. Pure-math unit tests cover `validate` in all three modes and `computeBmr`.
9. Manual QA checklist above runs green on at least EN + one other locale.
10. No regression in `/calorie-deficit-calculator` against the checklist above.
