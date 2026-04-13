'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function WaitlistForm() {
  const t = useTranslations('waitlist');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('error');
        setMessage(data?.error || t('genericError'));
        return;
      }
      setStatus('success');
      setMessage(t('success'));
      setEmail('');

      // Track successful waitlist signup
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'waitlist_signup',
          source: 'landing',
        });
      }

      // Google Ads conversion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-17996002178/02JLCMKExIMcEILnlIVD',
          value: 1.0,
          currency: 'USD',
        });
      }
    } catch {
      setStatus('error');
      setMessage(t('networkError'));
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {status === 'success' ? (
        <div className="text-base text-nuvvooGreen-800 font-medium">
          {message}
        </div>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-nuvvooGreen-300 focus:ring-2 focus:ring-nuvvooGreen-200"
          />
          <Button variant="primary" disabled={status === 'loading'}>
            {status === 'loading' ? t('joining') : t('join')}
          </Button>
          {status === 'error' && message ? (
            <div className="w-full text-sm text-rose-600 sm:w-auto">
              {message}
            </div>
          ) : null}
        </>
      )}
    </form>
  );
}
