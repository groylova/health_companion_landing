# BMI Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/bmi-calculator` (+ four locale variants) that maximally reuses `/calorie-deficit-calculator`'s infra to convert organic + paid "bmi calculator" traffic into App Store installs via a warm-up funnel.

**Architecture:** New pure-math module `lib/bmi/bmi.ts` (unit-tested) plus a new Server Component page and Client Component widget under `app/(content)/[locale]/bmi-calculator/`. Reuses `lib/deficit/calc.ts` (`calculate`, types) and `lib/deficit/meal-plan-api.ts` (`fetchSession`, `generatePlan`) without edits. Adds one entry to `components/seo/related-guides.tsx` and a new `bmiCalculator` namespace to all 5 `messages/*.json` files.

**Tech Stack:** Next.js 14 (App Router, React Server Components), TypeScript, Tailwind CSS, next-intl for i18n, Vitest (newly introduced) for unit tests on the pure math.

**Reference spec:** `docs/superpowers/specs/2026-05-17-bmi-calculator-design.md`

**Reference pattern (sibling page):**
- Server component: `app/(content)/[locale]/calorie-deficit-calculator/page.tsx`
- Client widget: `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx`
- Math: `lib/deficit/calc.ts`
- API client: `lib/deficit/meal-plan-api.ts`

---

## File Structure

| File                                                              | Status  | Responsibility |
| ----------------------------------------------------------------- | ------- | -------------- |
| `package.json`                                                    | Modify  | Add `vitest` dev dep + `test` / `test:run` scripts. |
| `vitest.config.ts`                                                | Create  | Minimal config — no jsdom, pure math only. |
| `tsconfig.json`                                                   | Modify (if needed) | Ensure `@/` path alias is picked up by vitest. |
| `lib/bmi/bmi.ts`                                                  | Create  | Pure math: `computeBmi`, `categoryFor`, `healthyWeightRangeKg`, `targetWeightKg`, `validateBmiForm`, `computeBmiResult`, `mapToCalcInput`. Zero React, zero IO. |
| `lib/bmi/bmi.test.ts`                                             | Create  | Vitest unit tests for every function in `bmi.ts`, including boundary cases. |
| `components/seo/related-guides.tsx`                               | Modify  | Add `bmiCalculator: '/bmi-calculator'` to `SLUG_TO_HREF`. |
| `messages/en.json`                                                | Modify  | Add `bmiCalculator` namespace; add `footer.bmiCalculator` and `relatedLinks.descBmiCalculator`. |
| `messages/de.json`, `messages/ru.json`, `messages/es.json`, `messages/fr.json` | Modify | Same shape as EN with machine-translated content matching the locale's existing register. |
| `app/(content)/[locale]/bmi-calculator/page.tsx`                  | Create  | Server Component: `generateMetadata` (per-locale, indexable), `generateStaticParams`, hero with widget mount, SEO body, conversion block, FAQ, related guides. |
| `app/(content)/[locale]/bmi-calculator/calculator-widget.tsx`     | Create  | Client Component: form → bmi-result → plan state machine, 2-generation localStorage gate, error handling, analytics events. |

---

## Task 1: Vitest setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Why:** The spec calls for unit tests on `lib/bmi/bmi.ts`. The project has no test runner today — add Vitest because (1) it's fast on pure-TypeScript modules, (2) it natively understands ESM + TS without extra config, and (3) it doesn't conflict with `next test` if that ever gets added later.

- [ ] **Step 1: Add Vitest as a devDependency**

Run:
```bash
pnpm add -D vitest
```

Expected: `package.json` now lists `vitest` under `devDependencies`. `pnpm-lock.yaml` updated.

- [ ] **Step 2: Add test scripts to `package.json`**

Edit the `scripts` block of `package.json` so it reads:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create `vitest.config.ts` at the repo root:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
});
```

This mirrors the `@/` alias from `tsconfig.json` so test files can import siblings the same way the app does.

- [ ] **Step 4: Smoke-test Vitest by running it on an empty pattern**

Run: `pnpm test:run`
Expected: prints `No test files found, exiting with code 0` (or similar). Exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "Add Vitest for unit tests on pure-math modules"
```

---

## Task 2: Implement `lib/bmi/bmi.ts` with full unit-test coverage

**Files:**
- Create: `lib/bmi/bmi.ts`
- Create: `lib/bmi/bmi.test.ts`

**Why:** Centralize all BMI math, validation, and mapping in one pure module. Tests pin boundary semantics (a BMI of exactly 25.0 is `overweight`, not `normal`) and the mapping from category to `goal`/`pace`.

**Important constants (from spec):**

```ts
const BMI_UNDERWEIGHT_MAX = 18.5;  // bmi < 18.5 → underweight
const BMI_NORMAL_MAX      = 25.0;  // 18.5 ≤ bmi < 25.0 → normal
const BMI_OVERWEIGHT_MAX  = 30.0;  // 25.0 ≤ bmi < 30.0 → overweight; ≥30.0 → obese
const BMI_NORMAL_MID      = 21.7;  // midpoint target for overweight/obese
const BMI_NORMAL_LOW      = 18.5;  // lower-edge target for underweight
```

**Rounding rules to pin:**
- `computeBmi` returns 1-decimal rounded (`Math.round(bmi * 10) / 10`).
- `healthyWeightRangeKg.{minKg,maxKg}` returns whole kg (`Math.round`).
- `targetWeightKg` returns whole kg (`Math.round`).
- Tests assert these exact rounding outcomes.

- [ ] **Step 1: Write the test file first (RED)**

Create `lib/bmi/bmi.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  computeBmi,
  categoryFor,
  healthyWeightRangeKg,
  targetWeightKg,
  validateBmiForm,
  computeBmiResult,
  mapToCalcInput,
  type BmiFormState,
} from './bmi';

describe('computeBmi', () => {
  it('rounds to one decimal', () => {
    expect(computeBmi(70, 175)).toBe(22.9); // 70 / 1.75^2 = 22.857…
    expect(computeBmi(80, 175)).toBe(26.1);
    expect(computeBmi(55, 175)).toBe(18.0);
  });
});

describe('categoryFor', () => {
  it('classifies underweight when bmi < 18.5', () => {
    expect(categoryFor(18.4)).toBe('underweight');
    expect(categoryFor(15)).toBe('underweight');
  });
  it('classifies normal on the lower boundary (18.5)', () => {
    expect(categoryFor(18.5)).toBe('normal');
    expect(categoryFor(22)).toBe('normal');
    expect(categoryFor(24.9)).toBe('normal');
  });
  it('classifies overweight on the 25.0 boundary', () => {
    expect(categoryFor(25.0)).toBe('overweight');
    expect(categoryFor(27.3)).toBe('overweight');
    expect(categoryFor(29.9)).toBe('overweight');
  });
  it('classifies obese on the 30.0 boundary', () => {
    expect(categoryFor(30.0)).toBe('obese');
    expect(categoryFor(40)).toBe('obese');
  });
});

describe('healthyWeightRangeKg', () => {
  it('returns whole-kg min/max for a given height', () => {
    // 1.75^2 = 3.0625 → min = 18.5*3.0625 = 56.66 → 57 ; max = 24.9*3.0625 = 76.26 → 76
    expect(healthyWeightRangeKg(175)).toEqual({ minKg: 57, maxKg: 76 });
  });
});

describe('targetWeightKg', () => {
  it('uses midpoint of Normal for overweight/obese', () => {
    // 21.7 * 1.75^2 = 66.46 → 66
    expect(targetWeightKg('overweight', 175)).toBe(66);
    expect(targetWeightKg('obese', 175)).toBe(66);
  });
  it('uses lower edge of Normal for underweight', () => {
    // 18.5 * 1.75^2 = 56.66 → 57
    expect(targetWeightKg('underweight', 175)).toBe(57);
  });
  it('returns null for normal', () => {
    expect(targetWeightKg('normal', 175)).toBeNull();
  });
});

describe('validateBmiForm', () => {
  const valid: BmiFormState = {
    gender: 'female',
    age: '30',
    heightUnit: 'cm',
    heightCm: '170',
    heightFt: '',
    heightIn: '',
    weightUnit: 'kg',
    weight: '70',
  };

  it('returns null for a valid form', () => {
    expect(validateBmiForm(valid)).toBeNull();
  });

  it('flags missing gender', () => {
    expect(validateBmiForm({ ...valid, gender: '' })).toEqual({
      field: 'gender',
      reason: 'required',
    });
  });

  it('flags age out of range', () => {
    expect(validateBmiForm({ ...valid, age: '12' })).toEqual({
      field: 'age',
      reason: 'range',
    });
    expect(validateBmiForm({ ...valid, age: '120' })).toEqual({
      field: 'age',
      reason: 'range',
    });
  });

  it('flags height out of range (cm)', () => {
    expect(validateBmiForm({ ...valid, heightCm: '100' })).toEqual({
      field: 'height',
      reason: 'range',
    });
  });

  it('flags height out of range (ft+in)', () => {
    expect(
      validateBmiForm({
        ...valid,
        heightUnit: 'in',
        heightCm: '',
        heightFt: '3', // 36 in = 91.4 cm < 120
        heightIn: '0',
      }),
    ).toEqual({ field: 'height', reason: 'range' });
  });

  it('flags weight out of range (lb)', () => {
    expect(
      validateBmiForm({ ...valid, weightUnit: 'lb', weight: '50' }),
    ).toEqual({ field: 'weight', reason: 'range' });
  });
});

describe('computeBmiResult', () => {
  it('assembles a BmiResult for a normal-range user', () => {
    const result = computeBmiResult({
      gender: 'female',
      age: '30',
      heightUnit: 'cm',
      heightCm: '170',
      heightFt: '',
      heightIn: '',
      weightUnit: 'kg',
      weight: '65',
    });
    expect(result.bmi).toBe(22.5);
    expect(result.category).toBe('normal');
    expect(result.weightKg).toBe(65);
    expect(result.heightCm).toBe(170);
    expect(result.healthyRangeKg).toEqual({ minKg: 53, maxKg: 72 });
    expect(result.targetWeightKg).toBeNull();
  });

  it('canonicalizes ft+in + lb to cm + kg', () => {
    const result = computeBmiResult({
      gender: 'male',
      age: '40',
      heightUnit: 'in',
      heightCm: '',
      heightFt: '5',
      heightIn: '9', // 69 in = 175.26 cm
      weightUnit: 'lb',
      weight: '180', // 81.6 kg
    });
    expect(result.heightCm).toBeCloseTo(175.26, 1);
    expect(result.weightKg).toBeCloseTo(81.6, 1);
    expect(result.category).toBe('overweight');
  });
});

describe('mapToCalcInput', () => {
  const form: BmiFormState = {
    gender: 'female',
    age: '30',
    heightUnit: 'cm',
    heightCm: '170',
    heightFt: '',
    heightIn: '',
    weightUnit: 'kg',
    weight: '85',
  };

  it('maps overweight → lose/normal', () => {
    const input = mapToCalcInput(form, 'moderate', 'overweight');
    expect(input.goal).toBe('lose');
    expect(input.pace).toBe('normal');
    expect(input.activity).toBe('moderate');
    expect(input.gender).toBe('female');
  });

  it('maps obese → lose/normal', () => {
    expect(mapToCalcInput(form, 'sedentary', 'obese').goal).toBe('lose');
  });

  it('maps normal → maintain/normal', () => {
    expect(mapToCalcInput(form, 'light', 'normal').goal).toBe('maintain');
  });

  it('maps underweight → gain/normal', () => {
    expect(mapToCalcInput(form, 'very', 'underweight').goal).toBe('gain');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail (RED)**

Run: `pnpm test:run`
Expected: every test fails with `Cannot find module './bmi'` (no implementation yet).

- [ ] **Step 3: Implement `lib/bmi/bmi.ts` (GREEN)**

Create `lib/bmi/bmi.ts`:

```ts
// Pure BMI math + validation + mapping into the existing lib/deficit calc.
// No React, no IO. Tests live alongside in bmi.test.ts.

import {
  inToCm,
  lbToKg,
  type Activity,
  type CalcInput,
  type Gender,
  type HeightUnit,
  type WeightUnit,
} from '@/lib/deficit/calc';

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export type BmiFormState = {
  gender: Gender | '';
  age: string;
  heightUnit: HeightUnit;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightUnit: WeightUnit;
  weight: string;
};

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  weightKg: number;
  heightCm: number;
  healthyRangeKg: { minKg: number; maxKg: number };
  targetWeightKg: number | null;
};

export type BmiValidationError = {
  field: 'gender' | 'age' | 'height' | 'weight';
  reason: 'required' | 'range';
};

const BMI_UNDERWEIGHT_MAX = 18.5;
const BMI_NORMAL_MAX = 25.0;
const BMI_OVERWEIGHT_MAX = 30.0;
const BMI_NORMAL_LOW = 18.5;
const BMI_NORMAL_HIGH = 24.9;
const BMI_NORMAL_MID = 21.7;

export function computeBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function categoryFor(bmi: number): BmiCategory {
  if (bmi < BMI_UNDERWEIGHT_MAX) {
    return 'underweight';
  }
  if (bmi < BMI_NORMAL_MAX) {
    return 'normal';
  }
  if (bmi < BMI_OVERWEIGHT_MAX) {
    return 'overweight';
  }
  return 'obese';
}

export function healthyWeightRangeKg(heightCm: number): { minKg: number; maxKg: number } {
  const m = heightCm / 100;
  const sq = m * m;
  return {
    minKg: Math.round(BMI_NORMAL_LOW * sq),
    maxKg: Math.round(BMI_NORMAL_HIGH * sq),
  };
}

export function targetWeightKg(category: BmiCategory, heightCm: number): number | null {
  if (category === 'normal') {
    return null;
  }
  const sq = (heightCm / 100) ** 2;
  if (category === 'underweight') {
    return Math.round(BMI_NORMAL_LOW * sq);
  }
  return Math.round(BMI_NORMAL_MID * sq);
}

function parseHeightCm(form: BmiFormState): number | null {
  if (form.heightUnit === 'cm') {
    const cm = parseFloat(form.heightCm);
    return Number.isNaN(cm) ? null : cm;
  }
  const ftStr = form.heightFt.trim();
  if (ftStr.length === 0) {
    return null;
  }
  const ft = parseFloat(ftStr);
  if (Number.isNaN(ft)) {
    return null;
  }
  const inStr = form.heightIn.trim();
  const inches = inStr.length === 0 ? 0 : parseFloat(inStr);
  if (Number.isNaN(inches)) {
    return null;
  }
  return inToCm(ft * 12 + inches);
}

function parseWeightKg(form: BmiFormState): number | null {
  const w = parseFloat(form.weight);
  if (Number.isNaN(w)) {
    return null;
  }
  return form.weightUnit === 'kg' ? w : lbToKg(w);
}

export function validateBmiForm(form: BmiFormState): BmiValidationError | null {
  if (form.gender !== 'male' && form.gender !== 'female') {
    return { field: 'gender', reason: 'required' };
  }

  const age = parseInt(form.age, 10);
  if (Number.isNaN(age)) {
    return { field: 'age', reason: 'required' };
  }
  if (age < 14 || age > 100) {
    return { field: 'age', reason: 'range' };
  }

  const heightCm = parseHeightCm(form);
  if (heightCm === null) {
    return { field: 'height', reason: 'required' };
  }
  if (heightCm < 120 || heightCm > 250) {
    return { field: 'height', reason: 'range' };
  }

  const weightKg = parseWeightKg(form);
  if (weightKg === null) {
    return { field: 'weight', reason: 'required' };
  }
  if (weightKg < 30 || weightKg > 250) {
    return { field: 'weight', reason: 'range' };
  }

  return null;
}

export function computeBmiResult(form: BmiFormState): BmiResult {
  const heightCm = parseHeightCm(form);
  const weightKg = parseWeightKg(form);
  if (heightCm === null || weightKg === null) {
    throw new Error('computeBmiResult called on unvalidated form');
  }
  const bmi = computeBmi(weightKg, heightCm);
  const category = categoryFor(bmi);
  return {
    bmi,
    category,
    weightKg,
    heightCm,
    healthyRangeKg: healthyWeightRangeKg(heightCm),
    targetWeightKg: targetWeightKg(category, heightCm),
  };
}

export function mapToCalcInput(
  form: BmiFormState,
  activity: Activity,
  category: BmiCategory,
): CalcInput {
  const heightCm = parseHeightCm(form);
  const weightKg = parseWeightKg(form);
  if (heightCm === null || weightKg === null || form.gender === '') {
    throw new Error('mapToCalcInput called on unvalidated form');
  }
  const age = parseInt(form.age, 10);
  const goal: CalcInput['goal'] =
    category === 'underweight' ? 'gain' : category === 'normal' ? 'maintain' : 'lose';
  return {
    weight: weightKg,
    weightUnit: 'kg',
    height: heightCm,
    heightUnit: 'cm',
    age,
    gender: form.gender,
    activity,
    goal,
    pace: 'normal',
  };
}
```

- [ ] **Step 4: Run tests to confirm they pass (GREEN)**

Run: `pnpm test:run`
Expected: all tests pass, exit 0.

- [ ] **Step 5: Commit**

```bash
git add lib/bmi/bmi.ts lib/bmi/bmi.test.ts
git commit -m "Add lib/bmi pure math, validation, and CalcInput mapping"
```

---

## Task 3: Register `bmiCalculator` slug in RelatedGuides

**Files:**
- Modify: `components/seo/related-guides.tsx`

**Why:** Other SEO pages can cross-link to the new calculator via `RelatedGuides slugs={['bmiCalculator', ...]}`. The slug also keys into `footer.bmiCalculator` and `relatedLinks.descBmiCalculator` (added in tasks 4 and 5).

- [ ] **Step 1: Add `bmiCalculator` entry to `SLUG_TO_HREF`**

Edit `components/seo/related-guides.tsx`, in the `SLUG_TO_HREF` const, after `calculator: '/calorie-deficit-calculator',`:

```ts
const SLUG_TO_HREF = {
  calculator: '/calorie-deficit-calculator',
  bmiCalculator: '/bmi-calculator',
  // …rest unchanged
} as const;
```

- [ ] **Step 2: Type-check**

Run: `pnpm build`
Expected: build succeeds (or fails on the next missing piece — but `RelatedSlug` should include `'bmiCalculator'` now).

- [ ] **Step 3: Commit**

```bash
git add components/seo/related-guides.tsx
git commit -m "Add bmiCalculator slug to RelatedGuides map"
```

---

## Task 4: Write EN messages for `bmiCalculator` namespace

**Files:**
- Modify: `messages/en.json`

**Why:** Authoring locale; other locales translate from this. Adds the full namespace plus the two cross-link entries (`footer.bmiCalculator`, `relatedLinks.descBmiCalculator`).

- [ ] **Step 1: Add `footer.bmiCalculator`**

In `messages/en.json`, inside the `"footer": { ... }` object, after `"calculator": "Calorie Deficit Calculator",`:

```json
"bmiCalculator": "BMI Calculator",
```

- [ ] **Step 2: Add `relatedLinks.descBmiCalculator`**

Inside `"relatedLinks": { ... }`, after `"descCalculator": "Get your daily calorie target and a one-day plan in one go.",`:

```json
"descBmiCalculator": "Check your BMI and turn the result into a personalized one-day plan.",
```

- [ ] **Step 3: Add the full `bmiCalculator` namespace**

After the `"deficitCalculator": { ... }` block (or anywhere at top level — JSON-key order is irrelevant), add:

```json
"bmiCalculator": {
  "metadata": {
    "title": "BMI Calculator — Free + AI Meal Plan",
    "description": "Calculate your BMI for free and get a personalized AI meal plan based on your results. Know your healthy weight range and what to eat today.",
    "ogTitle": "BMI Calculator with AI Meal Plan",
    "ogDescription": "Free BMI calculator. See your category, healthy range, and a one-day meal plan in 30 seconds."
  },
  "h1": "BMI Calculator",
  "intro": "Find your BMI in 30 seconds and turn the result into a one-day meal plan you can actually follow. No accounts, no setup.",
  "trustFree": "Free",
  "trustNoAccount": "No account",
  "trustPrivate": "Private by default",
  "form": {
    "genderLabel": "Sex",
    "genderMale": "Male",
    "genderFemale": "Female",
    "ageLabel": "Age",
    "agePlaceholder": "30",
    "ageUnit": "years",
    "heightLabel": "Height",
    "weightLabel": "Weight",
    "submit": "Calculate BMI",
    "errorRequired": "Please fill this in.",
    "errorRange": "That value looks off — please double-check."
  },
  "result": {
    "bmiLabel": "Your BMI",
    "edit": "Edit",
    "categoryUnderweight": "Underweight",
    "categoryNormal": "Normal",
    "categoryOverweight": "Overweight",
    "categoryObese": "Obese",
    "scaleLegendUnder": "Under",
    "scaleLegendNormal": "Normal",
    "scaleLegendOver": "Over",
    "scaleLegendObese": "Obese",
    "healthyRangeLabel": "Healthy BMI range",
    "healthyRangeKg": "{minKg}–{maxKg} kg",
    "healthyRangeLb": "{minLb}–{maxLb} lb",
    "targetWeightLabel": "Target weight",
    "targetWeightKg": "~{target} kg ({minKg}–{maxKg})",
    "targetWeightLb": "~{target} lb ({minLb}–{maxLb})",
    "explanationOverweight": "Your BMI of {bmi} is in the overweight range. A healthy BMI for your height is 18.5–24.9, which means a target weight of {minKg}–{maxKg} kg.",
    "explanationObese": "Your BMI of {bmi} is in the obese range. A healthy BMI for your height is 18.5–24.9, which means a target weight of {minKg}–{maxKg} kg.",
    "explanationNormal": "Your BMI of {bmi} is in the healthy range. Here's a maintenance plan to stay on track.",
    "explanationUnderweight": "Your BMI of {bmi} suggests you may be underweight. A healthy weight for your height starts at {target} kg.",
    "activityLabel": "Activity level",
    "activitySedentary": "Sedentary (little or no exercise)",
    "activityLight": "Lightly active (1–3 days/week)",
    "activityModerate": "Moderately active (3–5 days/week)",
    "activityVery": "Very active (6–7 days/week)",
    "activityExtra": "Extra active (twice daily / physical job)",
    "activityPrompt": "How active are you?",
    "ctaButton": "Get my plan",
    "ctaUsedNote": "You've already generated your free plans. Install Nuvvoo for a fresh plan every day."
  },
  "plan": {
    "heading": "Your day plan",
    "loading": "Building your plan…",
    "slotBreakfast": "Breakfast",
    "slotLunch": "Lunch",
    "slotDinner": "Dinner",
    "slotSnack": "Snack",
    "kcalUnit": "kcal",
    "totalLabel": "Total",
    "macros": "P {p}g · C {c}g · F {f}g",
    "errorTitle": "Couldn't build the plan right now. Please try again in a minute.",
    "rateLimitedHourly": "We've hit the hourly free-plan limit. Please try again in an hour.",
    "rateLimitedDaily": "We've hit today's free-plan limit. Please try again tomorrow."
  },
  "seo": {
    "h2_what": "What is BMI?",
    "what_p1": "Body Mass Index (BMI) is a number that estimates whether your weight is in a healthy range for your height. It's calculated from just two values — weight and height — which makes it easy to use as a quick screening tool.",
    "what_p2": "BMI doesn't measure body fat directly and doesn't distinguish muscle from fat, but for most adults it's a reasonable starting point for understanding where you stand and what to do next.",
    "h2_categories": "BMI categories",
    "categoriesHeaderCategory": "Category",
    "categoriesHeaderRange": "BMI range",
    "categoryRowUnderweight": "Below 18.5",
    "categoryRowNormal": "18.5 – 24.9",
    "categoryRowOverweight": "25.0 – 29.9",
    "categoryRowObese": "30.0 or more",
    "h2_formula": "How is BMI calculated?",
    "formula_p1": "BMI = weight (kg) / height (m)². Convert pounds to kilograms by dividing by 2.205, and inches to meters by multiplying by 0.0254. The calculator above does this for you automatically.",
    "h2_limitations": "BMI limitations",
    "lim_p1": "BMI doesn't distinguish fat from muscle. Athletes with a lot of muscle mass can show a high BMI without being overweight. Pregnant women, the elderly, and people with very different body proportions also need other measures alongside BMI.",
    "lim_p2": "BMI thresholds were developed primarily on European populations. Some clinical guidelines suggest lower thresholds for people of South or East Asian descent. Treat your BMI as a starting point, not the final word.",
    "h2_action": "What to do with your BMI result",
    "action_p1": "If your BMI is above 24.9, a moderate calorie deficit is the place to start — see our <deficit>calorie deficit calculator</deficit> for a daily target. If it's in the healthy range, focus on consistency over numbers — a simple <food>food diary</food> beats restrictive plans for staying on track."
  },
  "conversion": {
    "title": "This is one day. Nuvvoo gives you a fresh plan every day.",
    "subtitle": "Track meals by chatting, not logging. AI builds your plan and adapts to your habits.",
    "cta": "Get Nuvvoo Free"
  },
  "faq": {
    "q1": "What is a healthy BMI?",
    "a1": "A BMI between 18.5 and 24.9 is considered healthy for most adults. Outside this range doesn't automatically mean a health problem — it just means it's worth a closer look with a clinician.",
    "q2": "How do I calculate my BMI?",
    "a2": "BMI is your weight in kilograms divided by your height in meters squared (kg/m²). For pounds and inches, divide pounds by inches squared and multiply by 703. The calculator above handles the math.",
    "q3": "Is BMI accurate?",
    "a3": "BMI is a useful screening tool but it isn't a direct measure of body fat. It doesn't account for muscle mass, bone density, or body composition, so athletes and older adults often need additional measures.",
    "q4": "What BMI is considered overweight?",
    "a4": "A BMI of 25.0 to 29.9 is classified as overweight. A BMI of 30 or higher is classified as obese."
  }
},
```

Note: the trailing comma is intentional only if you're inserting before the closing `}` of the file's top-level object — make sure the file's overall JSON stays valid.

- [ ] **Step 4: Verify JSON validity**

Run: `python3 -c "import json; json.load(open('messages/en.json'))"`
Expected: no output (parses cleanly).

- [ ] **Step 5: Commit**

```bash
git add messages/en.json
git commit -m "Add bmiCalculator namespace + cross-link keys to EN messages"
```

---

## Task 5: Translate `bmiCalculator` namespace into DE / RU / ES / FR

**Files:**
- Modify: `messages/de.json`, `messages/ru.json`, `messages/es.json`, `messages/fr.json`

**Why:** All five locales must ship at launch — page metadata forces `index: true` on every locale variant.

**Strategy:** Mirror the EN namespace structure exactly. Translate values into each locale, matching the tone of the existing `deficitCalculator` namespace already present in those files. The titles already exist in the spec:

- DE: `BMI Rechner — Kostenlos + KI-Ernährungsplan`
- RU: `Калькулятор BMI — бесплатно + AI план питания`
- ES: `Calculadora de IMC — Gratis + Plan IA`
- FR: `Calculateur IMC — Gratuit + Plan Repas IA`

H1 per locale: `BMI Rechner` / `Калькулятор BMI` / `Calculadora de IMC` / `Calculateur d'IMC`.

- [ ] **Step 1: Add `footer.bmiCalculator` to all four locale files**

In each of `messages/{de,ru,es,fr}.json`, inside `"footer"`, add after `"calculator": "…"`:

- DE: `"bmiCalculator": "BMI Rechner",`
- RU: `"bmiCalculator": "Калькулятор BMI",`
- ES: `"bmiCalculator": "Calculadora de IMC",`
- FR: `"bmiCalculator": "Calculateur d'IMC",`

- [ ] **Step 2: Add `relatedLinks.descBmiCalculator` to all four locale files**

Translate "Check your BMI and turn the result into a personalized one-day plan." into each locale. Match the tone of neighboring `desc*` entries in the same file.

- [ ] **Step 3: Add the full `bmiCalculator` namespace to all four locale files**

Translate the EN namespace value-by-value. Preserve all ICU placeholder names exactly: `{bmi}`, `{minKg}`, `{maxKg}`, `{minLb}`, `{maxLb}`, `{target}`, `{p}`, `{c}`, `{f}`. Preserve `<deficit>…</deficit>` and `<food>…</food>` tag markers in `seo.action_p1`.

Reference register: look at each locale's existing `deficitCalculator` namespace for tone, formality, and casing conventions (e.g., DE uses "Sie", RU uses informal "ты" in the existing copy — match that).

- [ ] **Step 4: Verify all four JSON files parse**

Run:
```bash
for f in messages/de.json messages/ru.json messages/es.json messages/fr.json; do
  python3 -c "import json; json.load(open('$f'))" && echo "$f: ok"
done
```
Expected: each prints `<path>: ok`.

- [ ] **Step 5: Commit**

```bash
git add messages/de.json messages/ru.json messages/es.json messages/fr.json
git commit -m "Translate bmiCalculator namespace to DE/RU/ES/FR"
```

---

## Task 6: Server Component — `page.tsx`

**Files:**
- Create: `app/(content)/[locale]/bmi-calculator/page.tsx`

**Why:** Static metadata + SEO body. Mirrors `app/(content)/[locale]/calorie-deficit-calculator/page.tsx` 1:1 in shape; the only differences are namespace name (`bmiCalculator`), slug constant, the SEO section structure, and the BMI-categories table.

**Important details:**
- Set `robots: { index: true, follow: true }` to override the parent `layout.tsx` noindex for non-default locales (same as deficit calc, see lines 42–46 of that page).
- Title is bare — parent layout's `'%s | Nuvvoo'` template appends the suffix (matches the recent `6f2e825` fix).
- `RelatedGuides slugs` use the canonical `'calculator'` (not `'deficitCalculator'`).

- [ ] **Step 1: Create the page file with metadata + body**

Create `app/(content)/[locale]/bmi-calculator/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ContentSection } from '@/components/seo/content-section';
import { FaqSection } from '@/components/seo/faq-section';
import { RelatedGuides } from '@/components/seo/related-guides';
import { AppStoreBadge } from '@/components/app-store-badge';
import { routing } from '@/i18n/routing';
import { CalculatorWidget } from './calculator-widget';

const SLUG = 'bmi-calculator';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bmiCalculator.metadata' });

  const canonical = locale === 'en' ? `${siteUrl}/${SLUG}` : `${siteUrl}/${locale}/${SLUG}`;
  const alternates: Record<string, string> = { 'x-default': `${siteUrl}/${SLUG}` };
  for (const loc of routing.locales) {
    alternates[loc] = loc === 'en' ? `${siteUrl}/${SLUG}` : `${siteUrl}/${loc}/${SLUG}`;
  }

  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical, languages: alternates },
    robots: { index: true, follow: true },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonical,
      type: 'article',
      images: [{ url: '/images/og.png', width: 1200, height: 630, alt: t('ogTitle') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/images/og.png'],
    },
  };
}

export default async function BmiCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('bmiCalculator');

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
  ];

  return (
    <main>
      <Nav />

      <section className="pt-12 md:pt-16">
        <Container>
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
            <div className="min-w-0 md:pt-6">
              <h1
                style={{ fontFamily: "'Thicccboi', sans-serif" }}
                className="text-4xl font-extrabold tracking-tight text-[#1F2A24] md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]"
              >
                {t('h1')}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                {t('intro')}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span>💚 {t('trustFree')}</span>
                <span>✦ {t('trustNoAccount')}</span>
                <span>🔒 {t('trustPrivate')}</span>
              </div>
            </div>
            <div className="-mx-2 w-auto min-w-0 md:mx-0 md:w-full">
              <CalculatorWidget />
            </div>
          </div>
        </Container>
      </section>

      <article className="pt-16 md:pt-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12">
            <ContentSection title={t('seo.h2_what')}>
              <p>{t('seo.what_p1')}</p>
              <p>{t('seo.what_p2')}</p>
            </ContentSection>

            <ContentSection title={t('seo.h2_categories')}>
              <table className="w-full border-collapse text-left text-base">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold">{t('seo.categoriesHeaderCategory')}</th>
                    <th className="py-2 font-semibold">{t('seo.categoriesHeaderRange')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-4">{t('result.categoryUnderweight')}</td><td className="py-2">{t('seo.categoryRowUnderweight')}</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-4">{t('result.categoryNormal')}</td><td className="py-2">{t('seo.categoryRowNormal')}</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-4">{t('result.categoryOverweight')}</td><td className="py-2">{t('seo.categoryRowOverweight')}</td></tr>
                  <tr><td className="py-2 pr-4">{t('result.categoryObese')}</td><td className="py-2">{t('seo.categoryRowObese')}</td></tr>
                </tbody>
              </table>
            </ContentSection>

            <ContentSection title={t('seo.h2_formula')}>
              <p>{t('seo.formula_p1')}</p>
            </ContentSection>

            <ContentSection title={t('seo.h2_limitations')}>
              <p>{t('seo.lim_p1')}</p>
              <p>{t('seo.lim_p2')}</p>
            </ContentSection>

            <ContentSection title={t('seo.h2_action')}>
              <p>
                {t.rich('seo.action_p1', {
                  deficit: (chunks) => (
                    <Link href="/calorie-deficit-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                      {chunks}
                    </Link>
                  ),
                  food: (chunks) => (
                    <Link href="/food-diary-for-weight-loss" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </ContentSection>

            <div className="my-12 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-soft">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {t('conversion.title')}
                </h3>
                <p className="mt-3 text-slate-600">{t('conversion.subtitle')}</p>
                <div className="mt-6">
                  <AppStoreBadge buttonLocation="bmi_calculator_conversion" />
                </div>
              </div>
            </div>

            <FaqSection faqs={faqs} />

            <RelatedGuides slugs={['calculator', 'foodDiary', 'mfpAlternative', 'chatTracker']} />
          </div>
        </Container>
      </article>

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Type-check + skip-the-widget compile**

Run: `pnpm build`
Expected: build fails because `./calculator-widget` doesn't exist yet — that's fine, we'll create it in the next task. The page file itself should have no type errors.

- [ ] **Step 3: Commit**

```bash
git add app/\(content\)/\[locale\]/bmi-calculator/page.tsx
git commit -m "Add /bmi-calculator Server Component (metadata + SEO body)"
```

---

## Task 7: Client Widget — scaffold + form phase

**Files:**
- Create: `app/(content)/[locale]/bmi-calculator/calculator-widget.tsx`

**Why:** First slice of the widget — phase machine + `'form'` view + submit → BMI compute → `'bmi-result'` phase. No API call yet, no plan generation. Build incrementally so each commit is testable in isolation.

**Pattern reference:** `app/(content)/[locale]/calorie-deficit-calculator/calculator-widget.tsx`:
- `track()` helper — lines 104–112
- `UnitToggle` + `SegmentButton` reusable components — lines 783–834
- Height ft+in / cm split inputs — lines 554–608

Copy the unit-toggle pattern (kg/lb, cm/in) and the height-split pattern verbatim — there is no value in re-deriving them.

- [ ] **Step 1: Create the widget file with form phase only**

Create `app/(content)/[locale]/bmi-calculator/calculator-widget.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  computeBmiResult,
  validateBmiForm,
  type BmiFormState,
  type BmiResult,
  type BmiValidationError,
} from '@/lib/bmi/bmi';
import type {
  Activity,
  Gender,
  HeightUnit,
  WeightUnit,
} from '@/lib/deficit/calc';

type Phase = 'form' | 'bmi-result' | 'plan';

const DEFAULT_FORM: BmiFormState = {
  gender: '',
  age: '',
  heightUnit: 'in',
  heightCm: '',
  heightFt: '',
  heightIn: '',
  weightUnit: 'lb',
  weight: '',
};

function track(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', name, params || {});
}

type Translator = ReturnType<typeof useTranslations<'bmiCalculator'>>;

export function CalculatorWidget() {
  const t = useTranslations('bmiCalculator');
  const locale = useLocale();

  const [phase, setPhase] = useState<Phase>('form');
  const [form, setForm] = useState<BmiFormState>(DEFAULT_FORM);
  const [error, setError] = useState<BmiValidationError | null>(null);
  const [bmi, setBmi] = useState<BmiResult | null>(null);
  const [activity, setActivity] = useState<Activity | ''>('');

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current) {
      return;
    }
    viewedRef.current = true;
    track('bmi_calculator_viewed', { page: 'bmi_calculator', locale });
  }, [locale]);

  function handleField<K extends keyof BmiFormState>(key: K, value: BmiFormState[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error !== null && error.field === ((key === 'heightCm' || key === 'heightFt' || key === 'heightIn') ? 'height' : (key === 'weightUnit' ? 'weight' : (key === 'heightUnit' ? 'height' : (key as 'gender' | 'age' | 'weight'))))) {
      setError(null);
    }
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const validationError = validateBmiForm(form);
    if (validationError !== null) {
      setError(validationError);
      return;
    }
    const result = computeBmiResult(form);
    setBmi(result);
    setError(null);
    setPhase('bmi-result');
    track('bmi_calculated', {
      bmi_value: result.bmi,
      bmi_category: result.category,
      gender: form.gender,
      locale,
    });
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur md:p-7">
      {phase === 'form' && (
        <FormView form={form} error={error} onField={handleField} onSubmit={handleSubmit} t={t} />
      )}
      {phase === 'bmi-result' && bmi !== null && (
        <div className="space-y-3">
          {/* TODO(task 8): full BmiResultView */}
          <p className="text-sm text-slate-500">{t('result.bmiLabel')}</p>
          <p className="text-5xl font-extrabold">{bmi.bmi}</p>
          <p className="text-sm">{t(`result.category${bmi.category.charAt(0).toUpperCase()}${bmi.category.slice(1)}` as 'result.categoryNormal')}</p>
          <button onClick={() => setPhase('form')} className="text-sm text-nuvvooGreen-700 underline">{t('result.edit')}</button>
        </div>
      )}
    </div>
  );
}

function FormView({
  form,
  error,
  onField,
  onSubmit,
  t,
}: {
  form: BmiFormState;
  error: BmiValidationError | null;
  onField: <K extends keyof BmiFormState>(key: K, value: BmiFormState[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  t: Translator;
}) {
  function fieldError(field: BmiValidationError['field']): string | null {
    if (error === null || error.field !== field) {
      return null;
    }
    return error.reason === 'required' ? t('form.errorRequired') : t('form.errorRange');
  }

  // Copy convertWeight / convertHeight from deficit calc widget lines 151–200
  // so unit toggles preserve values. Same math, same behavior.

  // Order per spec: Gender, Age, Height, Weight, Submit.

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('form.genderLabel')}</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <SegmentButton selected={form.gender === 'male'} onClick={() => onField('gender', 'male' as Gender)} label={t('form.genderMale')} />
          <SegmentButton selected={form.gender === 'female'} onClick={() => onField('gender', 'female' as Gender)} label={t('form.genderFemale')} />
        </div>
        {fieldError('gender') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('gender')}</p>}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('form.ageLabel')}</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number" inputMode="numeric" min="14" max="100"
            value={form.age}
            onChange={(e) => onField('age', e.target.value)}
            placeholder={t('form.agePlaceholder')}
            className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
          />
          <div className="flex h-11 items-center px-2 text-sm text-slate-500">{t('form.ageUnit')}</div>
        </div>
        {fieldError('age') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('age')}</p>}
      </div>

      {/* Height — copy entire block (cm input OR ft+in pair) from deficit widget lines 555–608 */}
      {/* Weight — copy entire block (kg/lb toggle) from deficit widget lines 530–552 */}

      {/* The two blocks above use locally-defined UnitToggle + SegmentButton — copy
         those component definitions from deficit widget lines 783–834. */}

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
      >
        {t('form.submit')}
      </button>
    </form>
  );
}

function SegmentButton({
  selected, onClick, label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  const className = selected
    ? 'h-11 rounded-xl border-2 border-nuvvooGreen-400 bg-nuvvooGreen-50 px-3 text-sm font-medium text-nuvvooGreen-800'
    : 'h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400';
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
```

**The plan deliberately leaves the height + weight input markup as a "copy from deficit calc lines X–Y" comment to keep this file readable. When implementing, lift those JSX blocks verbatim and adapt only the namespace from `t('form.weightLabel')` (already identical) and unit toggle handlers (`handleWeightUnit` / `handleHeightUnit` — also identical pattern).** Replace the two `// Height —` / `// Weight —` comment blocks with the actual code in this task; don't ship the partial widget.

- [ ] **Step 2: Verify build compiles**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 3: Smoke-test in dev**

Run: `pnpm dev`
Open `http://localhost:3000/bmi-calculator`. Fill in valid values and submit. Verify:
- BMI number renders in the placeholder result view.
- Category label renders.
- "Edit" button returns to form.
- Validation: blank gender shows "Please fill this in.", age 12 shows range error.

- [ ] **Step 4: Commit**

```bash
git add app/\(content\)/\[locale\]/bmi-calculator/calculator-widget.tsx
git commit -m "BMI widget: scaffold + form phase"
```

---

## Task 8: Client Widget — full `bmi-result` view (gradient scale, target weight, activity prompt)

**Files:**
- Modify: `app/(content)/[locale]/bmi-calculator/calculator-widget.tsx`

**Why:** Replace the task-7 placeholder result view with the full layout: large BMI number, color-coded category pill, gradient scale with marker, healthy-range + target-weight rows, tailored explanation copy, activity select, and `Get my plan` CTA (still inert in this task — plan logic comes in task 9).

**Gradient scale spec (from design doc):**
- Bar: 10 px tall, rounded-md, `linear-gradient(90deg, #60a5fa 0%, #34d399 25%, #fbbf24 60%, #f87171 100%)`.
- Marker: 14 px circle, `#0f172a` fill, 3 px white border, soft shadow.
- Marker x-position: `clamp(0, (bmi - 15) / (40 - 15), 1) * 100%`.

**Category pill colors:**
- `underweight` — `bg-blue-100 text-blue-800`
- `normal` — `bg-nuvvooGreen-50 text-nuvvooGreen-800`
- `overweight` — `bg-amber-100 text-amber-800`
- `obese` — `bg-red-100 text-red-800`

**Tailored explanation copy:** keyed on category via `t('result.explanation' + Capitalized)`, with ICU params filled in.

- [ ] **Step 1: Add `BmiResultView` component**

Inside the same file, add this component (replace the inline placeholder block where `phase === 'bmi-result'`):

```tsx
const PILL_CLASS: Record<BmiResult['category'], string> = {
  underweight: 'bg-blue-100 text-blue-800',
  normal: 'bg-nuvvooGreen-50 text-nuvvooGreen-800',
  overweight: 'bg-amber-100 text-amber-800',
  obese: 'bg-red-100 text-red-800',
};

function BmiResultView({
  bmi,
  form,
  activity,
  onActivity,
  onGetPlan,
  onEdit,
  planLoading,
  planError,
  alreadyUsed,
  t,
}: {
  bmi: BmiResult;
  form: BmiFormState;
  activity: Activity | '';
  onActivity: (a: Activity) => void;
  onGetPlan: () => void;
  onEdit: () => void;
  planLoading: boolean;
  planError: string | null;
  alreadyUsed: boolean;
  t: Translator;
}) {
  const markerPct = Math.min(100, Math.max(0, ((bmi.bmi - 15) / (40 - 15)) * 100));
  const categoryKey = `result.category${bmi.category.charAt(0).toUpperCase()}${bmi.category.slice(1)}` as 'result.categoryNormal';
  const explanationKey = `result.explanation${bmi.category.charAt(0).toUpperCase()}${bmi.category.slice(1)}` as 'result.explanationNormal';

  // Range string uses kg always (the form is canonicalized; we don't render lb here for v1).
  const rangeText = t('result.healthyRangeKg', {
    minKg: bmi.healthyRangeKg.minKg.toString(),
    maxKg: bmi.healthyRangeKg.maxKg.toString(),
  });
  const targetText =
    bmi.targetWeightKg !== null
      ? t('result.targetWeightKg', {
          target: bmi.targetWeightKg.toString(),
          minKg: bmi.healthyRangeKg.minKg.toString(),
          maxKg: bmi.healthyRangeKg.maxKg.toString(),
        })
      : null;

  const explanationParams: Record<string, string> =
    bmi.category === 'underweight'
      ? { bmi: bmi.bmi.toString(), target: (bmi.targetWeightKg ?? 0).toString() }
      : bmi.category === 'normal'
      ? { bmi: bmi.bmi.toString() }
      : {
          bmi: bmi.bmi.toString(),
          minKg: bmi.healthyRangeKg.minKg.toString(),
          maxKg: bmi.healthyRangeKg.maxKg.toString(),
        };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{t('result.bmiLabel')}</p>
        <button onClick={onEdit} className="text-sm text-nuvvooGreen-700 hover:text-nuvvooGreen-900 underline-offset-2 hover:underline">
          {t('result.edit')}
        </button>
      </div>

      <div>
        <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">{bmi.bmi}</p>
        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${PILL_CLASS[bmi.category]}`}>
          {t(categoryKey)}
        </span>
      </div>

      {/* Gradient scale with marker */}
      <div className="relative">
        <div
          className="h-2.5 rounded-md"
          style={{ background: 'linear-gradient(90deg,#60a5fa 0%,#34d399 25%,#fbbf24 60%,#f87171 100%)' }}
        />
        <div
          className="absolute -top-1.5 h-3.5 w-3.5 rounded-full bg-slate-900 ring-[3px] ring-white shadow"
          style={{ left: `${markerPct}%`, transform: 'translateX(-50%)' }}
          aria-hidden
        />
        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>{t('result.scaleLegendUnder')}</span>
          <span>{t('result.scaleLegendNormal')}</span>
          <span>{t('result.scaleLegendOver')}</span>
          <span>{t('result.scaleLegendObese')}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">{t('result.healthyRangeLabel')}</span>
          <span className="font-semibold text-slate-900">{rangeText}</span>
        </div>
        {targetText !== null && (
          <div className="mt-2 flex justify-between">
            <span className="text-slate-500">{t('result.targetWeightLabel')}</span>
            <span className="font-semibold text-slate-900">{targetText}</span>
          </div>
        )}
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{t(explanationKey, explanationParams)}</p>

      {/* Activity + CTA — task 9 wires the plan call. */}
      {!alreadyUsed && (
        <div className="space-y-4 border-t border-slate-200 pt-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('result.activityLabel')}</label>
            <select
              value={activity}
              onChange={(e) => onActivity(e.target.value as Activity)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
            >
              <option value="" disabled>—</option>
              <option value="sedentary">{t('result.activitySedentary')}</option>
              <option value="light">{t('result.activityLight')}</option>
              <option value="moderate">{t('result.activityModerate')}</option>
              <option value="very">{t('result.activityVery')}</option>
              <option value="extra">{t('result.activityExtra')}</option>
            </select>
          </div>
          <button
            onClick={onGetPlan}
            disabled={planLoading || activity === ''}
            className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{planLoading ? t('plan.loading') : t('result.ctaButton')}</span>
            {!planLoading && <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>}
          </button>
          {planError !== null && <p className="mt-2 text-xs text-red-600">{planError}</p>}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire `BmiResultView` into the widget**

In the main `CalculatorWidget` body, replace the inline placeholder for `phase === 'bmi-result'` with:

```tsx
{phase === 'bmi-result' && bmi !== null && (
  <BmiResultView
    bmi={bmi}
    form={form}
    activity={activity}
    onActivity={(a) => setActivity(a)}
    onGetPlan={() => { /* task 9 */ }}
    onEdit={() => setPhase('form')}
    planLoading={false}
    planError={null}
    alreadyUsed={false}
    t={t}
  />
)}
```

Add `planLoading`, `planError`, and `alreadyUsed` placeholder state hooks now so task 9 just fills in the logic:

```tsx
const [planLoading, setPlanLoading] = useState(false);
const [planError, setPlanError] = useState<string | null>(null);
const [planCount, setPlanCount] = useState(0);
const alreadyUsed = planCount >= 2;
```

- [ ] **Step 3: Verify build + smoke-test all four categories**

Run: `pnpm build` then `pnpm dev`. Test these inputs and verify the marker lands in the right zone, pill colour matches, explanation reads naturally:

| Input                                | Expected category | Marker zone |
| ------------------------------------ | ----------------- | ----------- |
| F, 30, 175 cm, 50 kg                 | underweight       | far left    |
| F, 30, 175 cm, 65 kg                 | normal            | left-of-centre |
| F, 30, 175 cm, 80 kg                 | overweight        | right of centre |
| F, 30, 175 cm, 105 kg                | obese             | far right   |

- [ ] **Step 4: Commit**

```bash
git add app/\(content\)/\[locale\]/bmi-calculator/calculator-widget.tsx
git commit -m "BMI widget: full bmi-result view with gradient scale + activity prompt"
```

---

## Task 9: Client Widget — plan generation + `plan` phase + localStorage gate

**Files:**
- Modify: `app/(content)/[locale]/bmi-calculator/calculator-widget.tsx`

**Why:** Wire `Get my plan` to the meal-plan API. Persist results. Enforce the 2-generation gate. Render the plan. This is the conversion-critical task — error handling matters.

**localStorage keys:**
- `nuvvoo_bmi_plan_count` — integer 0..2.
- `nuvvoo_bmi_plan_data` — `{ v: 1, form, bmi, activity, calcResult, plan }`.

**Pattern reference:** deficit calc's `handleGetPlan` (lines 306–399) is the canonical pattern. We copy its shape with three differences: the storage keys above, the `bmi_*` analytics events, and the bmiCategory parameter on those events.

- [ ] **Step 1: Add imports and constants**

At the top of `calculator-widget.tsx`:

```tsx
import { calculate, type CalcResult } from '@/lib/deficit/calc';
import {
  fetchSession,
  generatePlan,
  type ApiLanguage,
  type ApiPlan,
  type ApiSlot,
} from '@/lib/deficit/meal-plan-api';
import { mapToCalcInput } from '@/lib/bmi/bmi';
import { useAppStoreLink } from '@/lib/use-app-store-link';
import { AppStoreBadge } from '@/components/app-store-badge';

const STORAGE_KEY_COUNT = 'nuvvoo_bmi_plan_count';
const STORAGE_KEY_DATA = 'nuvvoo_bmi_plan_data';
const STORAGE_VERSION = 1;
const PLAN_LIMIT_PER_BROWSER = 2;
const PLAN_LIMIT_ENABLED = true;

const API_LANGUAGES: ApiLanguage[] = ['en', 'de', 'ru', 'es', 'fr'];
function toApiLanguage(locale: string): ApiLanguage {
  return (API_LANGUAGES as string[]).includes(locale) ? (locale as ApiLanguage) : 'en';
}

type StoredData = {
  v: number;
  form: BmiFormState;
  bmi: BmiResult;
  activity: Activity;
  calcResult: CalcResult;
  plan: ApiPlan;
};
```

- [ ] **Step 2: Add state, hydration, and session-token ref**

In `CalculatorWidget`:

```tsx
const [plan, setPlan] = useState<ApiPlan | null>(null);
const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
const sessionTokenRef = useRef<string | null>(null);

// Replace the simpler effect from task 7 with this combined one.
useEffect(() => {
  if (viewedRef.current) {
    return;
  }
  viewedRef.current = true;
  track('bmi_calculator_viewed', { page: 'bmi_calculator', locale });

  void fetchSession().then((session) => {
    if (session !== null) {
      sessionTokenRef.current = session.session_token;
    }
  });

  try {
    if (PLAN_LIMIT_ENABLED) {
      const raw = window.localStorage.getItem(STORAGE_KEY_COUNT);
      const n = raw === null ? 0 : parseInt(raw, 10);
      if (!Number.isNaN(n)) {
        setPlanCount(n);
      }
    }
    const dataRaw = window.localStorage.getItem(STORAGE_KEY_DATA);
    if (dataRaw !== null) {
      const data = JSON.parse(dataRaw) as StoredData;
      if (data.v === STORAGE_VERSION && data.form && data.bmi && data.plan) {
        setForm(data.form);
        setBmi(data.bmi);
        setActivity(data.activity);
        setCalcResult(data.calcResult);
        setPlan(data.plan);
        setPhase('plan');
      }
    }
  } catch {
    // ignore stale / corrupt storage
  }
}, [locale]);

async function ensureSessionToken(): Promise<string | null> {
  if (sessionTokenRef.current !== null) {
    return sessionTokenRef.current;
  }
  const session = await fetchSession();
  if (session === null) {
    return null;
  }
  sessionTokenRef.current = session.session_token;
  return session.session_token;
}
```

- [ ] **Step 3: Implement `handleGetPlan`**

```tsx
async function handleGetPlan(): Promise<void> {
  if (bmi === null || activity === '') {
    return;
  }
  track('bmi_cta_clicked', { bmi_category: bmi.category, locale });

  if (alreadyUsed) {
    return; // CTA is rendered as App Store stack, this is just defensive.
  }

  setPlanLoading(true);
  setPlanError(null);

  const token = await ensureSessionToken();
  if (token === null) {
    setPlanError(t('plan.errorTitle'));
    setPlanLoading(false);
    return;
  }

  const input = mapToCalcInput(form, activity, bmi.category);
  const result = calculate(input);
  setCalcResult(result);

  const payload = {
    calories_target: result.target,
    weight_kg: result.weightKg,
    goal: input.goal,
    language: toApiLanguage(locale),
    session_token: token,
    protein_g: result.proteinG,
    carbs_g: result.carbsG,
    fat_g: result.fatG,
  };

  let response = await generatePlan(payload);
  if (!response.ok && response.error.kind === 'session_expired') {
    sessionTokenRef.current = null;
    const fresh = await ensureSessionToken();
    if (fresh === null) {
      setPlanError(t('plan.errorTitle'));
      setPlanLoading(false);
      return;
    }
    response = await generatePlan({ ...payload, session_token: fresh });
  }

  if (!response.ok) {
    if (response.error.kind === 'rate_limited_hourly') {
      setPlanError(t('plan.rateLimitedHourly'));
    } else if (response.error.kind === 'rate_limited_daily') {
      setPlanError(t('plan.rateLimitedDaily'));
    } else {
      setPlanError(t('plan.errorTitle'));
    }
    setPlanLoading(false);
    return;
  }

  const apiPlan = response.plan;
  setPlan(apiPlan);
  setPhase('plan');

  const newCount = planCount + 1;
  setPlanCount(newCount);

  try {
    if (PLAN_LIMIT_ENABLED) {
      window.localStorage.setItem(STORAGE_KEY_COUNT, newCount.toString());
    }
    const stored: StoredData = {
      v: STORAGE_VERSION,
      form,
      bmi,
      activity,
      calcResult: result,
      plan: apiPlan,
    };
    window.localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(stored));
  } catch {
    // storage full / disabled — non-fatal
  }

  track('bmi_plan_generated', {
    bmi_value: bmi.bmi,
    bmi_category: bmi.category,
    target_kcal: result.target,
    total_kcal: apiPlan.totals.calories,
    meal_count: apiPlan.meals.length,
    locale,
  });

  setPlanLoading(false);
}
```

Wire it through `<BmiResultView … onGetPlan={handleGetPlan} />`.

- [ ] **Step 4: Add `PlanView` component**

Mirror deficit calc's `PlanView` (lines 1044–1180). Differences: `useAppStoreLink('bmi_calculator_plan')`, `fireAppClick` events use `bmi_app_click`, `button_location: 'bmi_calculator_plan' | '_badge'`, and add `bmi_category` to event params.

```tsx
function PlanView({
  bmi,
  plan,
  calcResult,
  onEdit,
  t,
}: {
  bmi: BmiResult;
  plan: ApiPlan;
  calcResult: CalcResult;
  onEdit: () => void;
  t: Translator;
}) {
  const tHero = useTranslations('hero');
  const locale = useLocale();
  const { url, handleClick } = useAppStoreLink('bmi_calculator_plan');

  function fireAppClick(buttonLocation: string, extras: Record<string, unknown> = {}): void {
    const trafficSource =
      typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
        ? window.sessionStorage.getItem('nuvvoo_source') || 'direct'
        : 'direct';
    track('bmi_app_click', {
      button_location: buttonLocation,
      traffic_source: trafficSource,
      locale,
      bmi_category: bmi.category,
      ...extras,
    });
  }

  function slotLabel(slot: ApiSlot): string {
    if (slot === 'breakfast') return t('plan.slotBreakfast');
    if (slot === 'lunch') return t('plan.slotLunch');
    if (slot === 'dinner') return t('plan.slotDinner');
    return t('plan.slotSnack');
  }

  function handleCtaClick(): void {
    fireAppClick('bmi_calculator_plan', { target_kcal: calcResult.target });
    handleClick();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{t('plan.heading')}</p>
          <p className="text-2xl font-bold text-slate-900">
            {calcResult.target.toLocaleString()}{' '}
            <span className="text-sm font-medium text-slate-500">{t('plan.kcalUnit')}</span>
          </p>
        </div>
        <button onClick={onEdit} className="text-sm text-nuvvooGreen-700 hover:text-nuvvooGreen-900 underline-offset-2 hover:underline">
          {t('result.edit')}
        </button>
      </div>

      <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {plan.meals.map((meal) => (
          <li key={meal.slot} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-nuvvooGreen-700">{slotLabel(meal.slot)}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{meal.name}</p>
                {meal.description.length > 0 && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{meal.description}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-semibold text-slate-900">{meal.calories.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{t('plan.kcalUnit')}</p>
              </div>
            </div>
            <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500">
              {t('plan.macros', { p: meal.protein_g, c: meal.carbs_g, f: meal.fat_g })}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-700">{t('plan.totalLabel')}</span>
        <span className="text-base font-bold text-slate-900">
          {plan.totals.calories.toLocaleString()} {t('plan.kcalUnit')}
        </span>
      </div>

      {plan.rationale.length > 0 && (
        <p className="rounded-2xl border border-nuvvooGreen-200 bg-nuvvooGreen-50/40 p-4 text-sm leading-relaxed text-slate-700">
          {plan.rationale}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)]"
        >
          {t('conversion.cta')}
        </a>
        <AppStoreBadge buttonLocation="bmi_calculator_plan_badge" size="sm" onClick={() => fireAppClick('bmi_calculator_plan_badge')} />
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>💚 {tHero('trustFree')}</span>
          <span>🔒 {tHero('trustPrivacy')}</span>
        </div>
      </div>
    </div>
  );
}
```

Wire it into the main component:

```tsx
{phase === 'plan' && bmi !== null && plan !== null && calcResult !== null && (
  <PlanView bmi={bmi} plan={plan} calcResult={calcResult} onEdit={() => setPhase('form')} t={t} />
)}
```

- [ ] **Step 5: Add `alreadyUsed` App-Store stack inside `BmiResultView`**

When `alreadyUsed === true`, replace the activity + CTA block with the App-Store conversion stack. Pattern (copy from deficit calc widget lines 995–1021):

```tsx
{alreadyUsed && (
  <div className="border-t border-slate-200 pt-5">
    <p className="text-sm text-slate-600">{t('result.ctaUsedNote')}</p>
    <div className="mt-4 flex flex-col items-center gap-3">
      {/* App Store CTA + badge — wire through useAppStoreLink('bmi_calculator_result_used') */}
    </div>
  </div>
)}
```

The implementer should pull the JSX shape verbatim from deficit calc's "alreadyUsed" branch and adjust the analytics event name (`bmi_app_click`) and button_location (`bmi_calculator_result_used` / `_badge`).

- [ ] **Step 6: Verify build + smoke-test end-to-end**

Run: `pnpm build` then `pnpm dev`. Manually:
1. Submit valid form → BMI result → pick activity → click "Get my plan" → verify plan renders.
2. Check `localStorage`: `nuvvoo_bmi_plan_count === '1'`, `nuvvoo_bmi_plan_data` JSON present and valid.
3. Reload page → should rehydrate into `plan` phase directly.
4. Click "Edit" → return to form. Submit again. Verify count goes to 2.
5. Submit a third time → CTA is replaced with App Store stack (no API call).
6. Verify all 5 analytics events fire in GA4 DebugView (or browser console if local) with the right params.

- [ ] **Step 7: Commit**

```bash
git add app/\(content\)/\[locale\]/bmi-calculator/calculator-widget.tsx
git commit -m "BMI widget: plan generation, plan view, 2-generation gate, error handling"
```

---

## Task 10: Verification before completion

**Files:** none — verification only.

**Why:** Spec §Acceptance requires `pnpm build && pnpm lint` pass, every locale URL is indexable, plan gate triggers at count >= 2, and the five events fire correctly. Don't claim done until this checklist is green.

- [ ] **Step 1: Run unit tests**

Run: `pnpm test:run`
Expected: all `lib/bmi/bmi.test.ts` tests pass.

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: success, no type errors, no warnings about unused imports.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`
Expected: clean — no new warnings or errors.

- [ ] **Step 4: Locale + indexability smoke**

Run `pnpm start` (after the build) and `curl` each locale URL, asserting `<meta name="robots" content="index, follow">` is present:

```bash
for path in /bmi-calculator /de/bmi-calculator /ru/bmi-calculator /es/bmi-calculator /fr/bmi-calculator; do
  echo "=== $path ==="
  curl -s http://localhost:3000$path | grep -i 'name="robots"'
done
```
Expected: each line shows `<meta name="robots" content="index, follow"/>`.

- [ ] **Step 5: Manual end-to-end on each locale**

In `pnpm dev` mode, hit each locale URL, verify H1, intro, BMI category labels, FAQ all render in the locale's language. Verify the gradient scale, marker, pill colours, and explanation copy all render correctly for at least one BMI category per locale.

- [ ] **Step 6: 2-generation gate verification**

In a fresh incognito window:
1. Submit form → generate plan #1 → confirm `nuvvoo_bmi_plan_count === '1'`.
2. Edit, submit, generate plan #2 → confirm count is `'2'`.
3. Edit, submit → CTA section in bmi-result is the App Store stack (no Get my plan button visible).
4. Confirm `nuvvoo_deficit_plan_used` is untouched (independent gate).

- [ ] **Step 7: Analytics events verification**

Open GA4 DebugView (or browser console + GA debug mode). Walk the full funnel and verify each event fires with the documented parameters:

- `bmi_calculator_viewed` once on mount.
- `bmi_calculated` on form submit.
- `bmi_cta_clicked` on "Get my plan" click.
- `bmi_plan_generated` on successful plan response.
- `bmi_app_click` on every App Store CTA / badge click, with `button_location` differing per click site.

- [ ] **Step 8: Verify nothing in deficit calc regressed**

In the same browser session, hit `/calorie-deficit-calculator` and run a single plan generation through. Confirm it still works end-to-end and `nuvvoo_deficit_plan_used` is set independently of BMI's count.

Once all eight steps pass, the feature is complete and ready to ship.

---

## Notes for the implementer

- **DRY shortcuts:** The deficit-calc widget already contains polished `UnitToggle`, `SegmentButton`, `convertWeight`, `convertHeight` utilities. Copy them rather than re-deriving — duplicate code in two widget files is acceptable here because (1) the spec explicitly chose minimal-reuse over refactor, and (2) the two widgets will diverge in user-facing details over time.
- **i18n machine translation:** When translating the `bmiCalculator` namespace into DE / RU / ES / FR, the existing `deficitCalculator` namespace in each file is the gold-standard register for that locale. Match its tone (formal vs informal, sentence length, em-dash vs comma) so the two pages feel like one product.
- **Color tokens:** Tailwind config already has `nuvvooGreen-{50,200,400,700,800,900}`, `shadow-soft`, and the brand button shadow. Other colors (`amber-100`, `blue-100`, `red-100`) are standard Tailwind defaults — no config edits needed.
- **Don't add a `RatePlan` flow.** Deficit calc has it; BMI doesn't (it's out of scope and the spec doesn't include it). The `plan_id` field on `ApiPlan` is optional and we just ignore it.
- **Don't refactor `lib/deficit/`.** Renaming or extracting shared code is filed as a separate maintenance PR per the spec.
