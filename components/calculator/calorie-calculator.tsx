'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  PACE_KEYS,
  calculate,
  computeBmr,
  kgToLb,
  lbToKg,
  paceRates,
  validate,
  type Activity,
  type BmrInput,
  type CalcInput,
  type CalcResult,
  type Gender,
  type Goal,
  type HeightUnit,
  type Pace,
  type ValidationError,
  type WeightUnit,
} from '@/lib/deficit/calc';
import {
  fetchSession,
  generatePlan,
  ratePlan,
  type ApiDiet,
  type ApiLanguage,
  type ApiPlan,
  type ApiSlot,
} from '@/lib/deficit/meal-plan-api';
import { useAppStoreLink } from '@/lib/use-app-store-link';
import { AppStoreBadge } from '@/components/app-store-badge';

// gtag is declared globally in lib/use-app-store-link.ts as
// `(...args: any[]) => void`; we don't redeclare it here.

type Mode = 'bmr' | 'tdee' | 'deficit';

type Phase = 'form' | 'result' | 'plan';

// Split height fields: when heightUnit is 'cm' we use heightCm; when 'in'
// (imperial) we use heightFt + heightIn. US-focused defaults: lb + ft/in.
type FormState = {
  weight: string;
  weightUnit: WeightUnit;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  heightUnit: HeightUnit;
  age: string;
  gender: Gender | '';
  activity: Activity | '';
  goal: Goal;
  pace: Pace;
  diet: ApiDiet;
  allergies: string[];
};

function defaultForm(mode: Mode): FormState {
  return {
    weight: '',
    weightUnit: 'kg',
    heightCm: '',
    heightFt: '',
    heightIn: '',
    heightUnit: 'cm',
    age: '',
    gender: '',
    activity: '',
    goal: mode === 'deficit' ? 'lose' : 'maintain',
    pace: 'normal',
    diet: 'none',
    allergies: [],
  };
}

const DIET_OPTIONS: ApiDiet[] = ['none', 'vegetarian', 'pescatarian', 'vegan'];
const MAX_ALLERGIES = 8;
const MAX_ALLERGY_LEN = 32;

// Bumped to 6 when FormState gained diet + allergies — old payloads lack
// those fields and would crash the chip input on rehydrate. The version
// gate at load time drops stale entries instead of trying to migrate them.
const STORAGE_VERSION = 6;

// Enforces the "1 generation per browser" gate from the public AC. When
// false, the gate is bypassed for local iteration on prompt/UI — flip back
// to true before shipping so production stays within the spec.
const PLAN_LIMIT_ENABLED = true;

type StoredData = {
  v: number;
  form: FormState;
  result: CalcResult;
  plan: ApiPlan;
};

const API_LANGUAGES: ApiLanguage[] = ['en', 'de', 'ru', 'es', 'fr'];

function toApiLanguage(locale: string): ApiLanguage {
  if ((API_LANGUAGES as string[]).includes(locale)) {
    return locale as ApiLanguage;
  }
  return 'en';
}

function track(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', name, params || {});
}

// Resolves the analytics page prefix for a given calculator mode. Used to
// mode-prefix `button_location` strings on App Store CTAs so funnel dashboards
// can split BMR vs TDEE vs deficit. Deliberately returns `deficit_calculator`
// (not `deficit_calculator_calculator`) so legacy dashboard filters for the
// deficit funnel keep working byte-for-byte.
function calcPagePrefix(mode: Mode): string {
  if (mode === 'deficit') {
    return 'deficit_calculator';
  }
  return `${mode}_calculator`;
}

function toCalcInput(form: FormState): Partial<CalcInput> {
  const weight = parseFloat(form.weight);
  const age = parseInt(form.age, 10);

  let height: number | undefined;
  if (form.heightUnit === 'cm') {
    const cm = parseFloat(form.heightCm);
    if (!Number.isNaN(cm)) {
      height = cm;
    }
  } else {
    const ftStr = form.heightFt.trim();
    if (ftStr.length > 0) {
      const ft = parseFloat(ftStr);
      // Inches are optional — empty means "and zero" so 6'0" works.
      const inStrRaw = form.heightIn.trim();
      const inches = inStrRaw.length === 0 ? 0 : parseFloat(inStrRaw);
      if (!Number.isNaN(ft) && !Number.isNaN(inches)) {
        height = ft * 12 + inches;
      }
    }
  }

  return {
    weight: Number.isNaN(weight) ? undefined : weight,
    weightUnit: form.weightUnit,
    height,
    heightUnit: form.heightUnit,
    age: Number.isNaN(age) ? undefined : age,
    gender: form.gender === '' ? undefined : form.gender,
    activity: form.activity === '' ? undefined : form.activity,
    goal: form.goal,
    pace: form.pace,
  };
}

// Convert weight value when toggling unit. Empty stays empty.
function convertWeight(value: string, from: WeightUnit, to: WeightUnit): string {
  if (from === to) {
    return value;
  }
  const v = parseFloat(value);
  if (Number.isNaN(v)) {
    return value;
  }
  if (from === 'kg' && to === 'lb') {
    return (Math.round(v * 2.20462 * 10) / 10).toString();
  }
  return (Math.round((v / 2.20462) * 10) / 10).toString();
}

// Convert height fields when toggling units. Returns the next {heightCm, heightFt, heightIn}.
function convertHeight(
  current: { heightCm: string; heightFt: string; heightIn: string },
  from: HeightUnit,
  to: HeightUnit,
): { heightCm: string; heightFt: string; heightIn: string } {
  if (from === to) {
    return current;
  }
  if (from === 'cm' && to === 'in') {
    const cm = parseFloat(current.heightCm);
    if (Number.isNaN(cm)) {
      return current;
    }
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - ft * 12);
    return { heightCm: current.heightCm, heightFt: ft.toString(), heightIn: inches.toString() };
  }
  // in → cm
  const ftStr = current.heightFt.trim();
  if (ftStr.length === 0) {
    return current;
  }
  const ft = parseFloat(ftStr);
  if (Number.isNaN(ft)) {
    return current;
  }
  const inStr = current.heightIn.trim();
  const inches = inStr.length === 0 ? 0 : parseFloat(inStr);
  if (Number.isNaN(inches)) {
    return current;
  }
  const cm = Math.round((ft * 12 + inches) * 2.54);
  return { heightCm: cm.toString(), heightFt: current.heightFt, heightIn: current.heightIn };
}

type Props = {
  mode: Mode;
  messagesNamespace: 'bmrCalculator' | 'tdeeCalculator' | 'deficitCalculator';
};

export function CalorieCalculator({ mode, messagesNamespace }: Props) {
  const t = useTranslations(messagesNamespace);
  const locale = useLocale();

  const storageKeyUsed = `nuvvoo_${mode}_plan_used`;
  const storageKeyData = `nuvvoo_${mode}_plan_data`;

  const [phase, setPhase] = useState<Phase>('form');
  const [form, setForm] = useState<FormState>(() => defaultForm(mode));
  const [error, setError] = useState<ValidationError | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [plan, setPlan] = useState<ApiPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Imperative focus management when the BMR/TDEE upgrade panel reveals. The
  // ref is attached to the panel root inside ResultView; the effect runs in
  // the parent so the focus call lands after the panel mounts.
  const upgradePanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!upgrading) {
      return;
    }
    const root = upgradePanelRef.current;
    if (root === null) {
      return;
    }
    const focusable = root.querySelector<HTMLElement>(
      'select, button:not([type="button"][aria-label]), input',
    );
    focusable?.focus();
  }, [upgrading]);

  function handleUpgradeClick(): void {
    track('upgrade_clicked', { mode, locale });
    setUpgrading(true);
  }

  // Session token is fetched once on mount per the API contract; we cache it
  // in a ref so the click handler can read the latest value (and replace it
  // without triggering re-renders when we transparently rotate after 401).
  const sessionTokenRef = useRef<string | null>(null);
  const viewedRef = useRef(false);

  // Hydrate from localStorage on mount, fire calculator_viewed once, and
  // bootstrap an API session token in parallel. The session call is fire-
  // and-forget on mount; if it fails we'll lazy-retry on first plan click.
  useEffect(() => {
    if (viewedRef.current) {
      return;
    }
    viewedRef.current = true;
    const pageNameFor: Record<Mode, string> = {
      bmr: 'bmr_calculator',
      tdee: 'tdee_calculator',
      deficit: 'calorie_deficit_calculator',
    };
    track('calculator_viewed', { page: pageNameFor[mode], mode, locale });

    void fetchSession().then((session) => {
      if (session !== null) {
        sessionTokenRef.current = session.session_token;
      }
    });

    try {
      if (PLAN_LIMIT_ENABLED) {
        const used = window.localStorage.getItem(storageKeyUsed);
        if (used === '1') {
          setAlreadyUsed(true);
        }
      }
      const dataRaw = window.localStorage.getItem(storageKeyData);
      if (dataRaw !== null) {
        const data = JSON.parse(dataRaw) as StoredData;
        if (data.v === STORAGE_VERSION && data.form && data.result && data.plan) {
          setForm(data.form);
          setResult(data.result);
          setPlan(data.plan);
          setPhase('plan');
        }
      }
    } catch {
      // localStorage parse error — ignore, start fresh.
    }
  }, [locale]);

  // Ensure we have a session token before posting. Returns null on failure;
  // callers treat that as a transient backend issue.
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

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error !== null && error.field === key) {
      setError(null);
    }
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const input = toCalcInput(form);
    const validationError = validate(input, mode);
    if (validationError !== null) {
      setError(validationError);
      return;
    }

    let calcResult: CalcResult;
    if (mode === 'bmr') {
      // Hero number is BMR only; no need to materialize TDEE/target/macros yet.
      // Activity is missing on the BMR form so calculate() would throw — stub
      // the rest with zeros and fill them in later if the user opts in to the
      // upgrade panel.
      const bmrInput = input as BmrInput;
      const bmrValue = computeBmr(bmrInput);
      calcResult = {
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
      };
    } else {
      calcResult = calculate(input as CalcInput);
    }

    setResult(calcResult);
    setError(null);
    setPhase('result');
    track('calculator_completed', {
      mode,
      target_kcal: calcResult.target,
      goal: form.goal,
      activity: form.activity,
      gender: form.gender,
      clamped: calcResult.clamped,
      locale,
    });
  }

  function handleEdit(): void {
    setPhase('form');
    setUpgrading(false);
  }

  async function handleGetPlan(): Promise<void> {
    if (result === null) {
      return;
    }

    if (alreadyUsed) {
      // Already used → still show the cached plan if we have it; otherwise
      // surface the limit message inline.
      return;
    }

    // Plan generation needs the full deficit field set. On BMR/TDEE pages we
    // hide some of those at the form step; the upgrade panel collects them
    // before this call. Re-validate here under 'deficit' rules so missing
    // fields surface as inline errors instead of API failures. Validation runs
    // BEFORE the BMR-mode recompute so a missing activity (or other gap)
    // fails fast instead of tripping calculate()'s preconditions.
    const fullValidation = validate(toCalcInput(form), 'deficit');
    if (fullValidation !== null) {
      setError(fullValidation);
      return;
    }

    // For BMR mode the result we stored at form-submit time has zeros for
    // tdee/target/macros (activity was missing back then). Now that the
    // upgrade panel has the activity, recompute the full CalcResult here so
    // the analytics event AND the downstream payload all see the real target
    // (otherwise plan_cta_clicked.target_kcal would be 0). For TDEE/deficit
    // modes the form-submit result is already complete.
    const effectiveResult: CalcResult =
      mode === 'bmr' ? calculate(toCalcInput(form) as CalcInput) : result;

    if (mode === 'bmr') {
      // Catch the result state up so setPhase('plan') below renders against
      // the populated CalcResult instead of the zeroed BMR-form one.
      setResult(effectiveResult);
    }

    track('plan_cta_clicked', {
      mode,
      target_kcal: effectiveResult.target,
      goal: form.goal,
      locale,
    });

    setPlanLoading(true);
    setPlanError(null);

    const token = await ensureSessionToken();
    if (token === null) {
      setPlanError('generic');
      setPlanLoading(false);
      return;
    }

    const payload = {
      calories_target: effectiveResult.target,
      weight_kg: effectiveResult.weightKg,
      goal: form.goal,
      language: toApiLanguage(locale),
      session_token: token,
      // Send the same macro split we show on the result screen so the AI
      // plan honors it (otherwise it'd compute its own and the displayed
      // targets would drift from what arrives back).
      protein_g: effectiveResult.proteinG,
      carbs_g: effectiveResult.carbsG,
      fat_g: effectiveResult.fatG,
      diet: form.diet,
      // Backend caps at 8 chips × 32 chars; FormState already enforces that.
      allergies: form.allergies.length > 0 ? form.allergies : undefined,
    };

    // First attempt with the cached session token. If the backend rejects
    // it as expired (401), drop the cached value, fetch a fresh one, and
    // try once more — token TTL is 30 min so this is a real possibility
    // when a user lingers on the page.
    let response = await generatePlan(payload);
    if (!response.ok && response.error.kind === 'session_expired') {
      sessionTokenRef.current = null;
      const fresh = await ensureSessionToken();
      if (fresh === null) {
        setPlanError('generic');
        setPlanLoading(false);
        return;
      }
      response = await generatePlan({ ...payload, session_token: fresh });
    }

    if (!response.ok) {
      if (response.error.kind === 'rate_limited_hourly') {
        setPlanError('rateLimitedHourly');
      } else if (response.error.kind === 'rate_limited_daily') {
        setPlanError('rateLimitedDaily');
      } else {
        setPlanError('generic');
      }
      setPlanLoading(false);
      return;
    }

    const apiPlan = response.plan;
    setPlan(apiPlan);
    setPhase('plan');
    if (PLAN_LIMIT_ENABLED) {
      setAlreadyUsed(true);
    }

    const stored: StoredData = { v: STORAGE_VERSION, form, result: effectiveResult, plan: apiPlan };
    try {
      if (PLAN_LIMIT_ENABLED) {
        window.localStorage.setItem(storageKeyUsed, '1');
      }
      window.localStorage.setItem(storageKeyData, JSON.stringify(stored));
    } catch {
      // Storage full / disabled — feature still works for this session.
    }

    track('plan_generated', {
      mode,
      target_kcal: effectiveResult.target,
      total_kcal: apiPlan.totals.calories,
      meal_count: apiPlan.meals.length,
      goal: form.goal,
      locale,
    });

    setPlanLoading(false);
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur md:p-7">
      {phase === 'form' && (
        <FormView
          mode={mode}
          form={form}
          error={error}
          onField={handleField}
          onSubmit={handleSubmit}
          t={t}
        />
      )}
      {phase === 'result' && result !== null && (
        <ResultView
          mode={mode}
          form={form}
          result={result}
          error={error}
          alreadyUsed={alreadyUsed}
          upgrading={upgrading}
          planLoading={planLoading}
          planError={planError}
          onEdit={handleEdit}
          onGetPlan={handleGetPlan}
          onUpgrade={handleUpgradeClick}
          onField={handleField}
          upgradePanelRef={upgradePanelRef}
          t={t}
        />
      )}
      {phase === 'plan' && result !== null && plan !== null && (
        <PlanView
          mode={mode}
          form={form}
          result={result}
          plan={plan}
          sessionTokenRef={sessionTokenRef}
          onEdit={handleEdit}
          t={t}
        />
      )}
    </div>
  );
}

/* ─── FORM ─── */

type Translator = (key: string, values?: Record<string, string | number>) => string;

function FormView({
  mode,
  form,
  error,
  onField,
  onSubmit,
  t,
}: {
  mode: Mode;
  form: FormState;
  error: ValidationError | null;
  onField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  t: Translator;
}) {
  // Accepts any field name string — validate() returns canonical CalcInput
  // field names (e.g. 'height') while the form has split fields (heightFt /
  // heightIn / heightCm), so the lookup is by name not by FormState key.
  function fieldError(field: string): string | null {
    if (error === null) {
      return null;
    }
    if (error.field !== field) {
      return null;
    }
    if (error.reason === 'required') {
      return t('form.errorRequired');
    }
    return t('form.errorRange');
  }

  function handleWeightUnit(next: WeightUnit): void {
    if (next === form.weightUnit) {
      return;
    }
    const converted = convertWeight(form.weight, form.weightUnit, next);
    onField('weight', converted);
    onField('weightUnit', next);
  }

  function handleHeightUnit(next: HeightUnit): void {
    if (next === form.heightUnit) {
      return;
    }
    const converted = convertHeight(
      { heightCm: form.heightCm, heightFt: form.heightFt, heightIn: form.heightIn },
      form.heightUnit,
      next,
    );
    onField('heightCm', converted.heightCm);
    onField('heightFt', converted.heightFt);
    onField('heightIn', converted.heightIn);
    onField('heightUnit', next);
  }

  function handleGoal(goal: Goal): void {
    onField('goal', goal);
  }

  const weightPlaceholder = form.weightUnit === 'kg' ? '70' : '154';

  // Compute live pace rates from the current weight value so the dropdown
  // labels can show real numbers ("Slow — 0.5 lb/week"). When weight is
  // empty/invalid we fall back to bare names. paceRates() is pure and cheap.
  function liveWeightKg(): number | null {
    const v = parseFloat(form.weight);
    if (Number.isNaN(v)) {
      return null;
    }
    if (form.weightUnit === 'kg') {
      return v;
    }
    return lbToKg(v);
  }

  function paceLabel(pace: Pace): string {
    const name = t(`form.pace_${pace}`);
    if (form.goal === 'maintain') {
      return name;
    }
    const wkg = liveWeightKg();
    if (wkg === null || wkg < 30 || wkg > 250) {
      return name;
    }
    const rates = paceRates(wkg, form.goal);
    const rateKg = rates[pace];
    if (form.weightUnit === 'kg') {
      return t('form.paceRateKg', { name, rate: rateKg.toString() });
    }
    // Convert to lb and round to nearest 0.5 lb so labels read naturally
    // (0.25 kg → 0.5 lb, 0.5 kg → 1 lb, 0.75 kg → 1.5 lb, 1 kg → 2 lb).
    const lb = Math.round(kgToLb(rateKg) * 2) / 2;
    return t('form.paceRateLb', { name, rate: lb.toString() });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('form.weightLabel')}</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="1"
            value={form.weight}
            onChange={(e) => onField('weight', e.target.value)}
            placeholder={weightPlaceholder}
            className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
          />
          <UnitToggle
            value={form.weightUnit}
            options={[{ value: 'kg', label: t('form.unitKg') }, { value: 'lb', label: t('form.unitLb') }]}
            onChange={(v) => handleWeightUnit(v as WeightUnit)}
          />
        </div>
        {fieldError('weight') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('weight')}</p>}
      </div>

      {/* Height — single cm input or split ft+in pair depending on unit. */}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('form.heightLabel')}</label>
        <div className="mt-1 flex gap-2">
          {form.heightUnit === 'cm' && (
            <input
              type="number"
              inputMode="decimal"
              step="1"
              min="1"
              value={form.heightCm}
              onChange={(e) => onField('heightCm', e.target.value)}
              placeholder="170"
              className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
            />
          )}
          {form.heightUnit === 'in' && (
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  value={form.heightFt}
                  onChange={(e) => onField('heightFt', e.target.value)}
                  placeholder="5"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-9 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{t('form.unitFt')}</span>
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  max="11"
                  value={form.heightIn}
                  onChange={(e) => onField('heightIn', e.target.value)}
                  placeholder="9"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-9 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{t('form.unitIn')}</span>
              </div>
            </div>
          )}
          <UnitToggle
            value={form.heightUnit}
            options={[{ value: 'cm', label: t('form.unitCm') }, { value: 'in', label: t('form.unitFt') }]}
            onChange={(v) => handleHeightUnit(v as HeightUnit)}
          />
        </div>
        {fieldError('height') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('height')}</p>}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('form.ageLabel')}</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            min="14"
            max="100"
            value={form.age}
            onChange={(e) => onField('age', e.target.value)}
            placeholder={t('form.agePlaceholder')}
            className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
          />
          <div className="flex h-11 items-center px-2 text-sm text-slate-500">{t('form.ageUnit')}</div>
        </div>
        {fieldError('age') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('age')}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('form.genderLabel')}</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <SegmentButton selected={form.gender === 'male'} onClick={() => onField('gender', 'male')} label={t('form.genderMale')} />
          <SegmentButton selected={form.gender === 'female'} onClick={() => onField('gender', 'female')} label={t('form.genderFemale')} />
        </div>
        {fieldError('gender') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('gender')}</p>}
      </div>

      {/* Activity — hidden on BMR (BMR is activity-independent). */}
      {mode !== 'bmr' && (
        <div>
          <label className="block text-sm font-medium text-slate-700">{t('form.activityLabel')}</label>
          <select
            value={form.activity}
            onChange={(e) => onField('activity', e.target.value as Activity | '')}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
          >
            <option value="" disabled>—</option>
            <option value="sedentary">{t('form.activitySedentary')}</option>
            <option value="light">{t('form.activityLight')}</option>
            <option value="moderate">{t('form.activityModerate')}</option>
            <option value="very">{t('form.activityVery')}</option>
            <option value="extra">{t('form.activityExtra')}</option>
          </select>
          {fieldError('activity') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('activity')}</p>}
        </div>
      )}

      {/* Goal + Pace — only relevant on the deficit page; BMR/TDEE just
         report numbers without a goal-directed adjustment. */}
      {mode === 'deficit' && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('form.goalLabel')}</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <SegmentButton selected={form.goal === 'lose'} onClick={() => handleGoal('lose')} label={t('form.goalLose')} />
              <SegmentButton selected={form.goal === 'maintain'} onClick={() => handleGoal('maintain')} label={t('form.goalMaintain')} />
              <SegmentButton selected={form.goal === 'gain'} onClick={() => handleGoal('gain')} label={t('form.goalGain')} />
            </div>
          </div>

          {/* Pace — only relevant when there is a deficit/surplus to size. */}
          {form.goal !== 'maintain' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('form.paceLabel')}</label>
              <select
                value={form.pace}
                onChange={(e) => onField('pace', e.target.value as Pace)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
              >
                {PACE_KEYS.map((p) => (
                  <option key={p} value={p}>
                    {paceLabel(p)}
                  </option>
                ))}
              </select>
              {fieldError('pace') !== null && <p className="mt-1 text-xs text-red-600">{fieldError('pace')}</p>}
            </div>
          )}
        </>
      )}

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
      >
        {mode === 'bmr'
          ? t('form.submitBmr')
          : mode === 'tdee'
          ? t('form.submitTdee')
          : t('form.submit')}
      </button>
    </form>
  );
}

function AllergiesInput({
  value,
  onChange,
  t,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  t: Translator;
}) {
  const [draft, setDraft] = useState('');

  function commit(): void {
    const cleaned = draft.trim().slice(0, MAX_ALLERGY_LEN);
    if (cleaned.length === 0) {
      return;
    }
    if (value.includes(cleaned)) {
      setDraft('');
      return;
    }
    if (value.length >= MAX_ALLERGIES) {
      return;
    }
    onChange([...value, cleaned]);
    setDraft('');
  }

  function remove(idx: number): void {
    onChange(value.filter((_, i) => i !== idx));
  }

  const atCap = value.length >= MAX_ALLERGIES;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{t('form.allergiesLabel')}</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {value.map((chip, idx) => (
          <span
            key={`${chip}-${idx}`}
            className="inline-flex items-center gap-1 rounded-full bg-nuvvooGreen-50 px-3 py-1 text-sm text-nuvvooGreen-800"
          >
            {chip}
            <button
              type="button"
              onClick={() => remove(idx)}
              aria-label={t('form.allergiesRemove')}
              className="text-nuvvooGreen-700 hover:text-nuvvooGreen-900"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter or comma commits the chip; we swallow the key so the
            // form doesn't submit on Enter and so the comma never makes it
            // into the chip text.
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commit();
            }
          }}
          maxLength={MAX_ALLERGY_LEN}
          disabled={atCap}
          placeholder={atCap ? t('form.allergiesAtCap') : t('form.allergiesPlaceholder')}
          className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100 disabled:bg-slate-100 disabled:text-slate-400"
        />
        <button
          type="button"
          onClick={commit}
          disabled={atCap || draft.trim().length === 0}
          className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('form.allergiesAdd')}
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-500">{t('form.allergiesHint', { count: value.length, max: MAX_ALLERGIES })}</p>
    </div>
  );
}

type UnitToggleOption = { value: string; label: string };

function UnitToggle({
  value,
  options,
  onChange,
}: {
  value: string;
  options: UnitToggleOption[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex h-11 items-center rounded-xl border border-slate-300 bg-slate-50 p-1">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={
              selected
                ? 'h-9 rounded-lg bg-white px-3 text-sm font-medium text-slate-900 shadow-sm'
                : 'h-9 rounded-lg px-3 text-sm font-medium text-slate-500 hover:text-slate-700'
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SegmentButton({
  selected,
  onClick,
  label,
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

/* ─── RESULT ─── */

function ResultView({
  mode,
  form,
  result,
  error,
  alreadyUsed,
  upgrading,
  planLoading,
  planError,
  onEdit,
  onGetPlan,
  onUpgrade,
  onField,
  upgradePanelRef,
  t,
}: {
  mode: Mode;
  form: FormState;
  result: CalcResult;
  error: ValidationError | null;
  alreadyUsed: boolean;
  upgrading: boolean;
  planLoading: boolean;
  planError: string | null;
  onEdit: () => void;
  onGetPlan: () => void;
  onUpgrade: () => void;
  onField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  upgradePanelRef: React.MutableRefObject<HTMLDivElement | null>;
  t: Translator;
}) {
  // When alreadyUsed=true the CTA section morphs from "Get my first day plan"
  // (disabled, useless) into the App Store conversion stack. Pulled in the
  // same way as PlanView so reporting can distinguish funnel positions via
  // button_location ("deficit_calculator_result_used*").
  const tHero = useTranslations('hero');
  const locale = useLocale();
  const { url: appUrl, handleClick: appHandleClick } = useAppStoreLink(
    `${calcPagePrefix(mode)}_result_used`,
  );

  // Mirror of FormView.fieldError so the upgrade panel can surface validation
  // errors for the fields it owns. Kept local because FormView's helper isn't
  // reachable here; pulling it out into a shared module for a 10-line ternary
  // would add more indirection than it saves.
  function fieldError(field: string): string | null {
    if (error === null) {
      return null;
    }
    if (error.field !== field) {
      return null;
    }
    if (error.reason === 'required') {
      return t('form.errorRequired');
    }
    return t('form.errorRange');
  }

  function fireAppClick(buttonLocation: string): void {
    const trafficSource =
      typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
        ? window.sessionStorage.getItem('nuvvoo_source') || 'direct'
        : 'direct';
    track('app_click', {
      mode,
      button_location: buttonLocation,
      traffic_source: trafficSource,
      locale,
      target_kcal: result.target,
      goal: form.goal,
    });
  }

  function handleResultUsedCtaClick(): void {
    fireAppClick(`${calcPagePrefix(mode)}_result_used`);
    appHandleClick();
  }

  const titleKey =
    form.goal === 'maintain'
      ? 'result.maintainTitle'
      : form.goal === 'gain'
      ? 'result.gainTitle'
      : 'result.loseTitle';

  const showWeekly = form.goal !== 'maintain';
  const weeklyAbs = Math.abs(form.weightUnit === 'kg' ? result.weeklyDeltaKg : result.weeklyDeltaLb);
  const weeklyKey =
    form.goal === 'gain'
      ? form.weightUnit === 'kg' ? 'result.weeklyGainKg' : 'result.weeklyGainLb'
      : form.weightUnit === 'kg' ? 'result.weeklyLossKg' : 'result.weeklyLossLb';

  const errorMessage =
    planError === 'rateLimitedHourly'
      ? t('plan.rateLimitedHourly')
      : planError === 'rateLimitedDaily'
      ? t('plan.rateLimitedDaily')
      : planError === 'generic'
      ? t('plan.errorTitle')
      : null;

  // Reusable macros plate. Used by both deficit and tdee branches; BMR mode
  // doesn't render it (target/macros stay zero until the user upgrades).
  const macrosPlate = (
    <div>
      <p className="text-sm font-medium text-slate-700">{t('result.macrosLabel')}</p>
      <div className="mt-2 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
        <div>
          <p className="text-slate-500">{t('result.macroProtein')}</p>
          <p className="font-semibold text-slate-900">{result.proteinG.toLocaleString()} {t('result.gramsShort')}</p>
        </div>
        <div>
          <p className="text-slate-500">{t('result.macroCarbs')}</p>
          <p className="font-semibold text-slate-900">{result.carbsG.toLocaleString()} {t('result.gramsShort')}</p>
        </div>
        <div>
          <p className="text-slate-500">{t('result.macroFat')}</p>
          <p className="font-semibold text-slate-900">{result.fatG.toLocaleString()} {t('result.gramsShort')}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* BMR mode hides the goal-derived title ("Your maintain calories") since
         its hero is a BMR number, not a goal target — the bmrSubtitle below
         the hero already explains what's shown. Keep the Edit link in its
         right corner via justify-end when the title is hidden. */}
      <div className={`flex items-center ${mode === 'bmr' ? 'justify-end' : 'justify-between'}`}>
        {mode !== 'bmr' && (
          <p className="text-sm font-medium text-slate-500">{t(titleKey)}</p>
        )}
        <button onClick={onEdit} className="text-sm text-nuvvooGreen-700 hover:text-nuvvooGreen-900 underline-offset-2 hover:underline">
          {t('result.edit')}
        </button>
      </div>

      {/* Hero + supporting numbers vary by mode. BMR shows only the BMR
         value; TDEE shows TDEE as the hero with BMR as a supporting line +
         macros; deficit keeps the original full readout. */}
      {mode === 'bmr' && (
        <div>
          <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            {result.bmr.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-slate-500">{t('result.kcalUnit')}</p>
          <p className="mt-3 text-sm text-slate-700">{t('result.bmrSubtitle')}</p>
          <p className="mt-2 text-xs text-slate-500">{t('result.bmrExplain')}</p>
        </div>
      )}

      {mode === 'tdee' && (
        <>
          <div>
            <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              {result.tdee.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-500">{t('result.kcalUnit')}</p>
            <p className="mt-3 text-sm text-slate-700">{t('result.tdeeSubtitle')}</p>
          </div>

          <p className="text-xs text-slate-500">
            {t('result.tdeeRestingLine', { bmr: result.bmr.toLocaleString() })}
          </p>

          {macrosPlate}
        </>
      )}

      {mode === 'deficit' && (
        <>
          <div>
            <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              {result.target.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-500">{t('result.kcalUnit')}</p>
          </div>

          {showWeekly && (
            <p className="text-base font-medium text-nuvvooGreen-700">
              {t(weeklyKey, { amount: weeklyAbs.toFixed(1) })}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div>
              <p className="text-slate-500">{t('result.bmrLabel')}</p>
              <p className="font-semibold text-slate-900">{result.bmr.toLocaleString()} {t('result.kcalShortUnit')}</p>
            </div>
            <div>
              <p className="text-slate-500">{t('result.tdeeLabel')}</p>
              <p className="font-semibold text-slate-900">{result.tdee.toLocaleString()} {t('result.kcalShortUnit')}</p>
            </div>
          </div>

          {/* Macro split. Mirrors the backend formula so what we show here is
             exactly what the AI plan will hit when generated. */}
          {macrosPlate}

          {result.clamped && <p className="text-xs text-amber-700">{t('result.clampedNote')}</p>}
        </>
      )}

      {/* Deficit-only inline diet+allergies block. BMR/TDEE move these into
         the upgrade panel; here they're plan-only inputs that don't affect
         the kcal/macros math, only the AI meal plan. Hidden once alreadyUsed
         flips on — they'd be inert clutter when there's no plan left to
         generate. */}
      {mode === 'deficit' && !alreadyUsed && (
        <div className="space-y-4 border-t border-slate-200 pt-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('form.dietLabel')}</label>
            {/* 2×2 always — 4-in-a-row inside the half-width hero column
               clips longer labels (Pescatarian / Pescetarisch / Вегетарианство). */}
            <div className="mt-1 grid grid-cols-2 gap-2">
              {DIET_OPTIONS.map((d) => (
                <SegmentButton
                  key={d}
                  selected={form.diet === d}
                  onClick={() => onField('diet', d)}
                  label={t(`form.diet_${d}`)}
                />
              ))}
            </div>
          </div>

          <AllergiesInput
            value={form.allergies}
            onChange={(next) => onField('allergies', next)}
            t={t}
          />
        </div>
      )}

      {/* Deficit CTA block stays exactly as before — alreadyUsed splits
         between App Store conversion stack and "Get my first day plan". */}
      {mode === 'deficit' && (alreadyUsed ? (
        <div className="border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-600">{t('result.ctaUsedNote')}</p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResultUsedCtaClick}
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)]"
            >
              {t('conversion.cta')}
            </a>
            <AppStoreBadge
              buttonLocation={`${calcPagePrefix(mode)}_result_used_badge`}
              size="sm"
              onClick={() => fireAppClick(`${calcPagePrefix(mode)}_result_used_badge`)}
            />
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span>💚 {tHero('trustFree')}</span>
              <span>🔒 {tHero('trustPrivacy')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-600">{t('result.ctaText')}</p>
          <button
            onClick={onGetPlan}
            disabled={planLoading}
            className="group mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{planLoading ? t('plan.loading') : t('result.ctaButton')}</span>
            {!planLoading && (
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            )}
          </button>
          {errorMessage !== null && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
        </div>
      ))}

      {/* BMR/TDEE upgrade ask. When alreadyUsed we skip the upgrade flow
         entirely — the user already burned their free plan — and show the
         App Store conversion stack instead, mirroring the deficit branch. */}
      {mode !== 'deficit' && alreadyUsed && (
        <div className="border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-600">{t('result.ctaUsedNote')}</p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResultUsedCtaClick}
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)]"
            >
              {t('conversion.cta')}
            </a>
            <AppStoreBadge
              buttonLocation={`${calcPagePrefix(mode)}_result_used_badge`}
              size="sm"
              onClick={() => fireAppClick(`${calcPagePrefix(mode)}_result_used_badge`)}
            />
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span>💚 {tHero('trustFree')}</span>
              <span>🔒 {tHero('trustPrivacy')}</span>
            </div>
          </div>
        </div>
      )}

      {/* BMR/TDEE upgrade CTA card — closed state. Clicking it expands the
         upgrade panel below (gathered fields → /generate). */}
      {mode !== 'deficit' && !alreadyUsed && !upgrading && (
        <div className="border-t border-slate-200 pt-5">
          <p className="text-sm font-medium text-slate-900">{t('upgrade.title')}</p>
          <p className="mt-1 text-sm text-slate-600">{t('upgrade.subtitle')}</p>
          <button
            type="button"
            onClick={onUpgrade}
            aria-expanded={upgrading}
            aria-controls="calc-upgrade-panel"
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
          >
            {t('upgrade.cta')}
          </button>
        </div>
      )}

      {/* BMR/TDEE upgrade panel — expanded state. Collects the fields we
         hid on the form step (BMR adds activity; both modes need goal/pace/
         diet/allergies) and routes through the same handleGetPlan as the
         deficit flow. */}
      {mode !== 'deficit' && !alreadyUsed && upgrading && (
        <div
          ref={upgradePanelRef}
          id="calc-upgrade-panel"
          role="region"
          aria-label={t('upgrade.title')}
          className="space-y-4 border-t border-slate-200 pt-5"
        >
          {mode === 'bmr' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('form.activityLabel')}</label>
              <select
                value={form.activity}
                onChange={(e) => onField('activity', e.target.value as Activity | '')}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
              >
                <option value="" disabled>—</option>
                <option value="sedentary">{t('form.activitySedentary')}</option>
                <option value="light">{t('form.activityLight')}</option>
                <option value="moderate">{t('form.activityModerate')}</option>
                <option value="very">{t('form.activityVery')}</option>
                <option value="extra">{t('form.activityExtra')}</option>
              </select>
              {fieldError('activity') !== null && (
                <p className="mt-1 text-xs text-red-600">{fieldError('activity')}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">{t('form.goalLabel')}</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <SegmentButton selected={form.goal === 'lose'} onClick={() => onField('goal', 'lose')} label={t('form.goalLose')} />
              <SegmentButton selected={form.goal === 'maintain'} onClick={() => onField('goal', 'maintain')} label={t('form.goalMaintain')} />
              <SegmentButton selected={form.goal === 'gain'} onClick={() => onField('goal', 'gain')} label={t('form.goalGain')} />
            </div>
          </div>

          {form.goal !== 'maintain' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('form.paceLabel')}</label>
              <select
                value={form.pace}
                onChange={(e) => onField('pace', e.target.value as Pace)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
              >
                {PACE_KEYS.map((p) => (
                  <option key={p} value={p}>
                    {t(`form.pace_${p}`)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">{t('form.dietLabel')}</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {DIET_OPTIONS.map((d) => (
                <SegmentButton
                  key={d}
                  selected={form.diet === d}
                  onClick={() => onField('diet', d)}
                  label={t(`form.diet_${d}`)}
                />
              ))}
            </div>
          </div>

          <AllergiesInput
            value={form.allergies}
            onChange={(next) => onField('allergies', next)}
            t={t}
          />

          {errorMessage !== null && <p className="text-xs text-red-600">{errorMessage}</p>}

          <button
            onClick={onGetPlan}
            disabled={planLoading}
            className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{planLoading ? t('plan.loading') : t('upgrade.cta')}</span>
            {!planLoading && (
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── PLAN ─── */

function PlanView({
  mode,
  form,
  result,
  plan,
  sessionTokenRef,
  onEdit,
  t,
}: {
  mode: Mode;
  form: FormState;
  result: CalcResult;
  plan: ApiPlan;
  // Token is needed to submit a rating. Refs keep the latest value without
  // forcing PlanView to re-render when the token rotates after a 401.
  sessionTokenRef: { current: string | null };
  onEdit: () => void;
  t: Translator;
}) {
  // Trust line on the home page hero is sourced from the top-level `hero`
  // namespace, so we read directly from the locale messages rather than
  // duplicating the keys under deficitCalculator.
  const tHero = useTranslations('hero');
  const locale = useLocale();
  const { url, handleClick } = useAppStoreLink(`${calcPagePrefix(mode)}_plan`);

  // Fires the calculator-funnel-specific `app_click` event with the same
  // shape used everywhere on this page: button_location distinguishes CTA
  // vs badge, traffic_source/locale come straight from the SourceTracker
  // session capture. The site-wide `click_platform` event still fires from
  // useAppStoreLink.handleClick — having both lets reporting filter by
  // either the calc-only funnel or the global app-store install intent.
  function fireAppClick(buttonLocation: string, extras: Record<string, unknown> = {}): void {
    const trafficSource =
      typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
        ? window.sessionStorage.getItem('nuvvoo_source') || 'direct'
        : 'direct';
    track('app_click', {
      mode,
      button_location: buttonLocation,
      traffic_source: trafficSource,
      locale,
      ...extras,
    });
  }

  function slotLabel(slot: ApiSlot): string {
    if (slot === 'breakfast') {
      return t('plan.slotBreakfast');
    }
    if (slot === 'lunch') {
      return t('plan.slotLunch');
    }
    if (slot === 'dinner') {
      return t('plan.slotDinner');
    }
    return t('plan.slotSnack');
  }

  function trackAppClick(): void {
    fireAppClick(`${calcPagePrefix(mode)}_plan`, {
      target_kcal: result.target,
      goal: form.goal,
    });
    handleClick();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{t('plan.heading')}</p>
          <p className="text-2xl font-bold text-slate-900">
            {result.target.toLocaleString()} <span className="text-sm font-medium text-slate-500">{t('result.kcalUnit')}</span>
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
                <p className="text-xs font-medium uppercase tracking-wide text-nuvvooGreen-700">
                  {slotLabel(meal.slot)}
                </p>
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
            {/* Thin separator before macros so "what to eat" and "macros"
               read as distinct layers without inflating macro visual weight. */}
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

      {/* Rating sits ABOVE the App Store CTA — acts as a micro-commitment
         ("I rated this 5★ so I clearly like it") that strengthens intent
         to click through. Putting it below the CTA would be a step back
         in the funnel — distracting users right when they're ready to
         convert. Hidden entirely when the backend didn't return a
         plan_id (cached pre-feature plans + rare DB-write failures). */}
      {typeof plan.plan_id === 'number' && (
        <RatingControl
          planId={plan.plan_id}
          sessionTokenRef={sessionTokenRef}
          language={(['en', 'de', 'ru', 'es', 'fr'] as const).includes(locale as ApiLanguage) ? (locale as ApiLanguage) : 'en'}
          diet={form.diet}
        />
      )}

      <div className="flex flex-col items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackAppClick}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)]"
        >
          {t('conversion.cta')}
        </a>
        <AppStoreBadge
          buttonLocation={`${calcPagePrefix(mode)}_plan_badge`}
          size="sm"
          onClick={() => fireAppClick(`${calcPagePrefix(mode)}_plan_badge`)}
        />
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>💚 {tHero('trustFree')}</span>
          <span>🔒 {tHero('trustPrivacy')}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── RATING ─── */

type RatingPhase = 'idle' | 'submitting' | 'thanked' | 'hidden';

function RatingControl({
  planId,
  sessionTokenRef,
  language,
  diet,
}: {
  planId: number;
  sessionTokenRef: { current: string | null };
  language: ApiLanguage;
  diet: ApiDiet;
}) {
  const t = useTranslations('planRating');
  const [phase, setPhase] = useState<RatingPhase>('idle');
  const [rating, setRating] = useState<number>(0); // 0 = not picked
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  // Don't re-fire submit if the user double-clicks Send.
  const submittingRef = useRef(false);

  if (phase === 'hidden') {
    return null;
  }

  if (phase === 'thanked') {
    return (
      <div className="mt-6 rounded-2xl border border-nuvvooGreen-200 bg-nuvvooGreen-50/40 p-4 text-center text-sm text-slate-700">
        {t('thanks')}
      </div>
    );
  }

  async function handleSubmit(): Promise<void> {
    if (submittingRef.current || rating < 1) {
      return;
    }
    const token = sessionTokenRef.current;
    if (token === null) {
      // No session token — we can't submit a rating. Per spec on 401 we'd
      // hide silently, so do the equivalent here: hide before the call.
      setPhase('hidden');
      return;
    }
    submittingRef.current = true;
    setPhase('submitting');

    const trimmedComment = comment.trim();
    const result = await ratePlan({
      plan_id: planId,
      rating,
      comment: trimmedComment.length > 0 ? trimmedComment : undefined,
      session_token: token,
    });

    submittingRef.current = false;

    if (!result.ok) {
      // Per spec: hide silently on any 4xx — don't surface technical
      // details. Same on network errors (unlikely to recover on retry
      // without UI clutter).
      setPhase('hidden');
      return;
    }

    track('plan_rated', {
      rating,
      has_comment: trimmedComment.length > 0,
      language,
      diet,
    });
    setPhase('thanked');
  }

  // Placeholder swaps based on whether the user picked a low (1-3) or
  // high (4-5) rating. While hovering, mirror the hover star value so the
  // placeholder previews the intent before commit.
  const effectiveRating = hover > 0 ? hover : rating;
  const placeholder =
    effectiveRating >= 1 && effectiveRating <= 3
      ? t('placeholderLow')
      : t('placeholderHigh');

  const isSubmitting = phase === 'submitting';
  const canSubmit = rating >= 1 && !isSubmitting;

  return (
    <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
      <p className="text-sm font-medium text-slate-700">{t('prompt')}</p>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (hover > 0 ? hover : rating) >= n;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => setRating(n)}
              disabled={isSubmitting}
              className={
                filled
                  ? 'text-2xl text-amber-400 transition-transform hover:scale-110 focus:outline-none'
                  : 'text-2xl text-slate-300 transition-transform hover:scale-110 focus:outline-none'
              }
            >
              ★
            </button>
          );
        })}
      </div>
      {rating >= 1 && (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder={placeholder}
          rows={2}
          maxLength={500}
          disabled={isSubmitting}
          autoFocus
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100 disabled:bg-slate-100"
        />
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#52A574] px-4 text-sm font-semibold text-white transition hover:bg-[#459860] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('send')}
        </button>
      </div>
    </div>
  );
}
