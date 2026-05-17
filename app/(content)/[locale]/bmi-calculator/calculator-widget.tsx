'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  computeBmiResult,
  mapToCalcInput,
  validateBmiForm,
  type BmiFormState,
  type BmiResult,
  type BmiValidationError,
} from '@/lib/bmi/bmi';
import {
  calculate,
  type Activity,
  type CalcResult,
  type Gender,
  type HeightUnit,
  type WeightUnit,
} from '@/lib/deficit/calc';
import {
  fetchSession,
  generatePlan,
  type ApiLanguage,
  type ApiPlan,
  type ApiSlot,
} from '@/lib/deficit/meal-plan-api';
import { useAppStoreLink } from '@/lib/use-app-store-link';
import { AppStoreBadge } from '@/components/app-store-badge';

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

// Explicit category → i18n-key maps. We use these instead of building keys
// via string concatenation + `as 'result.categoryNormal'` casts so that
// renaming a key or adding a category becomes a compile-time error rather
// than a silent runtime miss.
const CATEGORY_LABEL_KEY: Record<
  BmiResult['category'],
  | 'result.categoryUnderweight'
  | 'result.categoryNormal'
  | 'result.categoryOverweight'
  | 'result.categoryObese'
> = {
  underweight: 'result.categoryUnderweight',
  normal: 'result.categoryNormal',
  overweight: 'result.categoryOverweight',
  obese: 'result.categoryObese',
};

const EXPLANATION_KEY: Record<
  BmiResult['category'],
  | 'result.explanationUnderweight'
  | 'result.explanationNormal'
  | 'result.explanationOverweight'
  | 'result.explanationObese'
> = {
  underweight: 'result.explanationUnderweight',
  normal: 'result.explanationNormal',
  overweight: 'result.explanationOverweight',
  obese: 'result.explanationObese',
};

const PILL_CLASS: Record<BmiResult['category'], string> = {
  underweight: 'bg-blue-100 text-blue-800',
  normal: 'bg-nuvvooGreen-50 text-nuvvooGreen-800',
  overweight: 'bg-amber-100 text-amber-800',
  obese: 'bg-red-100 text-red-800',
};

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
  const [plan, setPlan] = useState<ApiPlan | null>(null);
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planCount, setPlanCount] = useState(0);
  const alreadyUsed = PLAN_LIMIT_ENABLED && planCount >= PLAN_LIMIT_PER_BROWSER;

  // Session token is fetched once on mount; refs keep the latest value
  // without forcing a re-render when we rotate it after a 401.
  const sessionTokenRef = useRef<string | null>(null);
  const viewedRef = useRef(false);

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

  function handleField<K extends keyof BmiFormState>(key: K, value: BmiFormState[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear validation error when its underlying form field changes.
    // Map split height/weight inputs back to the validation field name.
    if (error !== null) {
      const cleared = fieldForKey(key);
      if (cleared === error.field) {
        setError(null);
      }
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
        <BmiResultView
          bmi={bmi}
          form={form}
          activity={activity}
          onActivity={(a) => setActivity(a)}
          onGetPlan={handleGetPlan}
          onEdit={() => setPhase('form')}
          planLoading={planLoading}
          planError={planError}
          alreadyUsed={alreadyUsed}
          t={t}
        />
      )}
      {phase === 'plan' && bmi !== null && plan !== null && calcResult !== null && (
        <PlanView bmi={bmi} plan={plan} calcResult={calcResult} onEdit={() => setPhase('form')} t={t} />
      )}
    </div>
  );
}

// Map a FormState key back to its validation field name so we can clear
// the right error when the user starts typing the fix.
function fieldForKey(key: keyof BmiFormState): BmiValidationError['field'] | null {
  if (key === 'gender') return 'gender';
  if (key === 'age') return 'age';
  if (key === 'heightCm' || key === 'heightFt' || key === 'heightIn' || key === 'heightUnit') return 'height';
  if (key === 'weight' || key === 'weightUnit') return 'weight';
  return null;
}

// Weight/Height unit-conversion helpers copied from deficit calc widget.
// Empty stays empty.
function convertWeight(value: string, from: WeightUnit, to: WeightUnit): string {
  if (from === to) return value;
  const v = parseFloat(value);
  if (Number.isNaN(v)) return value;
  if (from === 'kg' && to === 'lb') {
    return (Math.round(v * 2.20462 * 10) / 10).toString();
  }
  return (Math.round((v / 2.20462) * 10) / 10).toString();
}

function convertHeight(
  current: { heightCm: string; heightFt: string; heightIn: string },
  from: HeightUnit,
  to: HeightUnit,
): { heightCm: string; heightFt: string; heightIn: string } {
  if (from === to) return current;
  if (from === 'cm' && to === 'in') {
    const cm = parseFloat(current.heightCm);
    if (Number.isNaN(cm)) return current;
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - ft * 12);
    return { heightCm: current.heightCm, heightFt: ft.toString(), heightIn: inches.toString() };
  }
  // in → cm
  const ftStr = current.heightFt.trim();
  if (ftStr.length === 0) return current;
  const ft = parseFloat(ftStr);
  if (Number.isNaN(ft)) return current;
  const inStr = current.heightIn.trim();
  const inches = inStr.length === 0 ? 0 : parseFloat(inStr);
  if (Number.isNaN(inches)) return current;
  const cm = Math.round((ft * 12 + inches) * 2.54);
  return { heightCm: cm.toString(), heightFt: current.heightFt, heightIn: current.heightIn };
}

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
  // When alreadyUsed flips on the CTA section morphs into the App-Store
  // conversion stack — same pattern as the deficit calc's ResultView.
  const tHero = useTranslations('hero');
  const locale = useLocale();
  const { url: appUrl, handleClick: appHandleClick } = useAppStoreLink(
    'bmi_calculator_result_used',
  );

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

  function handleResultUsedCtaClick(): void {
    fireAppClick('bmi_calculator_result_used');
    appHandleClick();
  }

  const markerPct = Math.min(100, Math.max(0, ((bmi.bmi - 15) / (40 - 15)) * 100));

  const categoryLabel = t(CATEGORY_LABEL_KEY[bmi.category]);

  // Range string uses kg always (the form is canonicalized; we don't render
  // lb here for v1).
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

  // ICU explanation params vary by category. Build the right object once,
  // then pass to t() through the EXPLANATION_KEY lookup.
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

  // Form is unused in v1 — we keep the prop so Task 9 can derive lb display
  // strings from form.weightUnit without restructuring the call site.
  void form;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{t('result.bmiLabel')}</p>
        <button
          onClick={onEdit}
          className="text-sm text-nuvvooGreen-700 underline-offset-2 hover:text-nuvvooGreen-900 hover:underline"
        >
          {t('result.edit')}
        </button>
      </div>

      <div>
        <p className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">{bmi.bmi}</p>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${PILL_CLASS[bmi.category]}`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Gradient scale with marker */}
      <div className="relative">
        <div
          className="h-2.5 rounded-md"
          style={{ background: 'linear-gradient(90deg,#60a5fa 0%,#34d399 25%,#fbbf24 60%,#f87171 100%)' }}
        />
        <div
          className="absolute -top-1.5 h-3.5 w-3.5 rounded-full bg-slate-900 shadow ring-[3px] ring-white"
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

      <p className="text-sm leading-relaxed text-slate-600">
        {t(EXPLANATION_KEY[bmi.category], explanationParams)}
      </p>

      {/* Activity + CTA — task 9 wires the plan call. */}
      {!alreadyUsed && (
        <div className="space-y-4 border-t border-slate-200 pt-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('form.activityLabel')}</label>
            <select
              value={activity}
              onChange={(e) => onActivity(e.target.value as Activity)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none focus:border-nuvvooGreen-400 focus:ring-2 focus:ring-nuvvooGreen-100"
            >
              <option value="" disabled>
                —
              </option>
              <option value="sedentary">{t('form.activitySedentary')}</option>
              <option value="light">{t('form.activityLight')}</option>
              <option value="moderate">{t('form.activityModerate')}</option>
              <option value="very">{t('form.activityVery')}</option>
              <option value="extra">{t('form.activityExtra')}</option>
            </select>
          </div>
          <button
            onClick={onGetPlan}
            disabled={planLoading || activity === ''}
            className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{planLoading ? t('plan.loading') : t('result.ctaButton')}</span>
            {!planLoading && (
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            )}
          </button>
          {planError !== null && <p className="mt-2 text-xs text-red-600">{planError}</p>}
        </div>
      )}

      {alreadyUsed && (
        // Both free plans already spent — replace the generation CTA with
        // the App Store conversion stack so the result page doesn't dead-end.
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
              buttonLocation="bmi_calculator_result_used_badge"
              size="sm"
              onClick={() => fireAppClick('bmi_calculator_result_used_badge')}
            />
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span>💚 {tHero('trustFree')}</span>
              <span>🔒 {tHero('trustPrivacy')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    if (error === null || error.field !== field) return null;
    return error.reason === 'required' ? t('form.errorRequired') : t('form.errorRange');
  }

  function handleWeightUnit(next: WeightUnit): void {
    if (next === form.weightUnit) return;
    onField('weight', convertWeight(form.weight, form.weightUnit, next));
    onField('weightUnit', next);
  }

  function handleHeightUnit(next: HeightUnit): void {
    if (next === form.heightUnit) return;
    const c = convertHeight(
      { heightCm: form.heightCm, heightFt: form.heightFt, heightIn: form.heightIn },
      form.heightUnit,
      next,
    );
    onField('heightCm', c.heightCm);
    onField('heightFt', c.heightFt);
    onField('heightIn', c.heightIn);
    onField('heightUnit', next);
  }

  const weightPlaceholder = form.weightUnit === 'kg' ? '70' : '154';

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

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860]"
      >
        {t('form.submit')}
      </button>
    </form>
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
