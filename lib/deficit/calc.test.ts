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
