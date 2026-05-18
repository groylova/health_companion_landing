'use client';

import { useLocale } from 'next-intl';
import { AppStoreBadge } from './app-store-badge';

// Client wrapper used in the SEO-body conversion blocks of the calculator
// pages. The bare AppStoreBadge only fires the global `click_platform`
// event via useAppStoreLink, so a click on the conversion-block badge
// would otherwise be invisible to per-page funnel reports (calculator
// `app_click` / BMI `bmi_app_click`). This wrapper bolts that per-page
// event on without changing the badge component's API surface.
//
// The widget itself (PlanView, alreadyUsed branch) does this via its
// local fireAppClick helper; this wrapper is the same shape, factored
// for Server Components that can't run gtag directly.

type Props = {
  buttonLocation: string;
  // GA4 event name to fire alongside the badge's built-in click_platform.
  // Use 'app_click' on the deficit page and 'bmi_app_click' on the BMI page.
  eventName: 'app_click' | 'bmi_app_click';
  // Optional extras merged into the event payload. Lets a caller send
  // e.g. { bmi_category } so reports can break the click down by segment.
  extras?: Record<string, unknown>;
};

export function ConversionAppStoreBadge({ buttonLocation, eventName, extras }: Props) {
  const locale = useLocale();

  function handleClick(): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }
    const trafficSource =
      typeof window.sessionStorage !== 'undefined'
        ? window.sessionStorage.getItem('nuvvoo_source') || 'direct'
        : 'direct';
    window.gtag('event', eventName, {
      button_location: buttonLocation,
      traffic_source: trafficSource,
      locale,
      ...(extras || {}),
    });
  }

  return <AppStoreBadge buttonLocation={buttonLocation} onClick={handleClick} />;
}
