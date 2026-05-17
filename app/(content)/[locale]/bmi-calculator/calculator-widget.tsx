'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  computeBmiResult,
  validateBmiForm,
  type BmiFormState,
  type BmiResult,
  type BmiValidationError,
} from '@/lib/bmi/bmi';
import type {
  Activity,
  Gender,
  HeightUnit,
  WeightUnit,
} from '@/lib/deficit/calc';

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
  // Placeholders for Tasks 8 + 9 — declared here so the result/plan views
  // wired up next don't need to reshape the top-level state surface. The
  // `void` reference at the end keeps the linter quiet without disabling
  // a rule that isn't even enabled in this repo's ESLint config.
  const [activity, setActivity] = useState<Activity | ''>('');
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planCount, setPlanCount] = useState(0);
  const alreadyUsed = planCount >= 2;
  void activity;
  void setActivity;
  void planLoading;
  void setPlanLoading;
  void planError;
  void setPlanError;
  void setPlanCount;
  void alreadyUsed;

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current) {
      return;
    }
    viewedRef.current = true;
    track('bmi_calculator_viewed', { page: 'bmi_calculator', locale });
  }, [locale]);

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
        <div className="space-y-3">
          {/* TODO(task 8): full BmiResultView */}
          <p className="text-sm text-slate-500">{t('result.bmiLabel')}</p>
          <p className="text-5xl font-extrabold">{bmi.bmi}</p>
          <p className="text-sm">{t(`result.category${capitalize(bmi.category)}` as 'result.categoryNormal')}</p>
          <button onClick={() => setPhase('form')} className="text-sm text-nuvvooGreen-700 underline">{t('result.edit')}</button>
        </div>
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
