# BMI Calculator — Design Spec

**Date:** 2026-05-17
**Owner:** igroylova
**Status:** Approved for implementation planning

## Goal

Capture organic + paid traffic from the "bmi calculator" query family (7.5M global searches/month, $0.01–0.70 CPC) and route it through a warm-up funnel — BMI → calorie target → AI day plan → App Store — that mirrors the existing `/calorie-deficit-calculator` page so engineering cost stays low and conversion patterns stay comparable across the two calculators.

## Out of scope

- Google Ads campaign configuration (manual work in the Ads UI, not in this repo).
- Human translation of SEO copy (machine translations ship in v1; a polish pass is a follow-up).
- Changes to the existing `/calorie-deficit-calculator` page. Its plan-generation gate stays at 1 per browser.

## URL and routing

- `/bmi-calculator` (EN — no locale prefix)
- `/{locale}/bmi-calculator` for `locale ∈ { de, ru, es, fr }`

Uses the existing `[locale]` segment and `routing.locales`. `generateStaticParams` returns all five locales. `localePrefix: 'as-needed'` is already in `i18n/routing.ts`, so the EN URL stays bare.

`app/(content)/[locale]/layout.tsx` forces `robots: { index: false, follow: true }` for non-default locales. The BMI page overrides this with `robots: { index: true, follow: true }` on every locale's metadata, identical to what `calorie-deficit-calculator/page.tsx` does (see lines 42–46 in that file). Goal: all five language versions get indexed.

## Architecture

### File layout

**New files:**

- `lib/bmi/bmi.ts` — pure math, no React, easy to unit-test.
- `app/(content)/[locale]/bmi-calculator/page.tsx` — Server Component: metadata, hero + widget mount, SEO body, FAQ, related guides, footer.
- `app/(content)/[locale]/bmi-calculator/calculator-widget.tsx` — Client Component: form / bmi-result / plan state machine and all UI for the interactive part.

**Reused as-is, no edits:**

- `lib/deficit/calc.ts` — `calculate`, `validate`, `kgToLb`, `lbToKg`, `inToCm`, `ACTIVITY_MULTIPLIER`, type exports.
- `lib/deficit/meal-plan-api.ts` — `fetchSession`, `generatePlan`, `ApiPlan`, `ApiLanguage`, `ApiSlot`, error kinds.
- `lib/use-app-store-link.ts` — `useAppStoreLink(buttonLocation)`.
- `components/{nav,footer,container,app-store-badge}`, `components/seo/{content-section,faq-section,related-guides}`.
- `i18n/routing.ts`, `i18n/navigation.ts`.

`ensureSessionToken` is not exported by `meal-plan-api.ts` — it's a widget-local closure in deficit calc's `calculator-widget.tsx` (lines 261–271) that caches the token in a `useRef`. The BMI widget defines its own local copy of the same shape (read ref → fall back to `fetchSession()` → cache and return). We do not extract a shared helper in this PR.

### Updates to existing files

- `components/seo/related-guides.tsx` — add `bmiCalculator: '/bmi-calculator'` to `SLUG_TO_HREF` so other SEO pages can link to the new calculator. This is the only edit to an existing component file.
- `messages/{en,de,ru,es,fr}.json` — add `relatedLinks.descBmiCalculator` and `footer.bmiCalculator` entries (the keys `RelatedGuides` reads via `descKey(slug)` and `tFooter(slug)`).

We deliberately do not rename `lib/deficit/` to a neutral name (e.g. `lib/calc/`) in this PR. The semantic mismatch is small and renaming touches files outside this feature's scope.

### `lib/bmi/bmi.ts` API

Exports:

```ts
export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export type BmiFormState = {
  gender: 'male' | 'female' | '';
  age: string;               // raw input
  heightUnit: 'cm' | 'in';
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightUnit: 'kg' | 'lb';
  weight: string;
};

export type BmiResult = {
  bmi: number;               // 1-decimal rounded for display
  category: BmiCategory;
  weightKg: number;          // canonicalized for downstream
  heightCm: number;
  healthyRangeKg: { minKg: number; maxKg: number }; // BMI 18.5..24.9
  targetWeightKg: number | null;                    // null when normal
};

export type BmiValidationError = {
  field: 'gender' | 'age' | 'height' | 'weight';
  reason: 'required' | 'range';
};

export function computeBmi(weightKg: number, heightCm: number): number;
export function categoryFor(bmi: number): BmiCategory;
export function healthyWeightRangeKg(heightCm: number): { minKg: number; maxKg: number };
export function targetWeightKg(category: BmiCategory, heightCm: number): number | null;
export function validateBmiForm(form: BmiFormState): BmiValidationError | null;
export function computeBmiResult(form: BmiFormState): BmiResult;
export function mapToCalcInput(
  form: BmiFormState,
  activity: Activity,           // imported from lib/deficit/calc
  category: BmiCategory,
): CalcInput;                    // suitable for lib/deficit/calc.calculate()
```

**Math constants:**

```ts
const BMI_UNDERWEIGHT_MAX = 18.5;  // exclusive: bmi < 18.5
const BMI_NORMAL_MAX      = 25.0;  // inclusive on lower (18.5), exclusive on upper
const BMI_OVERWEIGHT_MAX  = 30.0;  // inclusive on lower (25.0), exclusive on upper
const BMI_NORMAL_MID      = 21.7;  // midpoint target for overweight/obese
const BMI_NORMAL_LOW      = 18.5;  // lower edge target for underweight
```

`categoryFor` uses the same boundaries as the WHO classification:

```
bmi < 18.5            → 'underweight'
18.5 ≤ bmi < 25       → 'normal'
25   ≤ bmi < 30       → 'overweight'
bmi ≥ 30              → 'obese'
```

`healthyWeightRangeKg(heightCm)` returns `{ minKg: 18.5*hm², maxKg: 24.9*hm² }` rounded to 1 kg for display.

`targetWeightKg`:
- `overweight` / `obese` → `21.7 × heightM²` (midpoint of Normal, comfortable buffer)
- `underweight` → `18.5 × heightM²` (lower edge, "just reach healthy")
- `normal` → `null`

UI displays `targetWeightKg` as a single center value plus the `healthyRangeKg` range string — e.g. "Target weight ~67 kg (57–77)". No second field in the result type; the range is already on `healthyRangeKg`.

`mapToCalcInput` converts BMI-form + selected activity to `CalcInput`:

| BMI category | `goal`      | `pace`     |
| ------------ | ----------- | ---------- |
| overweight   | `'lose'`    | `'normal'` |
| obese        | `'lose'`    | `'normal'` |
| normal       | `'maintain'`| `'normal'` (ignored by `calculate()` for maintain) |
| underweight  | `'gain'`    | `'normal'` |

`validateBmiForm` validates only the BMI-form fields (gender, age 14–100, height 120–250 cm, weight 30–250 kg). Activity is not part of this validation — it gets a separate `if (activity === '')` guard at plan-generation time.

### Widget state machine

```
Phase 'form'
  ├── inputs: gender (segment 2-way), age (number), height (cm OR ft+in toggle),
  │            weight (kg OR lb toggle)
  ├── action: submit → validateBmiForm(form)
  │            → on error: render inline error, stay
  │            → on ok: computeBmiResult, setPhase('bmi-result'),
  │              fire `bmi_calculated`
  └── back-link: none (root phase)

Phase 'bmi-result'
  ├── shows: BMI number large, category pill (color-coded), gradient scale with
  │            marker, healthy range + target weight line, 1-line tailored copy
  │            ("Your BMI of 27.3 is in the overweight range. A healthy BMI
  │             for your height is 18.5–24.9, which means a target weight
  │             of 57–77 kg.")
  ├── inputs: activity (select, 5 options matching deficit calc)
  ├── action: "Get my plan" → if planCount ≥ 2 show used-CTA stack (no API call);
  │            else fire `bmi_cta_clicked`, ensureSessionToken, build CalcInput
  │            via mapToCalcInput, call calculate() to get target/macros,
  │            POST /public/meal-plan with the 401→rotate-once retry, setPhase('plan')
  │            on success; fire `bmi_plan_generated`
  ├── back-link: "Edit" → setPhase('form')
  └── used-CTA: when planCount ≥ 2, replaces the activity+CTA section with the
                 App Store conversion stack (CTA button + badge + trust line),
                 identical pattern to deficit calc's `alreadyUsed` branch.

Phase 'plan'
  ├── shows: meal list (breakfast/lunch/dinner/snack from ApiPlan), totals,
  │            rationale, then App Store CTA + badge stack
  ├── action: App Store CTA → useAppStoreLink('bmi_calculator_plan'),
  │            fires `bmi_app_click` with button_location
  └── back-link: "Edit" → setPhase('form')
```

### Data flow on plan generation

```
form (validated) + activity (from bmi-result phase)
    ↓
mapToCalcInput(form, activity, category)
    ↓ CalcInput
calculate(input)                       // imported from lib/deficit/calc
    ↓ CalcResult { target, weightKg, proteinG, carbsG, fatG, clamped }
ensureSessionToken()                   // widget-local closure; calls fetchSession from lib/deficit/meal-plan-api on first miss
    ↓ session_token
generatePlan({                          // POST /public/meal-plan
  calories_target: result.target,
  weight_kg: result.weightKg,
  goal: input.goal,                    // 'lose' | 'maintain' | 'gain'
  protein_g: result.proteinG,
  carbs_g: result.carbsG,
  fat_g: result.fatG,
  language: toApiLanguage(locale),
  session_token,
})
    ↓ ApiPlan | typed error
[401 session_expired] → rotate token, retry once
[429 rate_limited_*] → surface localized error inline, stay on bmi-result
[network/service]    → surface generic error, stay on bmi-result
[ok]                 → setPhase('plan'), persist to localStorage, increment counter
```

`clamped` from `CalcResult` automatically protects against sub-1200 kcal targets for petite users — we surface it as a small amber note on the plan view, same wording as deficit calc.

### localStorage

Two keys, both versioned:

- `nuvvoo_bmi_plan_count` — integer 0..2. Incremented after every successful plan write. When `>= 2`, the "Get my plan" CTA is replaced by the App Store conversion stack. Independent of `nuvvoo_deficit_plan_used`.
- `nuvvoo_bmi_plan_data` — JSON `{ v: 1, form, bmiResult, activity, calcResult, plan }`. Used to rehydrate the plan view on a return visit so the user lands directly on the last plan without re-entering data.

`STORAGE_VERSION = 1` for the BMI keys (they're new). If the shape of `form` / `bmiResult` / `calcResult` / `plan` changes later, bump and let the rehydrate code drop stale entries.

### Plan generation gate

`PLAN_LIMIT_ENABLED = true` constant in the widget, mirroring deficit. When `false` we bypass the count check for local iteration.

```
const PLAN_LIMIT_PER_BROWSER = 2;
const alreadyUsed = PLAN_LIMIT_ENABLED && planCount >= PLAN_LIMIT_PER_BROWSER;
```

`planCount` is read once on mount from `nuvvoo_bmi_plan_count` and incremented atomically (read → +1 → write) after a successful plan response.

## UI

### Hero (above the fold)

Two-column grid (`md:grid-cols-2`), identical layout to `/calorie-deficit-calculator`:

- Left: H1, intro paragraph, trust line (`💚 Free`, `✦ No account`, `🔒 Private`).
- Right: white card with the calculator widget.

Mobile: stacked, widget with `-mx-2 w-auto` negative margin to span beyond `Container`'s `px-5`.

### BMI result card (phase `'bmi-result'`)

Layout:

```
┌──────────────────────────────────────────────┐
│  Your BMI                          Edit ↩    │
│                                              │
│  27.3                                        │
│  OVERWEIGHT (pill, color-coded)              │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━     │ ← gradient scale, dot marker
│  Under   Normal      Over    Obese            │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │ Healthy BMI range      18.5 – 24.9      │ │
│  │ Target weight          ~67 kg (57–77)   │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Your BMI of 27.3 is in the overweight       │
│  range. A healthy BMI for your height is     │
│  18.5–24.9, which means a target weight of   │
│  57–77 kg.                                   │
│                                              │
│  Activity level                              │
│  [Sedentary ▾]                               │
│                                              │
│  ┌─ Get my plan ───────────────────────────┐ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Gradient scale spec:**
- Bar: 10 px tall, `border-radius: 6px`, background `linear-gradient(90deg, #60a5fa 0%, #34d399 25%, #fbbf24 60%, #f87171 100%)`.
- Marker: 14 px circle, `#0f172a` fill, 3 px white border, soft shadow.
- Marker x-position: `clamp(0, (bmi - 15) / (40 - 15), 1) * 100%` — clamped to bar bounds so extremes don't overflow.
- Labels below: `Under / Normal / Over / Obese`, small slate text.

**Category pill colors:**
- `underweight` — `bg-blue-100 text-blue-800`
- `normal` — `bg-nuvvooGreen-50 text-nuvvooGreen-800`
- `overweight` — `bg-amber-100 text-amber-800`
- `obese` — `bg-red-100 text-red-800`

**Activity select** matches deficit calc's `<select>` styling exactly (h-11, rounded-xl, slate-300 border, nuvvooGreen-100 focus ring), 5 options from `t('form.activitySedentary..Extra')`.

### Plan card (phase `'plan'`)

Identical structure and styling to deficit calc's `PlanView` (see `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx` lines 1044–1180): meals list, totals row, rationale paragraph, App Store CTA + badge + trust line. The only difference is `useAppStoreLink('bmi_calculator_plan')` instead of `deficit_calculator_plan`, and the analytics events use `bmi_*` names.

### SEO body (below the fold)

Within `<article>` with `Container` and `max-w-3xl`:

1. `ContentSection` — "What is BMI?", 2 paragraphs (definition, what it does and doesn't tell you).
2. `ContentSection` — "BMI categories", a 4-row table:

   | Category    | BMI range     |
   | ----------- | ------------- |
   | Underweight | Below 18.5    |
   | Normal      | 18.5 – 24.9   |
   | Overweight  | 25.0 – 29.9   |
   | Obese       | 30.0 or more  |

3. `ContentSection` — "How is BMI calculated?", 1 paragraph with the formula `BMI = weight (kg) / height (m)²`.
4. `ContentSection` — "BMI limitations", 2 paragraphs (doesn't distinguish fat vs muscle; not validated for athletes, pregnant women, elderly, certain ethnicities).
5. `ContentSection` — "What to do with your BMI result", 1 paragraph with `t.rich` linking out to `/calorie-deficit-calculator` and `/food-diary-for-weight-loss`.
6. Conversion block — same shadow-soft white card as deficit, with title, subtitle, `AppStoreBadge buttonLocation="bmi_calculator_conversion"`.
7. `FaqSection faqs={[…4 items…]}` — emits FAQPage JSON-LD via the existing component.
8. `RelatedGuides slugs={['calculator', 'foodDiary', 'mfpAlternative', 'chatTracker']}` — `'calculator'` is the canonical slug for `/calorie-deficit-calculator` (see `SLUG_TO_HREF` in `components/seo/related-guides.tsx`).

**FAQ questions (4):**

- What is a healthy BMI?
- How do I calculate my BMI?
- Is BMI accurate?
- What BMI is considered overweight?

### Metadata

- `title`: bare title without `| Nuvvoo` suffix — the parent `layout.tsx` template `'%s | Nuvvoo'` appends it. The recent commit `6f2e825` fixed exactly this dup; we copy the pattern.
  - EN: `BMI Calculator — Free + AI Meal Plan`
  - ES: `Calculadora de IMC — Gratis + Plan IA`
  - FR: `Calculateur IMC — Gratuit + Plan Repas IA`
  - DE: `BMI Rechner — Kostenlos + KI-Ernährungsplan`
  - RU: `Калькулятор BMI — бесплатно + AI план питания`
- `description`: from the brief (each locale).
- `alternates.canonical` + `alternates.languages` for all five locales + `x-default → /bmi-calculator`.
- `robots: { index: true, follow: true }` on every locale (overrides layout's noindex for non-default).
- `openGraph.{title, description, url, type: 'article', images: [{ url: '/images/og.png', 1200×630 }] }`.
- `twitter.{card: 'summary_large_image', title, description, images}`.

### H1 per locale

- EN: `BMI Calculator`
- ES: `Calculadora de IMC`
- FR: `Calculateur d'IMC`
- DE: `BMI Rechner`
- RU: `Калькулятор BMI`

## i18n messages

New top-level namespace `bmiCalculator` in each of `messages/{en,de,ru,es,fr}.json`. Structure parallels `deficitCalculator` so future readers can map keys 1:1.

Key tree:

```
bmiCalculator
  metadata
    title
    description
    ogTitle
    ogDescription
  h1
  intro
  trustFree | trustNoAccount | trustPrivate
  form
    genderLabel | genderMale | genderFemale
    ageLabel | agePlaceholder | ageUnit
    heightLabel
    weightLabel
    activityLabel | activitySedentary | activityLight | activityModerate
                  | activityVery | activityExtra
    submit
    errorRequired | errorRange
  result
    bmiLabel | edit
    categoryUnderweight | categoryNormal | categoryOverweight | categoryObese
    scaleLegendUnder | scaleLegendNormal | scaleLegendOver | scaleLegendObese
    healthyRangeLabel | healthyRangeKg | healthyRangeLb
    targetWeightLabel | targetWeightKg | targetWeightLb
    explanationOverweight     # ICU param: bmi, rangeLow, rangeHigh, targetLow, targetHigh
    explanationObese          # same params
    explanationNormal         # ICU param: bmi
    explanationUnderweight    # ICU params: bmi, target
    activityPrompt
    ctaButton
    ctaUsedNote
  plan
    heading | loading | kcalUnit | totalLabel | macros
    slotBreakfast | slotLunch | slotDinner | slotSnack
    errorTitle | rateLimitedHourly | rateLimitedDaily
  seo
    h2_what       | what_p1 | what_p2
    h2_categories | categoriesHeaderCategory | categoriesHeaderRange
                  | categoryRowUnderweight | categoryRowNormal
                  | categoryRowOverweight | categoryRowObese
    h2_formula    | formula_p1
    h2_limitations | lim_p1 | lim_p2
    h2_action     | action_p1   # t.rich tags: <deficit>...</deficit>, <food>...</food>
  conversion
    title | subtitle | cta
  faq
    q1 | a1 | q2 | a2 | q3 | a3 | q4 | a4
```

EN messages are authored fresh in the PR. DE / RU / ES / FR are seeded by machine translation matching the existing translation register of `deficitCalculator` in each file. A subsequent human-translation polish pass is filed as a follow-up.

## Analytics events (gtag)

Helper `track(name, params)` lifted verbatim from deficit calc's widget (the local helper that no-ops outside the browser and when `window.gtag` is undefined).

| Event                       | When                                                   | Parameters |
| --------------------------- | ------------------------------------------------------ | ---------- |
| `bmi_calculator_viewed`     | once on mount (ref-guarded)                            | `page: 'bmi_calculator'`, `locale` |
| `bmi_calculated`            | submit form, valid                                     | `bmi_value`, `bmi_category`, `gender`, `locale` |
| `bmi_cta_clicked`           | click "Get my plan" (before API call)                  | `bmi_category`, `locale` |
| `bmi_plan_generated`        | plan API response ok                                   | `bmi_value`, `bmi_category`, `target_kcal`, `total_kcal`, `meal_count`, `locale` |
| `bmi_app_click`             | click App Store CTA or badge                           | `button_location` ∈ `{ bmi_calculator_plan, bmi_calculator_plan_badge, bmi_calculator_result_used, bmi_calculator_result_used_badge, bmi_calculator_conversion }`, `traffic_source` (from `sessionStorage.nuvvoo_source` or `'direct'`), `locale`, `bmi_category` |

`useAppStoreLink('bmi_calculator_*')` continues to fire its global `click_platform` event separately — reporting filters between calculator-funnel vs global app-store intent the same way it does for deficit calc today.

## Error handling

API error kinds from `meal-plan-api.ts` are surfaced in `bmi-result` phase below the CTA:

| Error kind             | UI                                                                 |
| ---------------------- | ------------------------------------------------------------------ |
| `session_expired`      | invisible — token rotated, one silent retry                        |
| `rate_limited_hourly`  | localized text `t('plan.rateLimitedHourly')`                        |
| `rate_limited_daily`   | localized text `t('plan.rateLimitedDaily')`                         |
| `service_unavailable`  | `t('plan.errorTitle')` generic                                      |
| `origin_blocked`       | `t('plan.errorTitle')` generic                                      |
| `invalid_input`        | `t('plan.errorTitle')` generic — should not happen in practice      |
| `network`              | `t('plan.errorTitle')` generic                                      |

Validation errors on the BMI form render under the offending field with `t('form.errorRequired')` or `t('form.errorRange')`, same pattern as deficit calc.

## Testing

- **Unit tests (Vitest):** `lib/bmi/bmi.test.ts` covers `computeBmi`, `categoryFor` (including boundary values 18.5 / 25 / 30), `healthyWeightRangeKg`, `targetWeightKg` per category, `validateBmiForm` (every field's required/range cases), `mapToCalcInput` (all four categories map to the right goal).
- **Manual smoke checklist** (no Playwright tests required, deficit calc didn't add them either):
  - All 5 locales render with the right title, H1, body copy.
  - `/bmi-calculator` and `/{locale}/bmi-calculator` URLs all return 200 and serve indexed HTML (check `<meta name="robots">` is `index, follow` on every locale).
  - Submit with valid inputs in each category (Underweight: 50 kg / 175 cm; Normal: 70 kg / 175 cm; Overweight: 85 kg / 175 cm; Obese: 105 kg / 175 cm) — verify category pill, scale marker position, healthy-range copy, target-weight copy.
  - Plan generation succeeds end-to-end with a real API session; verify all five events fire in the GA4 DebugView.
  - `localStorage` after 2 plan generations: `nuvvoo_bmi_plan_count = 2`, CTA replaces with App Store stack. Verify deficit calc's `nuvvoo_deficit_plan_used` is untouched (independent gate).
  - Mobile (375 px, 414 px) layout: widget doesn't overflow, gradient marker stays inside the bar.
- **Verification before claiming done:** `pnpm build` succeeds; `pnpm lint` clean; type-check passes; manual checklist above completed against `pnpm dev`.

## Risks and follow-ups

- **Machine-translated copy** may read awkwardly in production. Filed: human translation polish pass.
- **API cost amplification**: separate 2-generation gate means a returning user could spend up to 2 (BMI) + 1 (deficit) = 3 plan generations across both calculators. Backend rate limits (5/hr, 20/day per IP) cap absolute exposure. Acceptable for the funnel value of the second BMI generation.
- **Boundary BMI values** (e.g., exactly 18.5 or 25.0): tests pin the inclusive/exclusive convention; UI behavior is fully deterministic.
- **Renaming `lib/deficit/` → `lib/calc/`** filed as a separate maintenance PR; not part of this work.

## Acceptance

Spec accepted when:

1. All five locale URLs return indexed HTML with the right metadata.
2. Form submission yields a correct BMI + category + scale marker in every category.
3. Plan generation runs through the existing `/public/meal-plan` API and renders the same plan UI shape as deficit calc.
4. The five analytics events fire with the documented parameters.
5. `nuvvoo_bmi_plan_count >= 2` gate replaces the CTA with the App Store stack.
6. `pnpm build && pnpm lint` pass.
