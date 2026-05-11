'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  PACE_KEYS,
  calculate,
  kgToLb,
  lbToKg,
  paceRates,
  validate,
  type Activity,
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
  type ApiDiet,
  type ApiLanguage,
  type ApiPlan,
  type ApiSlot,
} from '@/lib/deficit/meal-plan-api';
import { useAppStoreLink } from '@/lib/use-app-store-link';

// gtag is declared globally in lib/use-app-store-link.ts as
// `(...args: any[]) => void`; we don't redeclare it here.

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

const DEFAULT_FORM: FormState = {
  weight: '',
  weightUnit: 'lb',
  heightCm: '',
  heightFt: '',
  heightIn: '',
  heightUnit: 'in',
  age: '',
  gender: '',
  activity: '',
  goal: 'lose',
  pace: 'normal',
  diet: 'none',
  allergies: [],
};

const DIET_OPTIONS: ApiDiet[] = ['none', 'vegetarian', 'pescatarian', 'vegan'];
const MAX_ALLERGIES = 8;
const MAX_ALLERGY_LEN = 32;

const STORAGE_KEY_USED = 'nuvvoo_deficit_plan_used';
const STORAGE_KEY_DATA = 'nuvvoo_deficit_plan_data';
// Bumped to 6 when FormState gained diet + allergies — old payloads lack
// those fields and would crash the chip input on rehydrate. The version
// gate at load time drops stale entries instead of trying to migrate them.
const STORAGE_VERSION = 6;

// TEMP: disables the "1 generation per browser" gate so we can iterate on
// the AI prompt + UI without clearing localStorage each click. Flip back to
// true before shipping — the gate is part of the public spec.
const PLAN_LIMIT_ENABLED = false;

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

export function CalculatorWidget() {
  const t = useTranslations('deficitCalculator');
  const locale = useLocale();

  const [phase, setPhase] = useState<Phase>('form');
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [error, setError] = useState<ValidationError | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [plan, setPlan] = useState<ApiPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);

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
    track('calculator_viewed', { page: 'calorie_deficit_calculator', locale });

    void fetchSession().then((session) => {
      if (session !== null) {
        sessionTokenRef.current = session.session_token;
      }
    });

    try {
      if (PLAN_LIMIT_ENABLED) {
        const used = window.localStorage.getItem(STORAGE_KEY_USED);
        if (used === '1') {
          setAlreadyUsed(true);
        }
      }
      const dataRaw = window.localStorage.getItem(STORAGE_KEY_DATA);
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
    const validationError = validate(input);
    if (validationError !== null) {
      setError(validationError);
      return;
    }
    const calcResult = calculate(input as CalcInput);
    setResult(calcResult);
    setError(null);
    setPhase('result');
    track('calculator_completed', {
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
  }

  async function handleGetPlan(): Promise<void> {
    if (result === null) {
      return;
    }
    track('plan_cta_clicked', { target_kcal: result.target, goal: form.goal, locale });

    if (alreadyUsed) {
      // Already used → still show the cached plan if we have it; otherwise
      // surface the limit message inline.
      return;
    }

    setPlanLoading(true);
    setPlanError(null);

    const token = await ensureSessionToken();
    if (token === null) {
      setPlanError('generic');
      setPlanLoading(false);
      return;
    }

    const payload = {
      calories_target: result.target,
      weight_kg: result.weightKg,
      goal: form.goal,
      language: toApiLanguage(locale),
      session_token: token,
      // Send the same macro split we show on the result screen so the AI
      // plan honors it (otherwise it'd compute its own and the displayed
      // targets would drift from what arrives back).
      protein_g: result.proteinG,
      carbs_g: result.carbsG,
      fat_g: result.fatG,
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
      if (response.error.kind === 'rate_limited') {
        setPlanError('rateLimited');
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

    const stored: StoredData = { v: STORAGE_VERSION, form, result, plan: apiPlan };
    try {
      if (PLAN_LIMIT_ENABLED) {
        window.localStorage.setItem(STORAGE_KEY_USED, '1');
      }
      window.localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(stored));
    } catch {
      // Storage full / disabled — feature still works for this session.
    }

    track('plan_generated', {
      target_kcal: result.target,
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
          form={form}
          error={error}
          onField={handleField}
          onSubmit={handleSubmit}
          t={t}
        />
      )}
      {phase === 'result' && result !== null && (
        <ResultView
          form={form}
          result={result}
          alreadyUsed={alreadyUsed}
          planLoading={planLoading}
          planError={planError}
          onEdit={handleEdit}
          onGetPlan={handleGetPlan}
          onField={handleField}
          t={t}
        />
      )}
      {phase === 'plan' && result !== null && plan !== null && (
        <PlanView form={form} result={result} plan={plan} onEdit={handleEdit} t={t} />
      )}
    </div>
  );
}

/* ─── FORM ─── */

type Translator = ReturnType<typeof useTranslations<'deficitCalculator'>>;

function FormView({
  form,
  error,
  onField,
  onSubmit,
  t,
}: {
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
            options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]}
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
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">ft</span>
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
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">in</span>
              </div>
            </div>
          )}
          <UnitToggle
            value={form.heightUnit}
            options={[{ value: 'cm', label: 'cm' }, { value: 'in', label: 'ft' }]}
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

      {/* Activity */}
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

      {/* Goal */}
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

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
      >
        {t('form.submit')}
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
  form,
  result,
  alreadyUsed,
  planLoading,
  planError,
  onEdit,
  onGetPlan,
  onField,
  t,
}: {
  form: FormState;
  result: CalcResult;
  alreadyUsed: boolean;
  planLoading: boolean;
  planError: string | null;
  onEdit: () => void;
  onGetPlan: () => void;
  onField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  t: Translator;
}) {
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
    planError === 'rateLimited' ? t('plan.rateLimited') : planError === 'generic' ? t('plan.errorTitle') : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{t(titleKey)}</p>
        <button onClick={onEdit} className="text-sm text-nuvvooGreen-700 hover:text-nuvvooGreen-900 underline-offset-2 hover:underline">
          {t('result.edit')}
        </button>
      </div>

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
          <p className="font-semibold text-slate-900">{result.bmr.toLocaleString()} kcal</p>
        </div>
        <div>
          <p className="text-slate-500">{t('result.tdeeLabel')}</p>
          <p className="font-semibold text-slate-900">{result.tdee.toLocaleString()} kcal</p>
        </div>
      </div>

      {/* Macro split. Mirrors the backend formula so what we show here is
         exactly what the AI plan will hit when generated. */}
      <div>
        <p className="text-sm font-medium text-slate-700">{t('result.macrosLabel')}</p>
        <div className="mt-2 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div>
            <p className="text-slate-500">{t('result.macroProtein')}</p>
            <p className="font-semibold text-slate-900">{result.proteinG.toLocaleString()} g</p>
          </div>
          <div>
            <p className="text-slate-500">{t('result.macroCarbs')}</p>
            <p className="font-semibold text-slate-900">{result.carbsG.toLocaleString()} g</p>
          </div>
          <div>
            <p className="text-slate-500">{t('result.macroFat')}</p>
            <p className="font-semibold text-slate-900">{result.fatG.toLocaleString()} g</p>
          </div>
        </div>
      </div>

      {result.clamped && <p className="text-xs text-amber-700">{t('result.clampedNote')}</p>}

      {/* Plan-only inputs: don't affect the kcal/macros math, only the AI
         meal plan. Kept on the result screen so the form stays focused on
         the calculation itself. */}
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

      <div className="border-t border-slate-200 pt-5">
        <p className="text-sm text-slate-600">{t('result.ctaText')}</p>
        <button
          onClick={onGetPlan}
          disabled={planLoading || alreadyUsed}
          className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {planLoading ? t('plan.loading') : t('result.ctaButton')}
        </button>
        {alreadyUsed && <p className="mt-2 text-xs text-slate-500">{t('result.ctaUsedNote')}</p>}
        {errorMessage !== null && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
      </div>
    </div>
  );
}

/* ─── PLAN ─── */

function PlanView({
  form,
  result,
  plan,
  onEdit,
  t,
}: {
  form: FormState;
  result: CalcResult;
  plan: ApiPlan;
  onEdit: () => void;
  t: Translator;
}) {
  const { url, handleClick } = useAppStoreLink('deficit_calculator_plan');

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
    track('app_click', {
      button_location: 'deficit_calculator_plan',
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
          <li key={meal.slot} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-nuvvooGreen-700">
                {slotLabel(meal.slot)}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">{meal.name}</p>
              {meal.description.length > 0 && (
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{meal.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                {t('plan.macros', { p: meal.protein_g, c: meal.carbs_g, f: meal.fat_g })}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-base font-semibold text-slate-900">{meal.calories.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{t('plan.kcalUnit')}</p>
            </div>
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

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackAppClick}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
      >
        {t('conversion.cta')}
      </a>
    </div>
  );
}
