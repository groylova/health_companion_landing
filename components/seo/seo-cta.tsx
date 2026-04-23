import { AppStoreBadge } from '@/components/app-store-badge';

type SeoCtaProps = {
  title?: string;
  description?: string;
  buttonLocation?: string;
};

export function SeoCta({
  title = 'Ready to track without stress?',
  description = 'Nuvvoo is now on the App Store. Start tracking by chatting.',
  buttonLocation = 'seo_cta',
}: SeoCtaProps) {
  return (
    <div className="my-12 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-soft">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mt-3 text-slate-600">{description}</p>
        <div className="mt-6">
          <AppStoreBadge buttonLocation={buttonLocation} />
        </div>
      </div>
    </div>
  );
}
