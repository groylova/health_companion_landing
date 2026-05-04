'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'nuvvoo_consent_v1';

// Heuristic for whether to *show* the banner. The actual GA gating is done by
// Consent Mode v2 regional defaults set in components/analytics.tsx — Google
// matches region against IP, so even if our timezone heuristic misses, GA still
// stays denied for EU users. Timezone is just a free, no-infra signal to decide
// when to render the UI.
const EU_TIMEZONE_RE = /^Europe\/|^Atlantic\/(Reykjavik|Faroe|Madeira|Canary|Azores)$/;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

function shouldShowBanner() {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return false;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return EU_TIMEZONE_RE.test(tz);
  } catch {
    return false;
  }
}

export function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldShowBanner()) setOpen(true);
  }, []);

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ granted, ts: Date.now() }));
    } catch {
      // Storage unavailable (private mode, quota); proceed without persisting.
    }
    if (typeof window.gtag === 'function') {
      const v = granted ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        ad_storage: v,
        ad_user_data: v,
        ad_personalization: v,
        analytics_storage: v,
      });
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={t('label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-lg backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-sm leading-relaxed text-slate-700">
          {t('body')}{' '}
          <a href="/legal/privacy" className="underline hover:text-slate-900">
            {t('learnMore')}
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('reject')}
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="rounded-full bg-[#52A574] px-4 py-2 text-sm font-medium text-white hover:bg-[#459860]"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
