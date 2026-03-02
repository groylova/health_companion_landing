import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nuvvoo — Track by chatting, not logging',
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
    title: 'Nuvvoo — Track food by talking, not logging',
    description:
      'A gentle AI companion that helps you stay on track with food, habits, and energy — without pressure or spreadsheets.',
    images: ['/images/og.png'],
  },
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
