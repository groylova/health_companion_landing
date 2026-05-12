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

// Map site locale → App Store country segment. Sends each visitor to their
// localized storefront with native description, reviews and pricing — the
// main driver of click-to-install conversion on non-US traffic.
const COUNTRY_BY_LOCALE: Record<string, string> = {
  en: 'us',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
};

function buildUrl(country: string, source: string) {
  return `https://apps.apple.com/${country}/app/apple-store/id${APP_ID}?pt=${APPLE_PROVIDER_TOKEN}&ct=${encodeURIComponent(source)}&mt=8`;
}

export function useAppStoreLink(buttonLocation: string) {
  const locale = useLocale();
  const country = COUNTRY_BY_LOCALE[locale] || 'us';

  const [url, setUrl] = useState(buildUrl(country, DEFAULT_SOURCE));

  useEffect(() => {
    // Rebuild the URL whenever the captured traffic source changes. The
    // initial read happens right after mount. SourceTracker lives in a
    // parent layout, so its useEffect runs after ours — without the event
    // listener below, our first read sees an empty sessionStorage and the
    // URL bakes in ct=direct even for visits that arrived with UTM params.
    const rebuild = () => {
      const source = sessionStorage.getItem(STORAGE_KEY) || DEFAULT_SOURCE;
      setUrl(buildUrl(country, source));
    };
    rebuild();
    window.addEventListener('nuvvoo-source-updated', rebuild);
    return () => window.removeEventListener('nuvvoo-source-updated', rebuild);
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

  return { url, handleClick, locale };
}
