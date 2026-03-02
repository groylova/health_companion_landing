import Link from 'next/link';
import { Container } from '@/components/container';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 py-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            <div className="font-medium text-slate-900">Nuvvoo</div>
            <div className="mt-1">A calm, chat-first food journal.</div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link className="text-slate-600 hover:text-slate-900" href="/legal/privacy">
              Privacy
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/legal/terms">
              Terms
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/legal/ai-disclosure">
              AI disclosure
            </Link>
            <a className="text-slate-600 hover:text-slate-900" href="mailto:support.nuvvoo@pryvus.com">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 text-center text-sm text-slate-500">
          © 2026 Pryvus Inc.
        </div>
      </Container>
    </footer>
  );
}
