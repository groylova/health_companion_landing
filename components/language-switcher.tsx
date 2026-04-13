'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('languageSwitcher');

  // Only show on translatable pages (currently just the homepage)
  if (pathname !== '/') return null;

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.replace(pathname, { locale: e.target.value });
  }

  return (
    <select
      value={locale}
      onChange={onChange}
      aria-label={t('label')}
      className="rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs font-medium text-slate-500 outline-none hover:text-slate-900 focus:border-nuvvooGreen-300 focus:ring-1 focus:ring-nuvvooGreen-200"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {t(loc)}
        </option>
      ))}
    </select>
  );
}
