import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const SUPPORTED = new Set<string>(routing.locales);
const CHOICE_COOKIE = 'nuvvoo_lang_choice';

function detectFromAcceptLanguage(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(',')) {
    const tag = part.trim().split(';')[0].split('-')[0].toLowerCase();
    if (SUPPORTED.has(tag)) return tag;
  }
  return null;
}

export default function middleware(request: NextRequest) {
  // Auto-redirect only on the bare default-locale homepage. We keep
  // localeDetection off in next-intl (otherwise it loops with the English-only
  // article redirects in next.config.mjs), so we run a narrow detection here
  // ourselves: explicit user choice (cookie set by LanguageSwitcher) wins,
  // otherwise fall back to Accept-Language.
  if (request.nextUrl.pathname === '/') {
    const explicit = request.cookies.get(CHOICE_COOKIE)?.value;
    const target =
      explicit && SUPPORTED.has(explicit)
        ? explicit
        : detectFromAcceptLanguage(request.headers.get('accept-language'));

    if (target && target !== routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${target}`;
      return NextResponse.redirect(url);
    }
  }
  return intlMiddleware(request);
}

export const config = {
  // Match the main page, locale-prefixed paths, and SEO content slugs
  // (so /chat-calorie-tracker resolves to default EN, /de/chat-calorie-tracker to DE, etc).
  // Legal pages, API, and static files bypass middleware.
  matcher: [
    '/',
    '/(de|ru|es|fr)/:path*',
    '/(chat-calorie-tracker|ai-food-journal|calorie-tracking-without-stress|alternative-to-myfitnesspal|alternative-to-lose-it|calorie-tracker-eating-disorders|no-dinner-ideas-calories|how-to-stay-consistent-calorie-tracking|photo-vs-chat-calorie-tracking|food-diary-for-weight-loss|calorie-deficit-calculator|bmi-calculator)',
  ],
};
