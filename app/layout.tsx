import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nuvvoo — Your AI Health Companion',
    template: '%s · Nuvvoo',
  },
  description:
    'A gentle AI companion that helps you stay on track with food, habits, and energy — without pressure or spreadsheets.',
  openGraph: {
    title: 'Nuvvoo — Track by chatting, not logging',
    description:
      'A gentle AI companion that helps you stay on track with food, habits, and energy — without pressure or spreadsheets.',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 630,
        alt: 'Nuvvoo — Track by chatting, not logging',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuvvoo — Track food by chatting, not logging',
    description:
      'A gentle AI companion that helps you stay on track with food, habits, and energy — without pressure. You need only one button.',
    images: ['/images/og.png'],
  },
  icons: {
    icon: '/illustrations/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KMGPK4KM');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KMGPK4KM"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
