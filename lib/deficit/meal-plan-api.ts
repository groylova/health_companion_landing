// Thin client wrapper for the public Meal-Plan API.
// Spec: GET /public/meal-plan/session → token (IP-bound, 30 min TTL)
//       POST /public/meal-plan        → AI-generated day plan
// Base URL comes from NEXT_PUBLIC_MEAL_PLAN_API_URL; the production
// Nuvvoo backend at app.kentryx.org is the default so the prod build
// works without explicit env config. Override locally to hit a dev
// instance (e.g. NEXT_PUBLIC_MEAL_PLAN_API_URL=http://localhost:8000).

const DEFAULT_BASE_URL = 'https://app.kentryx.org';

export function mealPlanApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_MEAL_PLAN_API_URL;
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_BASE_URL;
}

export type ApiLanguage = 'en' | 'de' | 'ru' | 'es' | 'fr';
export type ApiGoal = 'lose' | 'maintain' | 'gain';
export type ApiSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ApiDiet = 'none' | 'vegetarian' | 'pescatarian' | 'vegan';

export type ApiSession = {
  session_token: string;
  expires_in: number;
};

export type ApiMeal = {
  slot: ApiSlot;
  name: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type ApiTotals = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type ApiPlan = {
  meals: ApiMeal[];
  totals: ApiTotals;
  rationale: string;
};

export type GeneratePlanInput = {
  calories_target: number;
  weight_kg: number;
  goal: ApiGoal;
  language: ApiLanguage;
  session_token: string;
  // Optional macro targets — when sent, the AI honors them as the day's split.
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  // Diet is a hard constraint ("vegan" excludes all animal products).
  diet?: ApiDiet;
  // Allergies are hard exclusions including related groups ("peanut" → all
  // tree nuts; "shellfish" → all crustaceans). Backend caps at 8 × 32 chars.
  allergies?: string[];
};

export type GeneratePlanError =
  | { kind: 'session_expired' }
  // Backend enforces two rate windows: 5/hour and 20/day per IP. The 429
  // body distinguishes them ("hourly..." vs "daily..."), which we surface
  // so the UI can tell the user the correct wait time.
  | { kind: 'rate_limited_hourly' }
  | { kind: 'rate_limited_daily' }
  | { kind: 'service_unavailable' }
  | { kind: 'origin_blocked' }
  | { kind: 'invalid_input' }
  | { kind: 'network' };

export async function fetchSession(): Promise<ApiSession | null> {
  const url = `${mealPlanApiBaseUrl()}/public/meal-plan/session`;
  console.log('[meal-plan] GET', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
    });
    console.log('[meal-plan] session status:', response.status);
    if (!response.ok) {
      const body = await response.text();
      console.warn('[meal-plan] session error body:', body);
      return null;
    }
    return (await response.json()) as ApiSession;
  } catch (err) {
    console.error('[meal-plan] session fetch failed:', err);
    return null;
  }
}

export type GeneratePlanResult =
  | { ok: true; plan: ApiPlan }
  | { ok: false; error: GeneratePlanError };

export async function generatePlan(input: GeneratePlanInput): Promise<GeneratePlanResult> {
  const url = `${mealPlanApiBaseUrl()}/public/meal-plan`;
  // Avoid logging the full token in clear; show prefix only.
  const tokenPreview = input.session_token.slice(0, 12) + '…';
  console.log('[meal-plan] POST', url, { ...input, session_token: tokenPreview });

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify(input),
    });
  } catch (err) {
    console.error('[meal-plan] generate fetch failed:', err);
    return { ok: false, error: { kind: 'network' } };
  }

  console.log('[meal-plan] generate status:', response.status);

  if (response.ok) {
    const plan = (await response.json()) as ApiPlan;
    return { ok: true, plan };
  }

  // Read the body once so we can log it AND surface the typed error. response
  // bodies can only be consumed once, so we buffer it as text first.
  const body = await response.text();
  console.warn('[meal-plan] generate error body:', body);

  if (response.status === 401) {
    return { ok: false, error: { kind: 'session_expired' } };
  }
  if (response.status === 403) {
    return { ok: false, error: { kind: 'origin_blocked' } };
  }
  if (response.status === 422) {
    return { ok: false, error: { kind: 'invalid_input' } };
  }
  if (response.status === 429) {
    // Body shape: {"detail": "hourly meal-plan limit reached, ..."} — pick
    // hourly vs daily off the substring; default to hourly if unparseable.
    const isDaily = body.includes('daily');
    return {
      ok: false,
      error: { kind: isDaily ? 'rate_limited_daily' : 'rate_limited_hourly' },
    };
  }
  if (response.status === 503) {
    return { ok: false, error: { kind: 'service_unavailable' } };
  }
  return { ok: false, error: { kind: 'network' } };
}
