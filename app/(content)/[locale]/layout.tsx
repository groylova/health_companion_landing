import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Analytics } from '@/components/analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Non-default locales of SEO articles are English-only content for now.
  // Keep them out of the index until translated, so Google doesn't see duplicates.
  const isDefault = locale === routing.defaultLocale;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: '%s | Nuvvoo',
      default: 'Nuvvoo',
    },
    icons: {
      icon: '/favicon.png',
      apple: '/apple-icon.png',
    },
    robots: isDefault ? undefined : { index: false, follow: true },
  };
}

export default async function ContentLocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Analytics />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
