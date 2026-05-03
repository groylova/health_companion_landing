'use client';

import { useAppStoreLink } from '@/lib/use-app-store-link';

// Map site locale → badge SVG. SVGs are the official Apple Marketing Resources
// kit, "Download on the App Store" black lockup, one per language. Apple
// translates the modifier ("Laden im App Store" / "Descargar en App Store" /
// "Télécharger dans l'App Store" / "Загрузите в App Store") while keeping
// the App Store wordmark in English, per Apple's identity guidelines.
const BADGE_BY_LOCALE: Record<string, string> = {
  en: '/badges/app-store-en.svg',
  de: '/badges/app-store-de.svg',
  es: '/badges/app-store-es.svg',
  fr: '/badges/app-store-fr.svg',
  ru: '/badges/app-store-ru.svg',
};

const FALLBACK_BADGE = '/badges/app-store-en.svg';

type Size = 'md' | 'sm';

const SIZES: Record<Size, { w: number; h: number; cls: string }> = {
  md: { w: 162, h: 54, cls: 'h-[54px] w-auto' },
  sm: { w: 120, h: 40, cls: 'h-[40px] w-auto' },
};

type Props = { buttonLocation: string; size?: Size };

export function AppStoreBadge({ buttonLocation, size = 'md' }: Props) {
  const { url, handleClick, locale } = useAppStoreLink(buttonLocation);
  const badgeSrc = BADGE_BY_LOCALE[locale] || FALLBACK_BADGE;
  const { w, h, cls } = SIZES[size];

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
        width={w}
        height={h}
        className={cls}
      />
    </a>
  );
}
