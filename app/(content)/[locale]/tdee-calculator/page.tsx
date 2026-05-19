import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ContentSection } from '@/components/seo/content-section';
import { FaqSection } from '@/components/seo/faq-section';
import { RelatedGuides } from '@/components/seo/related-guides';
import { AppStoreBadge } from '@/components/app-store-badge';
import { routing } from '@/i18n/routing';
import { CalorieCalculator } from '@/components/calculator/calorie-calculator';

const SLUG = 'tdee-calculator';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tdeeCalculator.metadata' });

  const canonical = locale === 'en' ? `${siteUrl}/${SLUG}` : `${siteUrl}/${locale}/${SLUG}`;
  const alternates: Record<string, string> = { 'x-default': `${siteUrl}/${SLUG}` };
  for (const loc of routing.locales) {
    alternates[loc] = loc === 'en' ? `${siteUrl}/${SLUG}` : `${siteUrl}/${loc}/${SLUG}`;
  }

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: alternates,
    },
    // Calculator is fully localized to all 5 routing.locales via next-intl
    // (form labels, SEO body, FAQ, related guides). Override the content
    // layout's default noindex-for-non-default-locale so Google indexes
    // every language version.
    robots: { index: true, follow: true },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonical,
      type: 'article',
      images: [{ url: '/images/og.png', width: 1200, height: 630, alt: t('ogTitle') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/images/og.png'],
    },
  };
}

export default async function TdeeCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('tdeeCalculator');

  // faq.a5 contains a <deficit> rich-text marker that cross-links to the
  // deficit calculator — render via t.rich so next-intl substitutes the
  // tag for a real <Link>. JSON-LD inside FaqSection only consumes string
  // answers, so this answer is omitted from structured data; not ideal but
  // acceptable for a single cross-link.
  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    {
      question: t('faq.q5'),
      answer: (
        <p>
          {t.rich('faq.a5', {
            deficit: (chunks) => (
              <Link href="/calorie-deficit-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                {chunks}
              </Link>
            ),
          })}
        </p>
      ),
    },
  ];

  return (
    <main>
      <Nav />

      {/* ─── HERO with calculator on the right ─── */}
      <section className="pt-12 md:pt-16">
        <Container>
          {/* min-w-0 on both grid cells overrides the default min-width:auto
             on grid items, otherwise long content inside the widget (long
             <select> options, wide flex rows) prevents the column from
             shrinking and the widget overflows past the viewport at the
             md/lg in-between viewport widths. */}
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
            <div className="min-w-0 md:pt-6">
              <h1
                style={{ fontFamily: "'Thicccboi', sans-serif" }}
                className="text-4xl font-extrabold tracking-tight text-[#1F2A24] md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]"
              >
                {t('h1')}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                {t('intro')}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span>💚 {t('trustFree')}</span>
                <span>✦ {t('trustNoAccount')}</span>
                <span>🔒 {t('trustPrivate')}</span>
              </div>
            </div>

            {/* On mobile, pull the widget past Container's px-5 with a
               negative margin so the white card uses nearly the full
               viewport width. md+ reverts to standard grid placement. */}
            <div className="-mx-2 w-auto min-w-0 md:mx-0 md:w-full">
              <CalorieCalculator mode="tdee" messagesNamespace="tdeeCalculator" />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SEO BODY ─── */}
      <article className="pt-16 md:pt-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12">
            <ContentSection title={t('seo.h2_what')}>
              <p>{t('seo.what_p1')}</p>
              <p>{t('seo.what_p2')}</p>
              <p>{t('seo.what_p3')}</p>
            </ContentSection>

            <ContentSection title={t('seo.h2_how')}>
              <p>{t('seo.how_p1')}</p>
              <p>{t('seo.how_p2')}</p>
              {/* Rich-text via t.rich — the <bmr> / <deficit> markers in the
                 translation string get replaced with <Link> components for
                 contextual SEO cross-links to the sibling calculators. */}
              <p>
                {t.rich('seo.how_p3', {
                  bmr: (chunks) => (
                    <Link href="/bmr-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                      {chunks}
                    </Link>
                  ),
                  deficit: (chunks) => (
                    <Link href="/calorie-deficit-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </ContentSection>

            <ContentSection title={t('seo.h2_plan')}>
              <p>{t('seo.plan_p1')}</p>
              <p>{t('seo.plan_p2')}</p>
              <p>{t('seo.plan_p3')}</p>
            </ContentSection>

            {/* ─── CONVERSION BLOCK ─── */}
            <div className="my-12 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-soft">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {t('conversion.title')}
                </h3>
                <p className="mt-3 text-slate-600">{t('conversion.subtitle')}</p>
                <div className="mt-6">
                  <AppStoreBadge buttonLocation="tdee_calculator_conversion" />
                </div>
              </div>
            </div>

            <FaqSection faqs={faqs} />

            <RelatedGuides slugs={['bmrCalculator', 'calculator', 'foodDiary', 'mfpAlternative']} />
          </div>
        </Container>
      </article>

      <Footer />
    </main>
  );
}
