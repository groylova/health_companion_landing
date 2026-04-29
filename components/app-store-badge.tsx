'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const APPLE_PROVIDER_TOKEN = '128691998';
const APP_ID = '6761027583';
const BADGE_SRC = '/badges/app-store.svg';
const STORAGE_KEY = 'nuvvoo_source';
const DEFAULT_SOURCE = 'direct';

function buildUrl(source: string) {
  return `https://apps.apple.com/app/apple-store/id${APP_ID}?pt=${APPLE_PROVIDER_TOKEN}&ct=${encodeURIComponent(source)}&mt=8`;
}

type Props = { buttonLocation: string };

export function AppStoreBadge({ buttonLocation }: Props) {
  const [url, setUrl] = useState(buildUrl(DEFAULT_SOURCE));

  useEffect(() => {
    const source = sessionStorage.getItem(STORAGE_KEY) || DEFAULT_SOURCE;
    setUrl(buildUrl(source));
  }, []);

  const handleClick = () => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    const source = sessionStorage.getItem(STORAGE_KEY) || DEFAULT_SOURCE;
    window.gtag('event', 'click_platform', {
      platform: 'ios',
      button_location: buttonLocation,
      traffic_source: source,
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
        src={BADGE_SRC}
        alt="Download on the App Store"
        width={162}
        height={54}
        className="h-[54px] w-auto"
      />
    </a>
  );
}
