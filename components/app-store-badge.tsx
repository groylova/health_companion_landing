'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const APPLE_PROVIDER_TOKEN = '128691998';
const APP_ID = '6761027583';
const STORAGE_KEY = 'nuvvoo_source';
const DEFAULT_SOURCE = 'direct';

// Map site locale → App Store country segment.
// Sends each visitor to their localized store with native description, reviews
// and pricing — the main driver of click-to-install conversion on non-US traffic.
const COUNTRY_BY_LOCALE: Record<string, string> = {
  en: 'us',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
};

// Map site locale → badge SVG. Localized SVGs are added once the Apple Marketing
// Kit is downloaded; until then a locale falls back to the en-us badge (Apple
// doesn't publish localized badge assets at any open CDN).
const BADGE_BY_LOCALE: Record<string, string> = {
  en: '/badges/app-store-en.svg',
};

const FALLBACK_BADGE = '/badges/app-store-en.svg';

function buildUrl(country: string, source: string) {
  return `https://apps.apple.com/${country}/app/apple-store/id${APP_ID}?pt=${APPLE_PROVIDER_TOKEN}&ct=${encodeURIComponent(source)}&mt=8`;
}

type Props = { buttonLocation: string };

export function AppStoreBadge({ buttonLocation }: Props) {
  const locale = useLocale();
  const country = COUNTRY_BY_LOCALE[locale] || 'us';
  const badgeSrc = BADGE_BY_LOCALE[locale] || FALLBACK_BADGE;

  const [url, setUrl] = useState(buildUrl(country, DEFAULT_SOURCE));

  useEffect(() => {
    const source = sessionStorage.getItem(STORAGE_KEY) || DEFAULT_SOURCE;
    setUrl(buildUrl(country, source));
  }, [country]);

  const handleClick = () => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    const source = sessionStorage.getItem(STORAGE_KEY) || DEFAULT_SOURCE;
    window.gtag('event', 'click_platform', {
      platform: 'ios',
      button_location: buttonLocation,
      traffic_source: source,
      locale,
    });
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Download on the App Store"
      className="inline-block transition-opacity hover:opacity-85"
    >
      <img
        src={badgeSrc}
        alt="Download on the App Store"
        width={162}
        height={54}
        className="h-[54px] w-auto"
      />
    </a>
  );
}
