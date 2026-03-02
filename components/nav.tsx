import Link from 'next/link';
import { Container } from '@/components/container';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-nuvvooBg/75 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-nuvvooGreen-100 text-nuvvooGreen-800">
              <span className="text-lg">🫧</span>
            </span>
            <span className="font-semibold tracking-tight">Nuvvoo</span>
          </Link>

          <nav className="flex items-center gap-6">
            <a href="#founder" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Founder
            </a>
            <a href="#how" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#product" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Product
            </a>
            <a href="#waitlist" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Early access
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
