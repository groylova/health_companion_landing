import { getTranslations } from 'next-intl/server';
import { AppStoreBadge } from '@/components/app-store-badge';
import { PrimaryCta } from '@/components/primary-cta';

type SeoCtaProps = {
  title?: string;
  description?: string;
  buttonLocation?: string;
};

export async function SeoCta({
  title = 'Ready to track without stress?',
  description = 'Nuvvoo is now on the App Store. Start tracking by chatting.',
  buttonLocation = 'seo_cta',
}: SeoCtaProps) {
  const t = await getTranslations('hero');

  return (
    <div className="my-12 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-soft">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mt-3 text-slate-600">{description}</p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <PrimaryCta
            buttonLocation={`${buttonLocation}_primary`}
            label={t('ctaPrimary')}
          />
          <AppStoreBadge
            buttonLocation={`${buttonLocation}_badge`}
            size="sm"
          />
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span>💚 {t('trustFree')}</span>
            <span>🔒 {t('trustPrivacy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
