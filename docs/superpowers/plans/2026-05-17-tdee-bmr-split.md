# TDEE + BMR Calculator Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/bmr-calculator` and `/tdee-calculator` (+ four locale variants each) sharing one parameterized widget with `/calorie-deficit-calculator`, so each search intent ("bmr calculator", "tdee calculator", "calorie deficit calculator") lands on a page whose form, hero, and SEO match what was searched — while all three funnel into the same AI-meal-plan → App Store conversion path.

**Architecture:** Move the existing deficit calculator widget into a new shared file `components/calculator/calorie-calculator.tsx` with `mode: 'bmr' | 'tdee' | 'deficit'` and `messagesNamespace` props. Hide/show form fields and adjust the result hero by `mode`. BMR mode uses a new `computeBmr()` export to render the hero without needing activity input; an inline "upgrade" panel on BMR/TDEE results reveals the missing fields when the user wants an AI plan. Each page has its own server component, its own i18n namespace, its own SEO/FAQ copy. Pure-math `validate()` gains a mode parameter; `calculate()` formulas remain unchanged.

**Tech Stack:** Next.js 14 (App Router, RSC), TypeScript, Tailwind CSS, next-intl, Vitest (already set up by the BMI feature branch).

**Reference spec:** `docs/superpowers/specs/2026-05-17-tdee-bmr-split-design.md`

**Reference patterns:**
- Existing widget (to be moved + parameterized): `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx`
- Existing page (model for new pages): `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`
- Math: `lib/deficit/calc.ts` (extend; do not break)
- API client: `lib/deficit/meal-plan-api.ts` (no edits)
- SEO components: `components/seo/{content-section,faq-section,related-guides}.tsx`

---

## File Structure

| File                                                                                | Status   | Responsibility |
| ----------------------------------------------------------------------------------- | -------- | -------------- |
| `lib/deficit/calc.ts`                                                               | Modify   | Add `computeBmr(input)`; extend `validate(input, mode?)`. Formulas unchanged. |
| `lib/deficit/calc.test.ts`                                                          | Modify   | Add tests for `computeBmr` and mode-aware `validate`. Existing tests stay green. |
| `components/calculator/calorie-calculator.tsx`                                      | Create   | Parameterized client widget. Receives `mode` + `messagesNamespace`. Identical state machine to today's deficit widget; conditional rendering per `mode`. |
| `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx`           | Delete   | Replaced by the shared component. |
| `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`                        | Modify   | Replace local import with `@/components/calculator/calorie-calculator`; pass `mode="deficit"` and `messagesNamespace="deficitCalculator"`. |
| `app/(content)/[locale]/bmr-calculator/page.tsx`                                    | Create   | Server Component: metadata, hero, widget mount with `mode="bmr"`, SEO body, FAQ, related guides, conversion block, footer. |
| `app/(content)/[locale]/tdee-calculator/page.tsx`                                   | Create   | Same shape with `mode="tdee"` and `messagesNamespace="tdeeCalculator"`. |
| `messages/en.json`                                                                  | Modify   | Add namespaces `bmrCalculator` + `tdeeCalculator`. Add `relatedLinks.descBmrCalculator`, `relatedLinks.descTdeeCalculator`, `footer.bmrCalculator`, `footer.tdeeCalculator`. Cross-link sentence inside `deficitCalculator.seo.plan_*`. |
| `messages/de.json`, `messages/ru.json`, `messages/es.json`, `messages/fr.json`      | Modify   | Same shape as EN with locale-appropriate copy. |
| `components/seo/related-guides.tsx`                                                 | Modify   | Add `bmrCalculator: '/bmr-calculator'` and `tdeeCalculator: '/tdee-calculator'` to `SLUG_TO_HREF`. |
| `app/sitemap.ts`                                                                    | Modify   | Add `/bmr-calculator` and `/tdee-calculator` × 5 locales. |

---

## Task 1: Math layer — `computeBmr` + mode-aware `validate`

**Files:**
- Modify: `lib/deficit/calc.ts`
- Modify: `lib/deficit/calc.test.ts` (or `bmi.test.ts` style — create file if it doesn't exist; the spec assumes `calc.test.ts` exists already; check first)

**Why:** Two pure-math additions: `computeBmr(input)` lets BMR mode render the hero number without needing `activity`. `validate(input, mode)` makes the form validator aware of which fields each mode requires — BMR doesn't need activity/goal/pace; TDEE needs activity but not goal/pace; deficit needs all of them.

- [ ] **Step 1: Check whether `lib/deficit/calc.test.ts` exists**

Run:
```bash
ls lib/deficit/calc.test.ts 2>&1
```

If missing, create an empty test file using vitest:
```bash
ls lib/bmi/bmi.test.ts
```
…then create `lib/deficit/calc.test.ts` mirroring its imports (vitest + the `calc.ts` exports).

- [ ] **Step 2: Write failing tests for `computeBmr`**

Add to `lib/deficit/calc.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calculate, computeBmr, validate } from './calc';

describe('computeBmr', () => {
  it('matches Mifflin–St Jeor male formula', () => {
    // 70kg, 175cm, 30y, male → BMR = 10*70 + 6.25*175 - 5*30 + 5 = 1648.75 → 1649
    const bmr = computeBmr({
      weight: 70, weightUnit: 'kg',
      height: 175, heightUnit: 'cm',
      age: 30, gender: 'male',
    });
    expect(bmr).toBe(1649);
  });

  it('matches Mifflin–St Jeor female formula', () => {
    // 60kg, 165cm, 28y, female → BMR = 10*60 + 6.25*165 - 5*28 - 161 = 1330.25 → 1330
    const bmr = computeBmr({
      weight: 60, weightUnit: 'kg',
      height: 165, heightUnit: 'cm',
      age: 28, gender: 'female',
    });
    expect(bmr).toBe(1330);
  });

  it('converts lb to kg internally', () => {
    const bmrKg = computeBmr({
      weight: 70, weightUnit: 'kg',
      height: 175, heightUnit: 'cm',
      age: 30, gender: 'male',
    });
    const bmrLb = computeBmr({
      weight: 154.324, weightUnit: 'lb', // 70kg in lb
      height: 175, heightUnit: 'cm',
      age: 30, gender: 'male',
    });
    expect(Math.abs(bmrKg - bmrLb)).toBeLessThanOrEqual(1); // rounding
  });

  it('matches calculate(...).bmr exactly when given the same input', () => {
    const input = {
      weight: 70, weightUnit: 'kg' as const,
      height: 175, heightUnit: 'cm' as const,
      age: 30, gender: 'male' as const,
    };
    const bmr = computeBmr(input);
    const full = calculate({
      ...input,
      activity: 'sedentary',
      goal: 'maintain',
      pace: 'normal',
    });
    expect(bmr).toBe(full.bmr);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:
```bash
npx vitest run lib/deficit/calc.test.ts
```

Expected: failures because `computeBmr` is not exported.

- [ ] **Step 4: Implement `computeBmr` in `lib/deficit/calc.ts`**

Add after the `kgToLb` export and before `CalcInput`:

```ts
export type BmrInput = Pick<
  CalcInput,
  'weight' | 'weightUnit' | 'height' | 'heightUnit' | 'age' | 'gender'
>;

export function computeBmr(input: BmrInput): number {
  const kg = input.weightUnit === 'kg' ? input.weight : lbToKg(input.weight);
  const cm = input.heightUnit === 'cm' ? input.height : inToCm(input.height);
  return Math.round(mifflin(kg, cm, input.age, input.gender));
}
```

(The private `mifflin` helper already exists at the top of the file. `lbToKg` and `inToCm` are already exported.)

- [ ] **Step 5: Run tests, expect all `computeBmr` cases to pass**

Run:
```bash
npx vitest run lib/deficit/calc.test.ts
```

Expected: PASS for the 4 `computeBmr` cases.

- [ ] **Step 6: Write failing tests for mode-aware `validate`**

Add to the same test file:

```ts
describe('validate (mode-aware)', () => {
  const fullInput = {
    weight: 70, weightUnit: 'kg' as const,
    height: 175, heightUnit: 'cm' as const,
    age: 30, gender: 'male' as const,
    activity: 'moderate' as const,
    goal: 'lose' as const,
    pace: 'normal' as const,
  };

  it('default mode (no arg) validates as deficit', () => {
    expect(validate(fullInput)).toBeNull();
    const { goal: _, ...noGoal } = fullInput;
    expect(validate(noGoal as any)).toEqual({ field: 'goal', reason: 'required' });
  });

  it('bmr mode accepts inputs without activity/goal/pace', () => {
    const bmrInput = {
      weight: 70, weightUnit: 'kg' as const,
      height: 175, heightUnit: 'cm' as const,
      age: 30, gender: 'male' as const,
    };
    expect(validate(bmrInput, 'bmr')).toBeNull();
  });

  it('bmr mode still flags missing weight', () => {
    expect(validate({
      height: 175, heightUnit: 'cm',
      age: 30, gender: 'male',
    } as any, 'bmr')).toEqual({ field: 'weight', reason: 'required' });
  });

  it('bmr mode still range-checks weight (>250 kg)', () => {
    expect(validate({
      weight: 300, weightUnit: 'kg',
      height: 175, heightUnit: 'cm',
      age: 30, gender: 'male',
    } as any, 'bmr')).toEqual({ field: 'weight', reason: 'range' });
  });

  it('tdee mode requires activity but not goal/pace', () => {
    const tdeeInput = {
      weight: 70, weightUnit: 'kg' as const,
      height: 175, heightUnit: 'cm' as const,
      age: 30, gender: 'male' as const,
      activity: 'moderate' as const,
    };
    expect(validate(tdeeInput, 'tdee')).toBeNull();
    expect(validate({ ...tdeeInput, activity: undefined } as any, 'tdee'))
      .toEqual({ field: 'activity', reason: 'required' });
  });

  it('deficit mode (explicit) requires everything', () => {
    expect(validate(fullInput, 'deficit')).toBeNull();
    const { pace: _p, ...noPace } = fullInput;
    expect(validate(noPace as any, 'deficit'))
      .toEqual({ field: 'pace', reason: 'required' });
  });

  it('same input × three modes yields three distinct outcomes', () => {
    const minimal = {
      weight: 70, weightUnit: 'kg' as const,
      height: 175, heightUnit: 'cm' as const,
      age: 30, gender: 'male' as const,
    } as any;
    expect(validate(minimal, 'bmr')).toBeNull();
    expect(validate(minimal, 'tdee')).toEqual({ field: 'activity', reason: 'required' });
    expect(validate(minimal, 'deficit')).toEqual({ field: 'activity', reason: 'required' });
  });
});
```

- [ ] **Step 7: Run tests, verify failures**

Run:
```bash
npx vitest run lib/deficit/calc.test.ts
```

Expected: the `validate` mode tests fail because the function doesn't accept a mode arg yet.

- [ ] **Step 8: Implement mode-aware `validate`**

In `lib/deficit/calc.ts`, replace the existing `validate` signature with:

```ts
export type ValidateMode = 'bmr' | 'tdee' | 'deficit';

export function validate(
  input: Partial<CalcInput>,
  mode: ValidateMode = 'deficit',
): ValidationError | null {
  // weight/height/age/gender — required in all modes
  if (input.weight === undefined || Number.isNaN(input.weight)) {
    return { field: 'weight', reason: 'required' };
  }
  if (input.weightUnit === undefined) {
    return { field: 'weightUnit', reason: 'required' };
  }
  const weightKg = input.weightUnit === 'kg' ? input.weight : lbToKg(input.weight);
  if (weightKg < 30 || weightKg > 250) {
    return { field: 'weight', reason: 'range' };
  }

  if (input.height === undefined || Number.isNaN(input.height)) {
    return { field: 'height', reason: 'required' };
  }
  if (input.heightUnit === undefined) {
    return { field: 'heightUnit', reason: 'required' };
  }
  const heightCm = input.heightUnit === 'cm' ? input.height : inToCm(input.height);
  if (heightCm < 120 || heightCm > 250) {
    return { field: 'height', reason: 'range' };
  }

  if (input.age === undefined || Number.isNaN(input.age)) {
    return { field: 'age', reason: 'required' };
  }
  if (input.age < 14 || input.age > 100) {
    return { field: 'age', reason: 'range' };
  }

  if (input.gender !== 'male' && input.gender !== 'female') {
    return { field: 'gender', reason: 'required' };
  }

  if (mode === 'bmr') {
    return null;
  }

  const validActivities: Activity[] = ['sedentary', 'light', 'moderate', 'very', 'extra'];
  if (input.activity === undefined || !validActivities.includes(input.activity)) {
    return { field: 'activity', reason: 'required' };
  }

  if (mode === 'tdee') {
    return null;
  }

  const validGoals: Goal[] = ['lose', 'maintain', 'gain'];
  if (input.goal === undefined || !validGoals.includes(input.goal)) {
    return { field: 'goal', reason: 'required' };
  }

  if (input.pace === undefined || !PACE_KEYS.includes(input.pace)) {
    return { field: 'pace', reason: 'required' };
  }

  return null;
}
```

- [ ] **Step 9: Run all tests in this file, verify all pass**

Run:
```bash
npx vitest run lib/deficit/calc.test.ts
```

Expected: all tests PASS — both new ones and any pre-existing ones.

- [ ] **Step 10: Run typecheck on the project**

Run:
```bash
npx tsc --noEmit
```

Expected: clean. If anything in the deficit widget breaks because of the changed `validate` signature, it shouldn't — we kept the default parameter `'deficit'`, so single-arg call sites still type-check.

- [ ] **Step 11: Commit**

```bash
git add lib/deficit/calc.ts lib/deficit/calc.test.ts
git commit -m "Add lib/deficit/calc.ts::computeBmr + mode-aware validate"
```

---

## Task 2: Move + parameterize the deficit widget

**Files:**
- Create: `components/calculator/calorie-calculator.tsx`
- Delete: `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx`
- Modify: `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`

**Why:** Three pages will share one widget. The new file becomes the single source of truth. This task is a pure move + add-props refactor — behavior on `/calorie-deficit-calculator` must remain identical.

- [ ] **Step 1: Create the directory**

Run:
```bash
mkdir -p components/calculator
```

- [ ] **Step 2: Copy widget into the new location**

Run:
```bash
cp app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx components/calculator/calorie-calculator.tsx
```

- [ ] **Step 3: Update the exported component name + add props**

Open `components/calculator/calorie-calculator.tsx`. Change:

```ts
export function CalculatorWidget() {
  const t = useTranslations('deficitCalculator');
  // ...
}
```

to:

```ts
type Mode = 'bmr' | 'tdee' | 'deficit';

type Props = {
  mode: Mode;
  messagesNamespace: 'bmrCalculator' | 'tdeeCalculator' | 'deficitCalculator';
};

export function CalorieCalculator({ mode, messagesNamespace }: Props) {
  const t = useTranslations(messagesNamespace);
  // ...
}
```

Update the `Translator` type alias near the bottom — it currently uses `'deficitCalculator'`. Change it to accept any of the three namespaces, since callers pass `t` from `useTranslations(messagesNamespace)`:

```ts
type Translator = (key: string, values?: Record<string, string | number>) => string;
```

(Less specific but simpler. The existing rich-translation calls inside `FormView`/`ResultView`/`PlanView` only use `t(key)` and `t(key, params)`, both covered.)

If `t.rich` is used anywhere in the widget, keep `ReturnType<typeof useTranslations>` for that branch instead. Grep first:

```bash
grep -n "t\.rich\|t\.raw" components/calculator/calorie-calculator.tsx
```

If no matches, the simpler `Translator` type above is enough.

- [ ] **Step 4: Update the analytics page-name string to be mode-derived**

Find:
```ts
track('calculator_viewed', { page: 'calorie_deficit_calculator', locale });
```

Replace with:
```ts
const pageNameFor: Record<Mode, string> = {
  bmr: 'bmr_calculator',
  tdee: 'tdee_calculator',
  deficit: 'calorie_deficit_calculator',
};
track('calculator_viewed', { page: pageNameFor[mode], mode, locale });
```

(More analytics changes land in Task 6 — this one just keeps the current event format from regressing.)

- [ ] **Step 5: Update `STORAGE_KEY_USED` / `STORAGE_KEY_DATA` to be mode-derived**

Find:
```ts
const STORAGE_KEY_USED = 'nuvvoo_deficit_plan_used';
const STORAGE_KEY_DATA = 'nuvvoo_deficit_plan_data';
```

Remove these constants. Inside the component body, derive keys from `mode`:

```ts
const storageKeyUsed = `nuvvoo_${mode}_plan_used`;
const storageKeyData = `nuvvoo_${mode}_plan_data`;
```

…and replace all references. For `mode='deficit'` this yields the same key as today, so existing users' cached plans are preserved.

- [ ] **Step 6: Update the deficit page to use the new component**

Open `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`. Replace:

```ts
import { CalculatorWidget } from './calculator-widget';
```

with:

```ts
import { CalorieCalculator } from '@/components/calculator/calorie-calculator';
```

And replace the JSX `<CalculatorWidget />` with:

```tsx
<CalorieCalculator mode="deficit" messagesNamespace="deficitCalculator" />
```

- [ ] **Step 7: Delete the old widget file**

Run:
```bash
git rm app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx
```

- [ ] **Step 8: Typecheck and build**

Run:
```bash
npx tsc --noEmit
npx next build
```

Expected: clean. If the build complains about i18n keys, none should be missing yet — we haven't added the new namespaces (those come in Tasks 7+).

- [ ] **Step 9: Manual smoke — deficit page still works**

Run:
```bash
npm run dev
```

Visit `http://localhost:3000/calorie-deficit-calculator`. Fill the form (weight/height/age/gender/activity/goal). Submit. Confirm: result shows target kcal, weekly delta, BMR/TDEE plate, macros. Click "Get my first day plan". Confirm: plan view loads, App Store CTA visible, rating stars visible. Reload the page — plan rehydrates from `localStorage.getItem('nuvvoo_deficit_plan_data')`.

- [ ] **Step 10: Commit**

```bash
git add components/calculator/calorie-calculator.tsx \
  app/(content)/[locale]/calorie-deficit-calculator/page.tsx
git commit -m "Move deficit widget to components/calculator with mode prop"
```

---

## Task 3: Mode-aware FormView rendering

**Files:**
- Modify: `components/calculator/calorie-calculator.tsx`

**Why:** BMR and TDEE pages must not show fields that don't apply to their query intent. Activity hides on BMR; goal+pace hide on both BMR and TDEE.

- [ ] **Step 1: Set defaults per mode**

Inside the widget body where `DEFAULT_FORM` is currently defined as a module constant, replace it with a function:

```ts
function defaultForm(mode: Mode): FormState {
  return {
    weight: '',
    weightUnit: 'lb',
    heightCm: '',
    heightFt: '',
    heightIn: '',
    heightUnit: 'in',
    age: '',
    gender: '',
    activity: '',
    goal: mode === 'deficit' ? 'lose' : 'maintain',
    pace: 'normal',
    diet: 'none',
    allergies: [],
  };
}
```

Replace `useState<FormState>(DEFAULT_FORM)` with `useState<FormState>(() => defaultForm(mode))`.

- [ ] **Step 2: Pass `mode` to `FormView`**

Change `FormView` signature to add `mode: Mode`. Update the JSX where `FormView` is rendered (search for `<FormView`) to pass `mode={mode}`.

- [ ] **Step 3: Conditional fields**

Inside `FormView`, wrap the activity select with `{mode !== 'bmr' && (...)}`, and wrap the goal segment + pace select with `{mode === 'deficit' && (...)}`.

The pace select is already conditional on `form.goal !== 'maintain'`; keep that condition nested inside the `mode === 'deficit'` gate.

- [ ] **Step 4: Submit button label per mode**

The current submit button reads `{t('form.submit')}`. Replace with:

```tsx
{mode === 'bmr'
  ? t('form.submitBmr')
  : mode === 'tdee'
  ? t('form.submitTdee')
  : t('form.submit')}
```

- [ ] **Step 5: Use mode-aware validate on form submit**

Find `handleSubmit`:

```ts
const validationError = validate(input);
```

Change to:

```ts
const validationError = validate(input, mode);
```

- [ ] **Step 6: Typecheck**

Run:
```bash
npx tsc --noEmit
```

- [ ] **Step 7: Manual smoke — deficit page still renders all fields**

`npm run dev` → `/calorie-deficit-calculator`. Confirm activity, goal, pace are still visible and the page behaves identically to before. (BMR/TDEE pages don't exist yet — that's Tasks 13–14.)

- [ ] **Step 8: Commit**

```bash
git add components/calculator/calorie-calculator.tsx
git commit -m "Calculator widget: hide form fields by mode"
```

---

## Task 4: ResultView per mode + upgrade panel

**Files:**
- Modify: `components/calculator/calorie-calculator.tsx`

**Why:** BMR/TDEE pages need different hero numbers and an "upgrade panel" that reveals missing fields when the user wants an AI plan.

- [ ] **Step 1: Branch the result render by mode**

`handleSubmit` currently calls `calculate(input as CalcInput)` and then `setPhase('result')`. For BMR mode, we don't need to call `calculate()` (activity is missing). Restructure:

```ts
function handleSubmit(e: React.FormEvent): void {
  e.preventDefault();
  const input = toCalcInput(form);
  const validationError = validate(input, mode);
  if (validationError !== null) {
    setError(validationError);
    return;
  }

  if (mode === 'bmr') {
    // Hero number is BMR only; no need to materialize TDEE/target/macros.
    const bmrValue = computeBmr(input as BmrInput);
    setResult({
      bmr: bmrValue,
      tdee: 0,
      target: 0,
      weeklyDeltaKg: 0,
      weeklyDeltaLb: 0,
      clamped: false,
      weightKg: input.weightUnit === 'kg' ? input.weight! : lbToKg(input.weight!),
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    });
  } else {
    const calcResult = calculate(input as CalcInput);
    setResult(calcResult);
  }

  setError(null);
  setPhase('result');
  track('calculator_completed', { /* ...existing params... */ mode });
}
```

Add `import { computeBmr, type BmrInput, lbToKg } from '@/lib/deficit/calc';` if not already imported.

- [ ] **Step 2: Add `upgrading` sub-state**

Inside the widget body, add:

```ts
const [upgrading, setUpgrading] = useState(false);
```

When `handleEdit` is called or phase changes away from `result`, reset it:

```ts
function handleEdit(): void {
  setPhase('form');
  setUpgrading(false);
}
```

- [ ] **Step 3: Pass `mode` and `upgrading` to `ResultView`**

Add to the `ResultView` props: `mode: Mode`, `upgrading: boolean`, `onUpgrade: () => void`, `onCancelUpgrade: () => void`. Update the JSX render site to pass them.

- [ ] **Step 4: BMR result rendering**

Inside `ResultView`, when `mode === 'bmr'`, render:

```tsx
<div>
  <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
    {result.bmr.toLocaleString()}
  </p>
  <p className="mt-1 text-sm text-slate-500">{t('result.kcalUnit')}</p>
  <p className="mt-3 text-sm text-slate-700">{t('result.bmrSubtitle')}</p>
  <p className="mt-2 text-xs text-slate-500">{t('result.bmrExplain')}</p>
</div>
```

Hide the BMR+TDEE plate, weekly delta, macros, clamped note in BMR mode.

- [ ] **Step 5: TDEE result rendering**

When `mode === 'tdee'`, render:

```tsx
<div>
  <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
    {result.tdee.toLocaleString()}
  </p>
  <p className="mt-1 text-sm text-slate-500">{t('result.kcalUnit')}</p>
  <p className="mt-3 text-sm text-slate-700">{t('result.tdeeSubtitle')}</p>
</div>

<p className="text-xs text-slate-500">{t('result.tdeeRestingLine', { bmr: result.bmr.toLocaleString() })}</p>

{/* Macros plate — same as deficit, reuses keys */}
<div>{/* macro grid */}</div>
```

Hide weekly delta + clamped note + target line.

- [ ] **Step 6: Deficit result rendering — unchanged**

Keep the existing JSX block as the `mode === 'deficit'` branch.

- [ ] **Step 7: Upgrade CTA card (BMR/TDEE only, `!upgrading`)**

Below the result content for BMR/TDEE modes, when `!upgrading && !alreadyUsed`, render:

```tsx
<div className="border-t border-slate-200 pt-5">
  <p className="text-sm font-medium text-slate-900">{t('upgrade.title')}</p>
  <p className="mt-1 text-sm text-slate-600">{t('upgrade.subtitle')}</p>
  <button
    type="button"
    onClick={onUpgrade}
    aria-expanded={upgrading}
    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
  >
    {t('upgrade.cta')}
  </button>
</div>
```

`onUpgrade` is wired in the parent to `() => { setUpgrading(true); track('upgrade_clicked', { mode, locale }); }`.

- [ ] **Step 8: Upgrade panel (BMR/TDEE only, `upgrading === true`)**

When `upgrading === true`, render an inline form with the missing fields:

```tsx
<div role="region" aria-label={t('upgrade.title')} className="space-y-4 border-t border-slate-200 pt-5">
  {/* BMR mode: activity */}
  {mode === 'bmr' && (
    <div>
      <label>...activity select...</label>
    </div>
  )}

  {/* BMR + TDEE: goal */}
  <div>
    <label>{t('form.goalLabel')}</label>
    <div className="mt-1 grid grid-cols-3 gap-2">
      <SegmentButton selected={form.goal === 'lose'} onClick={() => onField('goal', 'lose')} label={t('form.goalLose')} />
      <SegmentButton selected={form.goal === 'maintain'} onClick={() => onField('goal', 'maintain')} label={t('form.goalMaintain')} />
      <SegmentButton selected={form.goal === 'gain'} onClick={() => onField('goal', 'gain')} label={t('form.goalGain')} />
    </div>
  </div>

  {/* BMR + TDEE: pace (conditional on goal≠maintain) */}
  {form.goal !== 'maintain' && (
    <div>
      <label>{t('form.paceLabel')}</label>
      {/* same pace select as FormView; consider extracting `<PaceSelect>` if duplication grows */}
    </div>
  )}

  {/* BMR + TDEE: diet + allergies — same as deficit's existing result-view inline fields */}
  <div>...diet segments...</div>
  <AllergiesInput value={form.allergies} onChange={(next) => onField('allergies', next)} t={t} />

  {/* Validation error display */}
  {errorMessage !== null && <p className="text-xs text-red-600">{errorMessage}</p>}

  {/* Get my plan button */}
  <button
    onClick={onGetPlan}
    disabled={planLoading}
    className="..."
  >
    {planLoading ? t('plan.loading') : t('upgrade.cta')}
  </button>
</div>
```

- [ ] **Step 9: Reuse `handleGetPlan` for the upgrade-panel submit, with re-validation**

`handleGetPlan` (the existing function used by the deficit Get-plan button) is fine for BMR/TDEE too, but before calling `generatePlan` we must `validate(input, 'deficit')` because now we need all fields. Add at the top of the function:

```ts
const fullValidation = validate(toCalcInput(form), 'deficit');
if (fullValidation !== null) {
  setError(fullValidation);
  return;
}
```

For BMR mode specifically, before calling `generatePlan` we also need to compute the `result` shape because the BMR-mode `handleSubmit` left tdee/target/macros at zero. Right before the existing `generatePlan` call, if `mode === 'bmr'`, re-run `calculate()` and update `result`:

```ts
if (mode === 'bmr') {
  const fullResult = calculate(toCalcInput(form) as CalcInput);
  setResult(fullResult); // generatePlan reads from `result.*` below
  // Use fullResult immediately for the payload — don't rely on async setState here:
  payload.calories_target = fullResult.target;
  payload.weight_kg = fullResult.weightKg;
  payload.protein_g = fullResult.proteinG;
  payload.carbs_g = fullResult.carbsG;
  payload.fat_g = fullResult.fatG;
}
```

(Make `payload` `let` instead of `const` if needed.)

- [ ] **Step 10: Auto-focus first field on upgrade panel open**

Add a `useEffect` that runs when `upgrading` flips to `true`, focusing the activity select (BMR) or first goal button (TDEE). Use a ref on the wrapping `role="region"` div and call `.focus()` on its first focusable child, or attach refs to specific inputs.

- [ ] **Step 11: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 12: Commit**

```bash
git add components/calculator/calorie-calculator.tsx
git commit -m "Calculator widget: BMR/TDEE result heroes + upgrade panel"
```

---

## Task 5: Per-mode localStorage gate

**Files:**
- Modify: `components/calculator/calorie-calculator.tsx`

**Why:** Task 2 already derived the storage keys from `mode`. Verify the gate behaves correctly per mode and that the deficit key matches the legacy name byte-for-byte.

- [ ] **Step 1: Grep for any remaining literal `nuvvoo_deficit_plan_*` strings**

Run:
```bash
grep -n "nuvvoo_deficit_plan" components/calculator/calorie-calculator.tsx
```

Expected: no matches (all references should go through `storageKeyUsed` / `storageKeyData`). If any remain, replace them.

- [ ] **Step 2: Confirm key compatibility**

In the widget, `mode='deficit'` yields `nuvvoo_deficit_plan_used` / `nuvvoo_deficit_plan_data` — the same strings as before. No migration code needed.

- [ ] **Step 3: Manual test of rehydration**

`npm run dev` → `/calorie-deficit-calculator`. Generate a plan. Reload page. Confirm plan view rehydrates. Open DevTools → Application → Local Storage and confirm `nuvvoo_deficit_plan_data` is populated.

- [ ] **Step 4: No commit needed** (changes already committed in Task 2). If grep found something, commit the fix:

```bash
git add components/calculator/calorie-calculator.tsx
git commit -m "Cleanup: remove residual hardcoded deficit storage keys"
```

---

## Task 6: Analytics — `mode` param + `upgrade_clicked` event

**Files:**
- Modify: `components/calculator/calorie-calculator.tsx`

**Why:** Make every analytics event mode-aware so dashboards can split the funnel by entry point.

- [ ] **Step 1: Audit all `track(` calls**

Run:
```bash
grep -n "track(" components/calculator/calorie-calculator.tsx
```

Expected calls: `calculator_viewed`, `calculator_completed`, `plan_cta_clicked`, `plan_generated`, `plan_rated`, `app_click`.

- [ ] **Step 2: Add `mode` param to each**

For every call except `plan_rated` and `click_platform`, add `mode` to the params object. Example:

```ts
track('calculator_completed', {
  mode,
  target_kcal: calcResult.target,
  goal: form.goal,
  activity: form.activity,
  gender: form.gender,
  clamped: calcResult.clamped,
  locale,
});
```

For `calculator_viewed`, also keep the legacy `page` field as decided in the spec:

```ts
track('calculator_viewed', { mode, page: pageNameFor[mode], locale });
```

- [ ] **Step 3: Add the new `upgrade_clicked` event**

In the click handler for the upgrade CTA (Task 4, Step 7), add:

```ts
function handleUpgradeClick(): void {
  track('upgrade_clicked', { mode, locale });
  setUpgrading(true);
}
```

- [ ] **Step 4: Mode-prefix `button_location` for App Store CTAs**

Find all uses of `useAppStoreLink('deficit_calculator_...')` in the widget. Replace the literal strings with mode-derived ones:

```ts
const planButtonLocation = `${mode === 'deficit' ? 'deficit_calculator' : `${mode}_calculator`}_plan`;
const planBadgeButtonLocation = `${mode === 'deficit' ? 'deficit_calculator' : `${mode}_calculator`}_plan_badge`;
const resultUsedButtonLocation = `${mode === 'deficit' ? 'deficit_calculator' : `${mode}_calculator`}_result_used`;
const resultUsedBadgeButtonLocation = `${mode === 'deficit' ? 'deficit_calculator' : `${mode}_calculator`}_result_used_badge`;
```

For deficit, these resolve to the existing strings (`deficit_calculator_plan` etc.) — no regression in dashboard filters.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add components/calculator/calorie-calculator.tsx
git commit -m "Calculator widget: mode param on analytics events + upgrade_clicked"
```

---

## Task 7: `bmrCalculator` namespace — EN

**Files:**
- Modify: `messages/en.json`

**Why:** New BMR page needs its own SEO copy, form labels, FAQ, etc. Each namespace is self-contained.

- [ ] **Step 1: Append the `bmrCalculator` block to `messages/en.json`**

After the closing `}` of `deficitCalculator`, add (or after `bmiCalculator` if it exists already):

```json
"bmrCalculator": {
  "metadata": {
    "title": "BMR Calculator: Resting Metabolic Rate (Mifflin-St Jeor)",
    "description": "Free BMR calculator using the Mifflin-St Jeor equation. Find out how many calories your body burns at complete rest, plus get a personalized one-day meal plan in seconds.",
    "ogTitle": "BMR Calculator with AI Day Plan",
    "ogDescription": "Calculate your basal metabolic rate and turn it into a real meal plan."
  },
  "h1": "BMR Calculator",
  "intro": "Find out how many calories your body burns at complete rest. Your BMR is the foundation of any calorie target — once you know it, you can build a plan that actually fits you.",
  "trustFree": "Free",
  "trustNoAccount": "No account",
  "trustPrivate": "Private by default",
  "form": {
    "weightLabel": "Weight",
    "heightLabel": "Height",
    "ageLabel": "Age",
    "ageUnit": "years",
    "genderLabel": "Sex",
    "genderMale": "Male",
    "genderFemale": "Female",
    "activityLabel": "Activity level",
    "activitySedentary": "Sedentary (little or no exercise)",
    "activityLight": "Lightly active (1\u20133 days/week)",
    "activityModerate": "Moderately active (3\u20135 days/week)",
    "activityVery": "Very active (6\u20137 days/week)",
    "activityExtra": "Extra active (twice daily / physical job)",
    "goalLabel": "Goal",
    "goalLose": "Lose weight",
    "goalMaintain": "Maintain",
    "goalGain": "Gain weight",
    "paceLabel": "How fast",
    "pace_slow": "Slow",
    "pace_normal": "Normal",
    "pace_fast": "Fast",
    "paceRateKg": "{name}: {rate} kg/week",
    "paceRateLb": "{name}: {rate} lb/week",
    "submit": "Calculate BMR",
    "submitBmr": "Calculate BMR",
    "errorRequired": "Please fill in this field.",
    "errorRange": "Please enter a value within the allowed range.",
    "agePlaceholder": "30",
    "dietLabel": "Diet",
    "diet_none": "None",
    "diet_vegetarian": "Vegetarian",
    "diet_pescatarian": "Pescatarian",
    "diet_vegan": "Vegan",
    "allergiesLabel": "Allergies & dislikes",
    "allergiesPlaceholder": "e.g. peanuts, shellfish",
    "allergiesAdd": "Add",
    "allergiesRemove": "Remove",
    "allergiesAtCap": "Limit reached",
    "allergiesHint": "{count}/{max} \u00b7 press Enter to add"
  },
  "result": {
    "edit": "Edit answers",
    "kcalUnit": "kcal/day",
    "bmrSubtitle": "Your resting metabolism \u2014 calories your body burns at rest",
    "bmrExplain": "This is BMR. Your body needs this many calories even at full rest. Add an activity level to get your total daily burn."
  },
  "upgrade": {
    "title": "Want a personalized meal plan?",
    "subtitle": "Tell us your activity, goal, and any food preferences \u2014 we'll calculate your daily target and build a sample day.",
    "cta": "Get my plan"
  },
  "plan": {
    "loading": "Generating your plan\u2026",
    "errorTitle": "Couldn't generate a plan",
    "errorRetry": "Try again",
    "rateLimitedHourly": "You've hit this hour's plan limit. Try again in an hour.",
    "rateLimitedDaily": "You've hit today's plan limit. Try again tomorrow.",
    "heading": "Goal",
    "totalLabel": "Total",
    "kcalUnit": "kcal",
    "slotBreakfast": "Breakfast",
    "slotLunch": "Lunch",
    "slotDinner": "Dinner",
    "slotSnack": "Snack",
    "macros": "P {p}g \u00b7 C {c}g \u00b7 F {f}g"
  },
  "conversion": {
    "title": "Want a new plan every day and automatic tracking?",
    "subtitle": "Try Nuvvoo, the modern calorie tracker.",
    "cta": "Get a plan like this every day \u2192"
  },
  "seo": {
    "h2_what": "What is BMR?",
    "what_p1": "Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest \u2014 just to keep your heart beating, your lungs moving, your brain thinking, and your cells repairing. It's the irreducible cost of being alive.",
    "what_p2": "BMR makes up about 60\u201375% of total daily calorie burn for most adults. The remainder comes from physical activity and the small thermic effect of digesting food.",
    "what_p3": "Knowing your BMR tells you the absolute floor of what your body needs. Eating below it for extended periods is unsustainable and counterproductive.",
    "h2_how": "How the BMR calculator works",
    "how_p1": "We use the Mifflin\u2013St Jeor equation, the formula most clinicians and registered dietitians rely on. It estimates BMR from your weight, height, age, and sex.",
    "how_p2": "For men: BMR = 10 \u00d7 weight(kg) + 6.25 \u00d7 height(cm) \u2212 5 \u00d7 age + 5. For women: same, minus 161 instead of plus 5. The formula has been validated against indirect calorimetry within \u00b110% for most non-athletic adults.",
    "how_p3": "If you want your total daily burn instead of just resting, see the <tdee>TDEE calculator</tdee>. If you want the calorie target for losing weight, see the <deficit>calorie deficit calculator</deficit>.",
    "h2_plan": "From BMR to a daily plan",
    "plan_p1": "BMR is a starting point, not a meal plan. To eat for a goal, you need to add activity (TDEE) and choose a direction \u2014 lose, maintain, or gain.",
    "plan_p2": "Click \"Want a personalized meal plan?\" above and we'll ask the two extra questions, calculate your daily target, and assemble a one-day plan \u2014 3\u20134 meals, total within 10% of target, with portion sizes already scaled.",
    "plan_p3": "It's one plan, on us. If you want a fresh plan every day plus automatic tracking that learns your habits, that's what Nuvvoo does."
  },
  "faq": {
    "q1": "Is BMR the same as TDEE?",
    "a1": "No. BMR is calories burned at rest. TDEE (Total Daily Energy Expenditure) adds the calories you burn through activity. TDEE = BMR \u00d7 an activity multiplier (1.2 for sedentary up to 1.9 for very active).",
    "q2": "Can I eat just my BMR to lose weight?",
    "a2": "It will produce weight loss but is rarely a good idea long-term. Eating at or below BMR makes most people miserable, drops energy and mood, and stalls progress as metabolism adapts. A modest deficit below your TDEE works better.",
    "q3": "How accurate is Mifflin\u2013St Jeor?",
    "a3": "Within \u00b110% for most non-athletic adults. It's less accurate for very lean or very muscular people \u2014 the formula doesn't see body composition, only total weight. If you have a lot of muscle, your real BMR is higher than the equation says.",
    "q4": "Why does BMR drop as I age?",
    "a4": "Two main reasons: loss of lean mass (muscle is metabolically active tissue) and small downshifts in cell-level metabolic rate. The age term in Mifflin\u2013St Jeor (\u22125 \u00d7 age) approximates the first; you can blunt it with resistance training.",
    "q5": "Should I always eat above my BMR?",
    "a5": "For most healthy adults trying to lose weight slowly, yes \u2014 stay above BMR and create the deficit from your TDEE, not your BMR. People in supervised medical programs sometimes eat below BMR temporarily, but that's not a self-managed strategy."
  }
}
```

- [ ] **Step 2: Validate JSON**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('messages/en.json', 'utf8'))"
```

Expected: silent (no syntax error).

- [ ] **Step 3: Commit**

```bash
git add messages/en.json
git commit -m "Add bmrCalculator namespace to EN messages"
```

---

## Task 8: Translate `bmrCalculator` to DE / RU / ES / FR

**Files:**
- Modify: `messages/de.json`, `messages/ru.json`, `messages/es.json`, `messages/fr.json`

**Why:** All five locales need parity. Per spec, machine translations ship in v1; copy-quality polish is a follow-up.

- [ ] **Step 1: Translate the EN content**

Use the same translation tool/pipeline the BMI feature used (see commit `f2042fd Translate bmiCalculator namespace to DE/RU/ES/FR` for prior art). If no script is checked in, use any LLM that translates the EN block four times, preserving keys and `{placeholders}` and `<markers>`.

For each locale, insert the translated `bmrCalculator` block at the same position as in EN.

- [ ] **Step 2: Validate all 4 JSON files**

```bash
for f in de ru es fr; do
  node -e "JSON.parse(require('fs').readFileSync('messages/$f.json', 'utf8'))" && echo "$f ok"
done
```

- [ ] **Step 3: Key-parity check across locales**

```bash
node -e "
const en = require('./messages/en.json').bmrCalculator;
const flatten = (o, p='') => Object.entries(o).flatMap(([k,v]) => typeof v === 'object' && v !== null && !Array.isArray(v) ? flatten(v, p+k+'.') : [p+k]);
const keys = new Set(flatten(en));
for (const loc of ['de','ru','es','fr']) {
  const ns = require('./messages/'+loc+'.json').bmrCalculator;
  const lk = new Set(flatten(ns));
  const missing = [...keys].filter(k => !lk.has(k));
  const extra = [...lk].filter(k => !keys.has(k));
  console.log(loc, 'missing:', missing.length, 'extra:', extra.length, missing.concat(extra).slice(0,3));
}
"
```

Expected: 0 / 0 for each locale.

- [ ] **Step 4: Commit**

```bash
git add messages/de.json messages/ru.json messages/es.json messages/fr.json
git commit -m "Translate bmrCalculator namespace to DE/RU/ES/FR"
```

---

## Task 9: `tdeeCalculator` namespace — EN

**Files:**
- Modify: `messages/en.json`

**Why:** TDEE page needs its own copy. Same shape as `bmrCalculator` but with TDEE-specific SEO/FAQ.

- [ ] **Step 1: Append the `tdeeCalculator` block to `messages/en.json`**

Use the same structure as `bmrCalculator` from Task 7, with these key differences:

```json
"tdeeCalculator": {
  "metadata": {
    "title": "TDEE Calculator: Total Daily Energy Expenditure",
    "description": "Free TDEE calculator. Find out how many calories your body burns each day, including activity. Eat this number to maintain weight, or use it as a baseline for a deficit.",
    "ogTitle": "TDEE Calculator with AI Day Plan",
    "ogDescription": "Calculate your total daily energy expenditure and turn it into a real meal plan."
  },
  "h1": "TDEE Calculator",
  "intro": "Calculate how many calories your body burns each day, including all your activity. Eat this number to maintain your weight \u2014 or use it as the baseline for a deficit or surplus.",
  ...
  "form": {
    ...
    "submit": "Calculate TDEE",
    "submitTdee": "Calculate TDEE",
    ...
  },
  "result": {
    "edit": "Edit answers",
    "kcalUnit": "kcal/day",
    "tdeeSubtitle": "Your daily calorie burn \u2014 eat this to maintain weight",
    "tdeeRestingLine": "Resting (BMR): {bmr} kcal",
    "bmrLabel": "BMR",
    "macrosLabel": "Suggested macros",
    "macroProtein": "Protein",
    "macroCarbs": "Carbs",
    "macroFat": "Fat"
  },
  "upgrade": {
    "title": "Want to lose or gain weight?",
    "subtitle": "Pick a goal and we'll build a daily plan around your target.",
    "cta": "Get my plan"
  },
  "plan": { ... same shape as bmrCalculator.plan ... },
  "conversion": { ... same ... },
  "seo": {
    "h2_what": "What is TDEE?",
    "what_p1": "Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a day \u2014 BMR (resting metabolism) plus everything you do on top: walking, working, exercise, fidgeting.",
    "what_p2": "TDEE is what you eat to stay the same weight. Eat below it to lose, eat above it to gain. It's the most useful single number in calorie planning.",
    "what_p3": "Most adult TDEEs fall between 1,800 and 3,200 kcal/day, depending on size and activity.",
    "h2_how": "How the TDEE calculator works",
    "how_p1": "We compute BMR with the Mifflin\u2013St Jeor equation, then multiply by an activity factor: 1.2 for sedentary, 1.375 for lightly active, 1.55 for moderately active, 1.725 for very active, 1.9 for extra active.",
    "how_p2": "Activity multipliers are rough \u2014 they encode a population average across walking, standing, and exercise. Your real TDEE varies a few hundred kcal day to day. We round to the nearest 10.",
    "how_p3": "If you want just your resting metabolism, see the <bmr>BMR calculator</bmr>. For a calorie target tuned to weight loss, see the <deficit>calorie deficit calculator</deficit>.",
    "h2_plan": "Using TDEE to plan meals",
    "plan_p1": "Knowing your TDEE is half the battle. The other half is eating consistently within it (for maintenance) or below it (for loss).",
    "plan_p2": "Click \"Want to lose or gain weight?\" above and we'll ask one more question (your goal), calculate the right target, and build a one-day plan with portions already sized.",
    "plan_p3": "Want a fresh plan daily plus tracking that learns your habits? That's what Nuvvoo does."
  },
  "faq": {
    "q1": "TDEE vs BMR \u2014 what's the difference?",
    "a1": "BMR is your resting burn. TDEE is BMR plus your activity. TDEE is always higher \u2014 typically 1.2\u00d7 to 1.9\u00d7 BMR.",
    "q2": "How accurate are activity multipliers?",
    "a2": "Within \u00b110\u201315% for most people. The multipliers are population averages \u2014 your individual factor depends on body composition, NEAT (fidgeting, standing), and exercise type. Recalibrate after a few weeks if scale weight drifts.",
    "q3": "Should I recalculate TDEE after losing weight?",
    "a3": "Yes. A smaller body burns fewer calories. Recompute every 5\u201310 lb (or 3\u20135 kg) of change so the target stays accurate.",
    "q4": "What if my activity varies day to day?",
    "a4": "Pick the multiplier that matches your average week, not your busiest or laziest day. If your week swings widely, average across 7 days. Many people use moderate (1.55) as a sensible default.",
    "q5": "Can I eat at TDEE and still lose weight?",
    "a5": "No \u2014 by definition, eating at TDEE means calorie balance. To lose, you need a deficit (eat below TDEE) or to raise activity. The <deficit>deficit calculator</deficit> handles the math."
  }
}
```

(Fill in the `...same...` parts by copying the corresponding blocks from `bmrCalculator`. The `plan.*` and `conversion.*` blocks are word-for-word identical across the new namespaces.)

- [ ] **Step 2: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('messages/en.json', 'utf8'))"
```

- [ ] **Step 3: Commit**

```bash
git add messages/en.json
git commit -m "Add tdeeCalculator namespace to EN messages"
```

---

## Task 10: Translate `tdeeCalculator` to DE / RU / ES / FR

Same process as Task 8 but for `tdeeCalculator`.

- [ ] **Step 1: Translate** (use same tooling as Task 8).
- [ ] **Step 2: JSON validate.**
- [ ] **Step 3: Key-parity check** (same script, swap `bmrCalculator` for `tdeeCalculator`).
- [ ] **Step 4: Commit:**

```bash
git add messages/{de,ru,es,fr}.json
git commit -m "Translate tdeeCalculator namespace to DE/RU/ES/FR"
```

---

## Task 11: Register footer + related-links keys for new pages

**Files:**
- Modify: `messages/en.json`, `messages/de.json`, `messages/ru.json`, `messages/es.json`, `messages/fr.json`
- Modify: `components/seo/related-guides.tsx`

**Why:** `RelatedGuides` reads description/footer labels via two existing patterns (`relatedLinks.desc<Slug>` and `footer.<slug>`). New slugs need both, in all locales.

- [ ] **Step 1: Add `relatedLinks.descBmrCalculator` + `descTdeeCalculator` to all 5 locales**

In each `messages/*.json`, inside the `relatedLinks` block, add:

```json
"descBmrCalculator": "Find your resting metabolic rate (Mifflin\u2013St Jeor).",
"descTdeeCalculator": "Calculate your total daily energy expenditure."
```

(Translate the descriptions appropriately for DE/RU/ES/FR.)

- [ ] **Step 2: Add `footer.bmrCalculator` + `footer.tdeeCalculator` to all 5 locales**

```json
"bmrCalculator": "BMR Calculator",
"tdeeCalculator": "TDEE Calculator"
```

(Translate as needed; the BMR/TDEE acronyms are loanwords across most locales — usually stays "BMR" / "TDEE" but check existing footer labels for the locale's convention.)

- [ ] **Step 3: Register slugs in `components/seo/related-guides.tsx`**

Open the file. Find `SLUG_TO_HREF` (mapping object). Add:

```ts
bmrCalculator: '/bmr-calculator',
tdeeCalculator: '/tdee-calculator',
```

- [ ] **Step 4: Typecheck + build**

```bash
npx tsc --noEmit
npx next build
```

- [ ] **Step 5: Commit**

```bash
git add messages/*.json components/seo/related-guides.tsx
git commit -m "Add bmr/tdee calculator slugs to RelatedGuides + footer + descKeys"
```

---

## Task 12: Server Component — `/bmr-calculator/page.tsx`

**Files:**
- Create: `app/(content)/[locale]/bmr-calculator/page.tsx`

**Why:** Hero + widget mount + SEO body + FAQ + related guides for the BMR page.

- [ ] **Step 1: Copy the deficit page as a template**

Run:
```bash
mkdir -p "app/(content)/[locale]/bmr-calculator"
cp "app/(content)/[locale]/calorie-deficit-calculator/page.tsx" \
   "app/(content)/[locale]/bmr-calculator/page.tsx"
```

- [ ] **Step 2: Edit the new page**

Open `app/(content)/[locale]/bmr-calculator/page.tsx`. Make these changes:

1. Change `const SLUG = 'calorie-deficit-calculator';` → `const SLUG = 'bmr-calculator';`
2. Change `getTranslations({ locale, namespace: 'deficitCalculator.metadata' })` → `getTranslations({ locale, namespace: 'bmrCalculator.metadata' })`
3. Change `await getTranslations('deficitCalculator')` → `await getTranslations('bmrCalculator')`
4. Replace `<CalorieCalculator mode="deficit" messagesNamespace="deficitCalculator" />` with `<CalorieCalculator mode="bmr" messagesNamespace="bmrCalculator" />`
5. Update cross-link `<Link href="/food-diary-for-weight-loss">` markers — replace `<food>` with `<tdee>` linking to `/tdee-calculator`, and `<chat>` with `<deficit>` linking to `/calorie-deficit-calculator`. These match the markers used in the new `bmrCalculator.seo.plan_*` strings.
6. Update related guides list:

```tsx
<RelatedGuides slugs={['tdeeCalculator', 'deficitCalculator', 'foodDiary', 'stayConsistent']} />
```

- [ ] **Step 3: Update `AppStoreBadge` `buttonLocation`**

In the conversion block, change `buttonLocation="deficit_calculator_conversion"` to `buttonLocation="bmr_calculator_conversion"`.

- [ ] **Step 4: Typecheck + build**

```bash
npx tsc --noEmit
npx next build
```

Expected: clean. Any missing translation keys will surface here.

- [ ] **Step 5: Smoke test**

`npm run dev` → `/bmr-calculator`. Confirm:
- H1 reads "BMR Calculator".
- Form shows weight/height/age/gender only — no activity/goal/pace.
- Submit → big BMR number with subtitle + explanation.
- "Want a personalized meal plan?" CTA visible below.
- Click CTA → upgrade panel appears with activity/goal/pace/diet/allergies.
- Submit → AI plan view appears (assuming the API is reachable).
- SEO body renders; FAQ items visible; related guides show TDEE + deficit links.

- [ ] **Step 6: Commit**

```bash
git add app/(content)/[locale]/bmr-calculator
git commit -m "Add /bmr-calculator Server Component"
```

---

## Task 13: Server Component — `/tdee-calculator/page.tsx`

Same as Task 12 but for TDEE.

- [ ] **Step 1: Copy template + edit**

```bash
mkdir -p "app/(content)/[locale]/tdee-calculator"
cp "app/(content)/[locale]/calorie-deficit-calculator/page.tsx" \
   "app/(content)/[locale]/tdee-calculator/page.tsx"
```

In the new file:
1. `SLUG = 'tdee-calculator'`
2. `namespace: 'tdeeCalculator.metadata'`
3. `getTranslations('tdeeCalculator')`
4. `<CalorieCalculator mode="tdee" messagesNamespace="tdeeCalculator" />`
5. Cross-link markers: `<bmr>` → `/bmr-calculator`, `<deficit>` → `/calorie-deficit-calculator`
6. `<RelatedGuides slugs={['bmrCalculator', 'deficitCalculator', 'foodDiary', 'mfpAlternative']} />`
7. `buttonLocation="tdee_calculator_conversion"`

- [ ] **Step 2: Typecheck + build**

```bash
npx tsc --noEmit
npx next build
```

- [ ] **Step 3: Smoke test**

`npm run dev` → `/tdee-calculator`. Confirm:
- H1 reads "TDEE Calculator".
- Form shows weight/height/age/gender + activity. No goal/pace.
- Submit → big TDEE number with subtitle + small "Resting: ..." line + macros plate.
- Upgrade CTA below → reveals goal/pace/diet/allergies.
- Plan flow works end to end.

- [ ] **Step 4: Commit**

```bash
git add app/(content)/[locale]/tdee-calculator
git commit -m "Add /tdee-calculator Server Component"
```

---

## Task 14: Sitemap

**Files:**
- Modify: `app/sitemap.ts`

**Why:** Google needs to discover the new URLs across all five locales.

- [ ] **Step 1: Read the current sitemap**

```bash
cat app/sitemap.ts
```

Identify where `/calorie-deficit-calculator` is listed.

- [ ] **Step 2: Add new URLs**

Add `/bmr-calculator` and `/tdee-calculator` for every locale, copying the same `priority` and `changeFrequency` as the deficit calculator entries.

- [ ] **Step 3: Build + verify**

```bash
npx next build
npm run start &
sleep 3
curl -s http://localhost:3000/sitemap.xml | grep -c "bmr-calculator"
curl -s http://localhost:3000/sitemap.xml | grep -c "tdee-calculator"
kill %1
```

Expected: 5 each (one EN bare URL + 4 locale-prefixed URLs).

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "Add /bmr-calculator and /tdee-calculator to sitemap"
```

---

## Task 15: Cross-link from deficit SEO → BMR/TDEE

**Files:**
- Modify: `messages/en.json`, `messages/de.json`, `messages/ru.json`, `messages/es.json`, `messages/fr.json`
- Modify: `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`

**Why:** Per spec, cross-linking must be bidirectional so a TDEE-intent searcher landing on the deficit page has a visible signpost back to `/tdee-calculator`.

- [ ] **Step 1: Edit `deficitCalculator.seo.plan_p3` in `messages/en.json`**

Current text ends with: "…If you want a fresh plan every day, plus automatic <chat>calorie tracking</chat> that learns your habits and stops feeling like homework. That's what Nuvvoo does."

Append a new short paragraph by adding a new key `plan_p4`:

```json
"plan_p4": "If you want just the raw numbers, see the <bmr>BMR calculator</bmr> or the <tdee>TDEE calculator</tdee>."
```

(Or extend `plan_p3`. Whichever is cleaner — `plan_p4` is safer because the existing page renders `plan_p1`/`p2`/`p3` separately.)

- [ ] **Step 2: Add the rendering for `plan_p4` in the deficit page**

Open `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`. After the existing `plan_p3` `<p>` block, add:

```tsx
<p>
  {t.rich('seo.plan_p4', {
    bmr: (chunks) => (
      <Link href="/bmr-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
        {chunks}
      </Link>
    ),
    tdee: (chunks) => (
      <Link href="/tdee-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
        {chunks}
      </Link>
    ),
  })}
</p>
```

- [ ] **Step 3: Translate `plan_p4` to DE / RU / ES / FR**

Same translation pipeline as Tasks 8/10.

- [ ] **Step 4: Typecheck + build**

```bash
npx tsc --noEmit
npx next build
```

- [ ] **Step 5: Smoke test**

`/calorie-deficit-calculator` → scroll to SEO body → confirm the new sentence + working links to `/bmr-calculator` and `/tdee-calculator`.

- [ ] **Step 6: Commit**

```bash
git add messages/*.json app/(content)/[locale]/calorie-deficit-calculator/page.tsx
git commit -m "Cross-link deficit SEO body to BMR/TDEE calculators"
```

---

## Task 16: Verification before completion

**Files:** None — manual + script checks.

**Why:** Spec ships only when the full QA matrix passes.

- [ ] **Step 1: Pure-math tests**

```bash
npx vitest run
```

Expected: all green, including the new `computeBmr` + mode-aware `validate` cases.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Production build**

```bash
npx next build
```

Expected: clean. No missing i18n keys, no missing routes.

- [ ] **Step 4: i18n key parity script — all three namespaces × 5 locales**

```bash
node -e "
const flatten = (o, p='') => Object.entries(o).flatMap(([k,v]) => typeof v === 'object' && v !== null && !Array.isArray(v) ? flatten(v, p+k+'.') : [p+k]);
for (const ns of ['bmrCalculator','tdeeCalculator','deficitCalculator']) {
  const en = require('./messages/en.json')[ns];
  const keys = new Set(flatten(en));
  for (const loc of ['de','ru','es','fr']) {
    const lns = require('./messages/'+loc+'.json')[ns];
    const lk = new Set(flatten(lns));
    const missing = [...keys].filter(k => !lk.has(k));
    if (missing.length > 0) console.log(loc, ns, 'missing:', missing);
  }
}
console.log('done');
"
```

Expected: only the `done` line, no missing keys.

- [ ] **Step 5: Manual QA matrix (per spec Section "Manual QA checklist")**

Run `npm run dev`. For each of `/bmr-calculator`, `/tdee-calculator`, `/calorie-deficit-calculator`:
- EN: form, result, upgrade flow (if BMR/TDEE), plan generation, plan rehydration after reload, App Store CTA.
- One non-EN locale (e.g. `/de/bmr-calculator`): metadata visible in DevTools, hero/intro localized, form labels localized, FAQ localized.

- [ ] **Step 6: Sitemap inspection**

```bash
npm run start &
sleep 3
curl -s http://localhost:3000/sitemap.xml | grep -E "bmr-calculator|tdee-calculator" | wc -l
kill %1
```

Expected: 10 (5 BMR + 5 TDEE URLs).

- [ ] **Step 7: Deficit regression**

Already covered in Steps 5–6, but explicitly confirm:
- localStorage key `nuvvoo_deficit_plan_data` is read on reload (rehydrates plan).
- `MIN_KCAL` clamp behavior visible at low-target inputs (try 30kg / 14y / female / extra activity / fast lose).
- Diet + allergies inputs visible on result view (not moved to upgrade panel).
- Existing analytics events still fire with the new `mode='deficit'` param (Network tab → check `gtag` calls).

- [ ] **Step 8: Final commit (if any cleanup needed)**

If verification surfaced typos, missing keys, or small fixes, commit them now:

```bash
git add -A
git commit -m "Polish from QA pass"
```

- [ ] **Step 9: Verify branch state and push**

```bash
git log --oneline -20
git status
```

Then push for review:

```bash
git push origin feature/tdee-bmr-split
```

(Note: due to parallel-agent branch contention during planning, the spec may live on `feature/bmi-calculator` instead. Cherry-pick onto a clean branch from `main` if needed before pushing.)

---

## Done criteria

1. `/tdee-calculator` and `/bmr-calculator` exist for all five locales, indexable, discoverable in sitemap.
2. Three pages share `components/calculator/calorie-calculator.tsx`; each renders the right hero and reveals the right fields.
3. AI plan generation works end-to-end from all three modes.
4. `lib/deficit/calc.ts` exports `computeBmr` + mode-aware `validate` with unit-test coverage.
5. Analytics events carry `mode` and `upgrade_clicked` fires on BMR/TDEE upgrade clicks.
6. `/calorie-deficit-calculator` has zero behavioral regression.
7. Pure-math tests, typecheck, and production build are all clean.
