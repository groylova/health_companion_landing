// Pure BMI math + validation + mapping into the existing lib/deficit calc.
// No React, no IO. Tests live alongside in bmi.test.ts.

import {
  inToCm,
  kgToLb,
  lbToKg,
  type Activity,
  type CalcInput,
  type CalcResult,
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

// Flat ±500 kcal/day deficit/surplus — MyFitnessPal-style, the industry
// default users expect to see on a BMI / TDEE calculator. Anchored to
// TDEE (not bodyweight), so a 60-kg and a 120-kg overweight user both
// see "TDEE − 500" rather than the wildly different deltas the
// bodyweight-based pace formula produces. 1200 kcal floor protects
// petite users from sub-minimum-safe targets.
const FLAT_DEFICIT_KCAL = 500;
const MIN_KCAL = 1200;

// Post-process the deficit-calc result so target + weeklyDelta reflect a
// flat ±500 deficit/surplus rather than the pace-based bodyweight delta
// the underlying calculate() picked. BMR/TDEE/macros are kept as-is —
// macros are calibrated by bodyweight + goal in macroSplit() and only
// the carbs back-fill changes slightly when target moves by ~50 kcal;
// recomputing the full macro split would require re-exporting an
// internal of calc.ts, which the BMI spec deliberately avoids.
export function applyFlatDeficit(result: CalcResult, goal: CalcInput['goal']): CalcResult {
  if (goal === 'maintain') {
    return result;
  }
  const signedDelta = goal === 'lose' ? -FLAT_DEFICIT_KCAL : FLAT_DEFICIT_KCAL;
  const rawTarget = result.tdee + signedDelta;
  const clamped = rawTarget < MIN_KCAL;
  const target = clamped ? MIN_KCAL : rawTarget;
  const roundedTarget = Math.round(target / 10) * 10;
  // Effective daily delta after clamp — for very petite users the floor
  // shrinks the delta, so weekly weight change is slower than 500/7700.
  const effectiveDailyDelta = roundedTarget - result.tdee;
  const weeklyKg = (effectiveDailyDelta * 7) / 7700;
  return {
    ...result,
    target: roundedTarget,
    clamped,
    weeklyDeltaKg: Math.round(weeklyKg * 10) / 10,
    weeklyDeltaLb: Math.round(kgToLb(weeklyKg) * 10) / 10,
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
  // BMI page uses slow pace by default — 0.5% bodyweight/week for lose,
  // 0.3% for gain. That lands around a 500 kcal/day deficit for a typical
  // overweight user (the deficit calc's pace=normal yields 700-900 which
  // exceeds the conservative "lose 0.5-1 kg/week" public-health rule).
  // Deficit calc has the pace selector for users who want to tune; BMI
  // page is for visitors looking for the BMI number, so a sustainable
  // default beats giving them an aggressive sub-1500 kcal target.
  return {
    weight: weightKg,
    weightUnit: 'kg',
    height: heightCm,
    heightUnit: 'cm',
    age,
    gender: form.gender,
    activity,
    goal,
    pace: 'slow',
  };
}
