import mealsData from './meals.json';

// Pure plan assembly. Stub for the future "AI plan" backend — same return
// shape, same timing characteristics. Swapping in a real LLM later means
// replacing the body of `assemble()`; the route handler stays untouched.

export type Slot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type RawMeal = {
  id: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
};

type MealPool = Record<Slot, RawMeal[]>;
const POOL: MealPool = mealsData as MealPool;

export type PlannedMeal = {
  slot: Slot;
  id: string;
  kcal: number;
  factor: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Plan = {
  meals: PlannedMeal[];
  totalKcal: number;
  targetKcal: number;
  fitsBand: boolean;
};

// Mulberry32 — tiny seedable PRNG, no deps. Same seed → same plan.
function rngFrom(seed: number): () => number {
  let a = seed >>> 0;
  return function rng(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(parts: Array<string | number>): number {
  // FNV-1a 32-bit. Stable across Node and browsers, good enough for picking.
  let h = 0x811c9dc5;
  const s = parts.join('|');
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// Slot share of total target. Two profiles depending on whether we include a
// snack (4-meal vs 3-meal). Numbers add to 1.0.
const SHARE_4: Record<Slot, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snack: 0.10,
};

const SHARE_3: Record<Slot, number> = {
  breakfast: 0.30,
  lunch: 0.40,
  dinner: 0.30,
  snack: 0,
};

// Portion factor clamps. Below 0.5× a meal stops looking like a meal; above
// 2× the macro counts get unrealistic relative to the listed kcal.
const FACTOR_MIN = 0.5;
const FACTOR_MAX = 2.0;

// Acceptance criteria: total within ±10% of target.
const TOLERANCE = 0.10;

export type AssembleInput = {
  targetKcal: number;
  gender: 'male' | 'female';
  activity: string;
  goal: string;
};

export function assemble(input: AssembleInput): Plan {
  const target = input.targetKcal;
  const useSnack = target >= 1800;
  const slots: Slot[] = useSnack
    ? ['breakfast', 'lunch', 'dinner', 'snack']
    : ['breakfast', 'lunch', 'dinner'];
  const shares = useSnack ? SHARE_4 : SHARE_3;

  const seed = hashSeed([
    Math.round(target / 50) * 50,
    input.gender,
    input.activity,
    input.goal,
  ]);
  const rng = rngFrom(seed);

  // Stage 1: pick a meal per slot and compute the unclamped portion factor.
  type Picked = { slot: Slot; meal: RawMeal; rawFactor: number };
  const picked: Picked[] = slots.map((slot) => {
    const meal = pick(POOL[slot], rng);
    const slotKcal = target * shares[slot];
    const rawFactor = slotKcal / meal.kcal;
    return { slot, meal, rawFactor };
  });

  // Stage 2: clamp factors. Capture how much kcal we lost to clamping so we
  // can redistribute it across slots that still have headroom.
  const clamped = picked.map((p) => {
    if (p.rawFactor < FACTOR_MIN) {
      return { ...p, factor: FACTOR_MIN };
    }
    if (p.rawFactor > FACTOR_MAX) {
      return { ...p, factor: FACTOR_MAX };
    }
    return { ...p, factor: p.rawFactor };
  });

  let totalKcal = clamped.reduce((sum, p) => sum + p.meal.kcal * p.factor, 0);
  let deficit = target - totalKcal;

  // Stage 3: redistribute residual across slots with available headroom.
  // One pass is enough in practice given the pool sizes; bail out if the
  // remaining slack is impossible to absorb.
  if (Math.abs(deficit) > target * TOLERANCE) {
    const adjustable = clamped.filter(
      (p) => (deficit > 0 ? p.factor < FACTOR_MAX : p.factor > FACTOR_MIN),
    );
    if (adjustable.length > 0) {
      const perSlot = deficit / adjustable.length;
      for (const p of adjustable) {
        const desiredFactor = p.factor + perSlot / p.meal.kcal;
        if (desiredFactor > FACTOR_MAX) {
          p.factor = FACTOR_MAX;
        } else if (desiredFactor < FACTOR_MIN) {
          p.factor = FACTOR_MIN;
        } else {
          p.factor = desiredFactor;
        }
      }
      totalKcal = clamped.reduce((sum, p) => sum + p.meal.kcal * p.factor, 0);
      deficit = target - totalKcal;
    }
  }

  const meals: PlannedMeal[] = clamped.map((p) => {
    const factorRounded = Math.round(p.factor * 10) / 10;
    return {
      slot: p.slot,
      id: p.meal.id,
      kcal: Math.round(p.meal.kcal * factorRounded / 10) * 10,
      factor: factorRounded,
      protein: Math.round(p.meal.p * factorRounded),
      carbs: Math.round(p.meal.c * factorRounded),
      fat: Math.round(p.meal.f * factorRounded),
    };
  });

  const finalTotal = meals.reduce((sum, m) => sum + m.kcal, 0);
  const fitsBand = Math.abs(finalTotal - target) <= target * TOLERANCE;

  return {
    meals,
    totalKcal: finalTotal,
    targetKcal: target,
    fitsBand,
  };
}
