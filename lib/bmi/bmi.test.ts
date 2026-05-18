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
