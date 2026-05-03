import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/container';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MobileMenu } from '@/components/mobile-menu';

export async function Nav() {
  const t = await getTranslations('nav');
  const locale = await getLocale();
  const prefix = locale === 'en' ? '' : `/${locale}`;

  const items = [
    { href: `${prefix}/#product`, label: t('product') },
    { href: `${prefix}/#how`, label: t('howItWorks') },
    { href: `${prefix}/#founder`, label: t('founder') },
    { href: `${prefix}/#waitlist`, label: t('earlyAccess') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-nuvvooBg/75 backdrop-blur">
      <Container>
        <div className="relative flex h-14 items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-6">
            {items.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {it.label}
              </a>
            ))}
            <LanguageSwitcher />
          </nav>

          <MobileMenu items={items} />
        </div>
      </Container>
    </header>
  );
}
