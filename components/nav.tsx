'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/container';
import { LanguageSwitcher } from '@/components/language-switcher';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const prefix = locale === 'en' ? '' : `/${locale}`;

  const trackNavClick = (section: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'click_nav_link',
        nav_section: section,
      });
    }
  };
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-nuvvooBg/75 backdrop-blur">
      <Container>
        <div className="flex flex-col gap-2 py-2 md:h-14 md:flex-row md:items-center md:justify-between md:gap-0 md:py-0">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-xl">
                <Image
                  src="/illustrations/logo.png"
                  alt="Nuvvoo logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-semibold tracking-tight">Nuvvoo</span>
            </Link>
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
          </div>

          <nav className="flex items-center justify-between gap-3 md:justify-end md:gap-6">
            <a
              href={`${prefix}/#founder`}
              onClick={() => trackNavClick('founder')}
              className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('founder')}
            </a>
            <a
              href={`${prefix}/#product`}
              onClick={() => trackNavClick('product')}
              className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('product')}
            </a>
            <a
              href={`${prefix}/#how`}
              onClick={() => trackNavClick('how_it_works')}
              className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('howItWorks')}
            </a>
            <a
              href={`${prefix}/#waitlist`}
              onClick={() => trackNavClick('early_access')}
              className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('earlyAccess')}
            </a>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}
