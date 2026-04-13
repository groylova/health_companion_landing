'use client';

import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/container';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-20 border-t border-slate-200/70 py-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="text-sm text-slate-600">
            <div className="font-medium text-slate-900">Nuvvoo</div>
            <div className="mt-1">{t('tagline')}</div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-12">
            {/* Resources — Column 1 */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('resources')}
              </div>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/calorie-tracker-eating-disorders">
                {t('eatingDisorderSafety')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/no-dinner-ideas-calories">
                {t('dinnerIdeas')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/how-to-stay-consistent-calorie-tracking">
                {t('stayConsistent')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/photo-vs-chat-calorie-tracking">
                {t('photoVsChat')}
              </NextLink>
            </div>

            {/* Resources — Column 2 */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('learnMore')}
              </div>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/calorie-tracking-without-stress">
                {t('stressFree')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/chat-calorie-tracker">
                {t('chatTracker')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/ai-food-journal">
                {t('aiFoodJournal')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/alternative-to-myfitnesspal">
                {t('mfpAlternative')}
              </NextLink>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('legal')}
              </div>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/legal/privacy">
                {t('privacy')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/legal/terms">
                {t('terms')}
              </NextLink>
              <NextLink className="text-sm text-slate-600 hover:text-slate-900" href="/legal/ai-disclosure">
                {t('aiDisclosure')}
              </NextLink>
              <a className="text-sm text-slate-600 hover:text-slate-900" href="mailto:support.nuvvoo@pryvus.com">
                {t('contact')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 text-center text-sm text-slate-500">
          {t('copyright')}
        </div>
      </Container>
    </footer>
  );
}
