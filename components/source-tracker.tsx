'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const STORAGE_KEY = 'nuvvoo_source';
const MAX_CT_LENGTH = 35;

function detectSource(): string {
  const params = new URLSearchParams(window.location.search);

  if (
    params.has('gclid') ||
    (params.get('utm_source') === 'google' && params.get('utm_medium') === 'cpc')
  ) {
    return 'google_ads';
  }

  if (params.has('fbclid') || params.get('utm_source') === 'facebook') {
    return 'fb_ads';
  }

  const utmSource = params.get('utm_source');
  if (utmSource) {
    return utmSource.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, MAX_CT_LENGTH);
  }

  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '');

      if (host.includes('google.')) return 'google_organic';
      if (host.includes('bing.')) return 'bing_organic';
      if (host.includes('duckduckgo.')) return 'duckduckgo_organic';
      if (host.includes('yandex.')) return 'yandex_organic';
      if (host === 'nuvvoo.app' || host.endsWith('.nuvvoo.app')) {
        // Internal navigation — keep whatever was already captured.
        return '';
      }

      return host.replace(/\./g, '_').slice(0, MAX_CT_LENGTH);
    } catch {
      // fall through
    }
  }

  return 'direct';
}

export function SourceTracker() {
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const source = detectSource();
    if (!source) return; // internal navigation, nothing to capture yet

    sessionStorage.setItem(STORAGE_KEY, source);

    // Notify any mounted useAppStoreLink hooks so they can rebuild URLs
    // with the freshly captured ct=<source> param. The SourceTracker lives
    // in a layout above the pages that use the hook, so its useEffect fires
    // AFTER the hook's — without this nudge, App Store URLs render with
    // ct=direct on first-touch visits with UTM params.
    window.dispatchEvent(new Event('nuvvoo-source-updated'));

    if (typeof window.gtag === 'function') {
      window.gtag('set', 'user_properties', { traffic_source: source });
    }
  }, []);

  return null;
}
