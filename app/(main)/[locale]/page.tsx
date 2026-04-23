import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { SectionHeading } from '@/components/section-heading';
import { AppStoreBadge } from '@/components/app-store-badge';
import { routing } from '@/i18n/routing';

type Props = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

  const canonical = locale === 'en' ? `${siteUrl}/` : `${siteUrl}/${locale}`;
  const alternates: Record<string, string> = { 'x-default': `${siteUrl}/` };
  for (const loc of routing.locales) {
    alternates[loc] = loc === 'en' ? `${siteUrl}/` : `${siteUrl}/${loc}`;
  }

  return {
    title: {
      default: t('title'),
      template: '%s · Nuvvoo',
    },
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
      url: canonical,
      images: [
        {
          url: '/images/og.png',
          width: 1200,
          height: 630,
          alt: t('ogTitle'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/images/og.png'],
    },
    alternates: {
      canonical,
      languages: alternates,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <main>
      <Nav />

      {/* ─── HERO ─── */}
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                {t('hero.title')}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                {t('hero.subtitle')}
              </p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                {t('hero.subtitleLine2')}
              </p>

              <div className="mt-8 flex flex-col items-start gap-4">
                <AppStoreBadge buttonLocation="hero" />
                <div className="flex flex-col gap-1.5 text-sm text-slate-500">
                  <span>💚 {t('hero.trustFree')}</span>
                  <span>⭐ {t('hero.trustTeam')}</span>
                </div>
              </div>
            </div>

            {/* Paired phone screens — light chat in front, dark plan behind */}
            <div className="relative mx-auto w-full max-w-[480px]">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-nuvvooGreen-100 via-white to-nuvvooGreen-50 blur-2xl" />

              {/* Clip the back phone to parent bounds so it never pushes layout.
                  On mobile extend overlay into Container's right padding so the phone
                  can bleed to the viewport edge. */}
              <div className="pointer-events-none absolute inset-y-0 left-0 -right-5 overflow-hidden md:right-0">
                <Image
                  src="/screens/hero-plan-dark.png"
                  alt={t('hero.heroImagePlanAlt')}
                  width={1206}
                  height={2622}
                  priority
                  fetchPriority="low"
                  className="absolute -right-[18%] top-[14%] w-[48%] rotate-6 rounded-[2rem] border-[3px] border-slate-800 md:right-[8%] md:top-[6%] md:w-[54%]"
                />
              </div>

              <Image
                src="/screens/hero-chat-light.png"
                alt={t('hero.heroImageChatAlt')}
                width={1206}
                height={2622}
                priority
                fetchPriority="high"
                className="relative left-0 top-[4%] w-[60%] rounded-[2rem] border-[3px] border-slate-800 shadow-[0_35px_60px_-15px_rgba(15,23,42,0.4)] md:left-[6%]"
              />
            </div>
          </div>
        </Container>
      </section>


      {/* ─── FOUNDER STORY (rollout) ─── */}
      <section id="founder" className="pt-20 pb-10 md:pt-28 md:pb-14">
        <Container>
          <div className="mx-auto max-w-[680px]">
            <details className="group">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <SectionHeading
                  eyebrow={t('founder.eyebrow')}
                  title={t('founder.title')}
                />
                <p className="mt-4 text-base leading-[1.75] text-slate-600 md:text-lg">
                  {t.rich('founder.intro', {
                    strong: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
                  })}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-nuvvooGreen-700 group-open:hidden">
                  {t('founder.readMore')}
                </span>
              </summary>

              <div className="mt-6 space-y-6">
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  {t.rich('founder.p1', {
                    strong: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
                  })}
                </p>
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  {t('founder.p2')}
                </p>
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  {t.rich('founder.p3', {
                    strong: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
                  })}
                </p>
                <p className="text-base leading-[1.75] text-slate-600 md:text-lg">
                  {t.rich('founder.p4', {
                    strong: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
                  })}
                </p>
              </div>
            </details>

            <div className="mt-6 flex items-center gap-3">
              <Image
                src="/images/founder.jpg"
                alt={t('founder.name')}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{t('founder.name')}</p>
                <p className="text-xs text-slate-500">{t('founder.role')}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>


      {/* ─── APP SCREENSHOTS ─── */}
      <section id="product" className="py-12 md:py-16">
        <Container>
          <SectionHeading
            eyebrow={t('product.eyebrow')}
            title={t('product.title')}
            subtitle={t('product.subtitle')}
            center
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Shot src="/screens/screen-journal.png" alt={t('product.journalAlt')} />
            <Shot src="/screens/screen-today-ring.png" alt={t('product.todayAlt')} />
            <Shot src="/screens/screen-stats.png" alt={t('product.statsAlt')} />
          </div>
        </Container>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={t('philosophy.eyebrow')}
              title={t('philosophy.title')}
              center
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 text-left shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('philosophy.othersLabel')}</p>
                <div className="mt-4 space-y-3 text-base text-slate-600">
                  <p>{t('philosophy.othersBeDisciplined')}</p>
                  <p>{t('philosophy.othersLogEverything')}</p>
                  <p>{t('philosophy.othersNeverMiss')}</p>
                  <p>{t('philosophy.othersSearch')}</p>
                  <p>{t('philosophy.othersSetup')}</p>
                  <p>{t('philosophy.othersGrams')}</p>
                  <p>{t('philosophy.othersThreeApps')}</p>
                  <p>{t('philosophy.othersConfigure')}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-nuvvooGreen-200 bg-nuvvooGreen-50/40 p-6 text-left shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-nuvvooGreen-600">{t('philosophy.nuvvooLabel')}</p>
                <div className="mt-4 space-y-3 text-base text-slate-800">
                  <p>{t('philosophy.nuvvooMissDay')}</p>
                  <p>{t('philosophy.nuvvooComeBack')}</p>
                  <p>{t('philosophy.nuvvooNoRestart')}</p>
                  <p>{t('philosophy.nuvvooJustWrite')}</p>
                  <p>{t('philosophy.nuvvooOpen')}</p>
                  <p>{t('philosophy.nuvvooPizza')}</p>
                  <p>{t('philosophy.nuvvooOneChat')}</p>
                  <p>{t('philosophy.nuvvooLearns')}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── HOW IT WORKS (illustrated cards — warm, not clinical) ─── */}
      <div id="how-it-works" />
      <section id="how" className="py-16 md:py-20">
        <Container>
          <div className="text-center">
            <SectionHeading
              eyebrow={t('howItWorks.eyebrow')}
              title={t('howItWorks.title')}
              center
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <FeatureCard
              step="1"
              stepLabel={t('howItWorks.step')}
              title={t('howItWorks.step1Title')}
              desc={t('howItWorks.step1Desc')}
              imageSrc="/illustrations/scene-05-salad.webp"
              imageAlt={t('howItWorks.step1ImageAlt')}
            />
            <FeatureCard
              step="2"
              stepLabel={t('howItWorks.step')}
              title={t('howItWorks.step2Title')}
              desc={t('howItWorks.step2Desc')}
              imageSrc="/illustrations/scene-03-doing-great.webp"
              imageAlt={t('howItWorks.step2ImageAlt')}
            />
            <FeatureCard
              step="3"
              stepLabel={t('howItWorks.step')}
              title={t('howItWorks.step3Title')}
              desc={t('howItWorks.step3Desc')}
              imageSrc="/illustrations/scene-04-dinner-choices.webp"
              imageAlt={t('howItWorks.step3ImageAlt')}
            />
            <FeatureCard
              step="4"
              stepLabel={t('howItWorks.step')}
              title={t('howItWorks.step4Title')}
              desc={t('howItWorks.step4Desc')}
              imageSrc="/illustrations/scene-07-goodnight.webp"
              imageAlt={t('howItWorks.step4ImageAlt')}
              highlight
            />
          </div>
        </Container>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg font-medium text-slate-900">
              {t('socialProof.heading')}
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <QuoteCard name={t('socialProof.name1')} quote={t('socialProof.quote1')} />
              <QuoteCard name={t('socialProof.name2')} quote={t('socialProof.quote2')} />
              <QuoteCard name={t('socialProof.name3')} quote={t('socialProof.quote3')} />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── WAITLIST ─── */}
      <div id="early-access" />
      <section id="waitlist" className="mt-16 md:mt-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-soft md:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-nuvvooGreen-100 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-nuvvooGreen-50 blur-2xl" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  {t('waitlistCta.title')}
                </h2>
                <p className="mt-3 text-slate-600">
                  {t('waitlistCta.subtitle')}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <AppStoreBadge buttonLocation="final_cta" />
                <div className="flex flex-col gap-1.5 text-sm text-slate-500 md:items-end">
                  <span>💚 {t('hero.trustFree')}</span>
                  <span>⭐ {t('hero.trustTeam')}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

/* ─── LOCAL COMPONENTS ─── */

function FeatureCard(props: {
  step: string;
  stepLabel: string;
  title: string;
  desc: string;
  imageSrc: string;
  imageAlt: string;
  highlight?: boolean;
}) {
  return (
    <div className={'group relative overflow-hidden rounded-[1.5rem] p-5 shadow-soft ' + (props.highlight ? 'border-2 border-nuvvooGreen-300 bg-nuvvooGreen-50/30' : 'border border-slate-200 bg-white/70')}>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nuvvooGreen-100 text-nuvvooGreen-800">
          {props.step}
        </span>
        <span>{props.stepLabel}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{props.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{props.desc}</p>
      <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white">
        <Image src={props.imageSrc} alt={props.imageAlt} width={1200} height={900} className="h-auto w-full" />
      </div>
    </div>
  );
}

function QuoteCard({ name, quote }: { name: string; quote: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
      <p className="text-sm italic leading-relaxed text-slate-600">&ldquo;{quote}&rdquo;</p>
      <p className="mt-3 text-xs font-medium text-slate-400">&mdash; {name}</p>
    </div>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1206}
      height={2622}
      className="mx-auto h-auto w-full max-w-[240px] rounded-[2rem] border-[3px] border-slate-800 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)]"
    />
  );
}
