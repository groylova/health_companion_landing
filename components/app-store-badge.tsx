'use client';

const APP_STORE_URL =
  'https://apps.apple.com/us/app/nuvvoo-ai-food-journal/id6761027583';

const BADGE_SRC =
  'https://toolbox.marketingtools.apple.com/api/assets/featured-content/apps/badges/badge-2/en-us.svg';

type Props = { buttonLocation: string };

export function AppStoreBadge({ buttonLocation }: Props) {
  const handleClick = () => {
    if (typeof window === 'undefined') return;
    const params = { platform: 'ios', button_location: buttonLocation };
    if (window.gtag) window.gtag('event', 'click_platform', params);
    if (window.dataLayer)
      window.dataLayer.push({ event: 'click_platform', ...params });
  };

  return (
    <a
      href={APP_STORE_URL}
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
