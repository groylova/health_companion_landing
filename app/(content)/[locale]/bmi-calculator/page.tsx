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
import { CalculatorWidget } from './calculator-widget';

const SLUG = 'bmi-calculator';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bmiCalculator.metadata' });

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

export default async function BmiCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('bmiCalculator');

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
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
              <CalculatorWidget />
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
            </ContentSection>

            <ContentSection title={t('seo.h2_categories')}>
              <table className="w-full border-collapse text-left text-base">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold">{t('seo.categoriesHeaderCategory')}</th>
                    <th className="py-2 font-semibold">{t('seo.categoriesHeaderRange')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-4">{t('result.categoryUnderweight')}</td><td className="py-2">{t('seo.categoryRowUnderweight')}</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-4">{t('result.categoryNormal')}</td><td className="py-2">{t('seo.categoryRowNormal')}</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-4">{t('result.categoryOverweight')}</td><td className="py-2">{t('seo.categoryRowOverweight')}</td></tr>
                  <tr><td className="py-2 pr-4">{t('result.categoryObese')}</td><td className="py-2">{t('seo.categoryRowObese')}</td></tr>
                </tbody>
              </table>
            </ContentSection>

            <ContentSection title={t('seo.h2_formula')}>
              <p>{t('seo.formula_p1')}</p>
            </ContentSection>

            <ContentSection title={t('seo.h2_limitations')}>
              <p>{t('seo.lim_p1')}</p>
              <p>{t('seo.lim_p2')}</p>
            </ContentSection>

            <ContentSection title={t('seo.h2_action')}>
              {/* Rich-text via t.rich — the <deficit> / <food> markers in the
                 translation strings get replaced with <Link> components for
                 contextual SEO cross-links to related guides. */}
              <p>
                {t.rich('seo.action_p1', {
                  deficit: (chunks) => (
                    <Link href="/calorie-deficit-calculator" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                      {chunks}
                    </Link>
                  ),
                  food: (chunks) => (
                    <Link href="/food-diary-for-weight-loss" className="text-nuvvooGreen-700 underline underline-offset-2 hover:text-nuvvooGreen-900">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </ContentSection>

            {/* ─── CONVERSION BLOCK ─── */}
            <div className="my-12 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-soft">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {t('conversion.title')}
                </h3>
                <p className="mt-3 text-slate-600">{t('conversion.subtitle')}</p>
                <div className="mt-6">
                  <AppStoreBadge buttonLocation="bmi_calculator_conversion" />
                </div>
              </div>
            </div>

            <FaqSection faqs={faqs} />

            <RelatedGuides slugs={['calculator', 'foodDiary', 'mfpAlternative', 'chatTracker']} />
          </div>
        </Container>
      </article>

      <Footer />
    </main>
  );
}
