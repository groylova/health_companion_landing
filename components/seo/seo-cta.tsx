import { TrackedButton } from '@/components/tracked-button';

type SeoCtaProps = {
  title?: string;
  description?: string;
  buttonText?: string;
};

export function SeoCta({
  title = 'Ready to track without stress?',
  description = 'Get priority access and start tracking by chatting, not logging.',
  buttonText = 'Get priority access',
}: SeoCtaProps) {
  return (
    <div className="my-12 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-soft">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mt-3 text-slate-600">{description}</p>
        <TrackedButton
          variant="primary"
          href="/#waitlist"
          className="mt-6"
          eventName="click_seo_cta"
          eventParams={{ cta_location: 'content_page' }}
        >
          {buttonText}
        </TrackedButton>
      </div>
    </div>
  );
}
