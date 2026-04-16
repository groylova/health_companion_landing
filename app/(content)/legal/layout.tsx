import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from '@/components/analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Nuvvoo',
    default: 'Nuvvoo',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
};

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body>
        <NextIntlClientProvider locale="en" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
