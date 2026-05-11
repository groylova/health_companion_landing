// Pure deficit-calculator math: unit conversion, Mifflin-St Jeor BMR, TDEE,
// daily target, weekly weight delta. No React, no IO — easy to unit-test.

export type Gender = 'male' | 'female';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Pace = 'slow' | 'normal' | 'fast';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in';

export const ACTIVITY_MULTIPLIER: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

// Pace is a percentage of *current bodyweight* per week, different for the
// two directions. Lose tops out at 1%/week (CDC's upper sustainable bound);
// gain caps at 0.75% because most weekly gain above that is fat in
// non-training populations. The daily kcal delta is then derived from the
// chosen rate via the 7700 kcal/kg approximation.
const PACE_PCT: Record<Goal, Record<Pace, number>> = {
  lose: { slow: 0.005, normal: 0.0075, fast: 0.01 },
  gain: { slow: 0.003, normal: 0.005, fast: 0.0075 },
  maintain: { slow: 0, normal: 0, fast: 0 },
};

export const PACE_KEYS: Pace[] = ['slow', 'normal', 'fast'];

const KCAL_PER_KG = 7700;
const RATE_STEP_KG = 0.25;
const RATE_MIN_KG = 0.25;

// Banker's rounding (half-to-even) to a fixed step. Avoids the slight upward
// bias of nearest-half-up over many users.
function bankersRoundToStep(value: number, step: number): number {
  const scaled = value / step;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  if (diff < 0.5) {
    return floor * step;
  }
  if (diff > 0.5) {
    return (floor + 1) * step;
  }
  // Exactly halfway: round to nearest even multiple of `step`.
  if (floor % 2 === 0) {
    return floor * step;
  }
  return (floor + 1) * step;
}

// Returns the three paces' weekly weight-change rates (always positive kg/week)
// for the given current weight + goal. Already rounded, floored, and made
// strictly increasing so adjacent presets never collapse for low-weight users.
export function paceRates(weightKg: number, goal: Goal): Record<Pace, number> {
  if (goal === 'maintain') {
    return { slow: 0, normal: 0, fast: 0 };
  }
  const pcts = PACE_PCT[goal];
  let slow = bankersRoundToStep(weightKg * pcts.slow, RATE_STEP_KG);
  let normal = bankersRoundToStep(weightKg * pcts.normal, RATE_STEP_KG);
  let fast = bankersRoundToStep(weightKg * pcts.fast, RATE_STEP_KG);

  if (slow < RATE_MIN_KG) {
    slow = RATE_MIN_KG;
  }
  if (normal < RATE_MIN_KG) {
    normal = RATE_MIN_KG;
  }
  if (fast < RATE_MIN_KG) {
    fast = RATE_MIN_KG;
  }

  // Guarantee the ladder stays strictly increasing after rounding.
  if (normal <= slow) {
    normal = slow + RATE_STEP_KG;
  }
  if (fast <= normal) {
    fast = normal + RATE_STEP_KG;
  }

  return { slow, normal, fast };
}

// Daily kcal delta implied by the chosen pace. Negative for lose, positive
// for gain, zero for maintain.
export function paceDelta(weightKg: number, goal: Goal, pace: Pace): number {
  if (goal === 'maintain') {
    return 0;
  }
  const rates = paceRates(weightKg, goal);
  const dailyKcal = (rates[pace] * KCAL_PER_KG) / 7;
  if (goal === 'lose') {
    return -dailyKcal;
  }
  return dailyKcal;
}

// Unified safety floor — 1200 kcal/day is the lower bound for self-managed
// deficits without medical supervision in NIDDK / NIH guidance.
const MIN_KCAL = 1200;

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;
const KG_TO_LB = 1 / LB_TO_KG;

export function lbToKg(lb: number): number {
  return lb * LB_TO_KG;
}

export function inToCm(inches: number): number {
  return inches * IN_TO_CM;
}

export function kgToLb(kg: number): number {
  return kg * KG_TO_LB;
}

export type CalcInput = {
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  age: number;
  gender: Gender;
  activity: Activity;
  goal: Goal;
  pace: Pace;
};

export type CalcResult = {
  bmr: number;
  tdee: number;
  target: number;
  // Both deltas always present so the UI can render in the user's chosen unit
  // without re-doing math. Negative for lose, 0 for maintain, positive for gain.
  weeklyDeltaKg: number;
  weeklyDeltaLb: number;
  // True when the deficit pushed the target below the safety floor and we
  // clamped it. UI uses this to show a "we capped your target" note so the
  // weekly delta doesn't read as a lie.
  clamped: boolean;
  weightKg: number;
  // Suggested macro split for the kcal target. Protein anchored to bodyweight
  // (preserves lean mass during a deficit), fat held at 25% of kcal (safe
  // floor for hormone production), carbs back-filled. These are starter
  // targets — the AI plan honors them when sent as protein_g/carbs_g/fat_g.
  proteinG: number;
  carbsG: number;
  fatG: number;
};

function mifflin(kg: number, cm: number, age: number, gender: Gender): number {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  if (gender === 'male') {
    return base + 5;
  }
  return base - 161;
}

export function calculate(input: CalcInput): CalcResult {
  const kg = input.weightUnit === 'kg' ? input.weight : lbToKg(input.weight);
  const cm = input.heightUnit === 'cm' ? input.height : inToCm(input.height);

  const bmr = mifflin(kg, cm, input.age, input.gender);
  const tdee = bmr * ACTIVITY_MULTIPLIER[input.activity];
  const goalDelta = paceDelta(kg, input.goal, input.pace);
  const rawTarget = tdee + goalDelta;

  const clamped = rawTarget < MIN_KCAL;
  const target = clamped ? MIN_KCAL : rawTarget;

  // Weekly delta should reflect the *actual* deficit being applied, not the
  // requested deficit. If we clamped the target, the effective deficit is
  // smaller, so the weekly loss estimate should be smaller too.
  const effectiveDailyDelta = target - tdee;
  const weeklyKg = (effectiveDailyDelta * 7) / KCAL_PER_KG;
  const weeklyLb = kgToLb(weeklyKg);

  const roundedTarget = Math.round(target / 10) * 10;
  const macros = macroSplit(roundedTarget, kg, input.goal);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: roundedTarget,
    weeklyDeltaKg: Math.round(weeklyKg * 10) / 10,
    weeklyDeltaLb: Math.round(weeklyLb * 10) / 10,
    clamped,
    weightKg: Math.round(kg * 10) / 10,
    proteinG: macros.protein,
    carbsG: macros.carbs,
    fatG: macros.fat,
  };
}

// Macro split mirrors the Nuvvoo backend (_compute_macro_targets in
// app/agent/calorie/goals.py). We replicate it client-side so the targets
// the user sees on the result screen are exactly what the AI plan will
// honor when we send them in /public/meal-plan.
//
// Steps:
//   1. Protein = weight × per-kg factor (goal-dependent).
//   2. Fat = max(weight × 0.6, target × 25% / 9) — never below the
//      hormone-floor, never below 25% of kcal.
//   3. Carbs = remainder.
//   4. Guardrail: if carbs < 100 g, pull from protein to bring carbs to 100.
//   5. Clamp protein to [weight×1.4, weight×2.2] — ISSN safe band.
//   6. Recompute carbs so the kcal sum stays exact after protein clamp.
const PROTEIN_PER_KG: Record<Goal, number> = {
  lose: 2.0,
  maintain: 1.7,
  gain: 1.8,
};
const FAT_KCAL_SHARE = 0.25;
const FAT_FLOOR_PER_KG = 0.6;
const CARBS_FLOOR_G = 100;
const PROTEIN_MIN_PER_KG = 1.4;
const PROTEIN_MAX_PER_KG = 2.2;

const KCAL_PER_G_PROTEIN = 4;
const KCAL_PER_G_CARBS = 4;
const KCAL_PER_G_FAT = 9;

function macroSplit(
  targetKcal: number,
  weightKg: number,
  goal: Goal,
): { protein: number; carbs: number; fat: number } {
  let protein = weightKg * PROTEIN_PER_KG[goal];
  const fat = Math.max(weightKg * FAT_FLOOR_PER_KG, (targetKcal * FAT_KCAL_SHARE) / KCAL_PER_G_FAT);
  let carbs = (targetKcal - protein * KCAL_PER_G_PROTEIN - fat * KCAL_PER_G_FAT) / KCAL_PER_G_CARBS;

  if (carbs < CARBS_FLOOR_G) {
    const deficitG = CARBS_FLOOR_G - carbs;
    protein -= deficitG;
    carbs = CARBS_FLOOR_G;
  }

  const proteinMin = weightKg * PROTEIN_MIN_PER_KG;
  const proteinMax = weightKg * PROTEIN_MAX_PER_KG;
  protein = Math.max(proteinMin, Math.min(proteinMax, protein));

  carbs = (targetKcal - protein * KCAL_PER_G_PROTEIN - fat * KCAL_PER_G_FAT) / KCAL_PER_G_CARBS;

  return {
    protein: Math.round(protein),
    carbs: Math.round(Math.max(0, carbs)),
    fat: Math.round(fat),
  };
}

// Validation used by both client form and server route. Returns null when
// valid, otherwise an i18n key referencing the offending field/reason.
export type ValidationError = {
  field: keyof CalcInput;
  reason: 'required' | 'range';
};

export function validate(input: Partial<CalcInput>): ValidationError | null {
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

  const validActivities: Activity[] = ['sedentary', 'light', 'moderate', 'very', 'extra'];
  if (input.activity === undefined || !validActivities.includes(input.activity)) {
    return { field: 'activity', reason: 'required' };
  }

  const validGoals: Goal[] = ['lose', 'maintain', 'gain'];
  if (input.goal === undefined || !validGoals.includes(input.goal)) {
    return { field: 'goal', reason: 'required' };
  }

  // All three paces are valid for both lose and gain (the *rates* differ —
  // see PACE_PCT). Maintain ignores pace entirely; it just rides along.
  if (input.pace === undefined || !PACE_KEYS.includes(input.pace)) {
    return { field: 'pace', reason: 'required' };
  }

  return null;
}
