import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/container';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-nuvvooBg/75 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
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

          <nav className="flex items-center gap-3 md:gap-6">
            <a href="/#founder" className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Founder
            </a>
            <a href="/#how" className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="/#product" className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Product
            </a>
            <a href="/#waitlist" className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Early access
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
