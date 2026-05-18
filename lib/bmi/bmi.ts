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
