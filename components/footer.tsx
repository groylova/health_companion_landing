import Link from 'next/link';
import { Container } from '@/components/container';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 py-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="text-sm text-slate-600">
            <div className="font-medium text-slate-900">Nuvvoo</div>
            <div className="mt-1">A calm AI companion for food, habits, and energy.</div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-12">
            {/* Resources Section */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resources
              </div>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/chat-calorie-tracker">
                Chat Calorie Tracker
              </Link>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/ai-food-journal">
                AI Food Journal
              </Link>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/calorie-tracking-without-stress">
                Stress-Free Tracking
              </Link>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/alternative-to-myfitnesspal">
                MyFitnessPal Alternative
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Legal
              </div>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/legal/privacy">
                Privacy
              </Link>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/legal/terms">
                Terms
              </Link>
              <Link className="text-sm text-slate-600 hover:text-slate-900" href="/legal/ai-disclosure">
                AI Disclosure
              </Link>
              <a className="text-sm text-slate-600 hover:text-slate-900" href="mailto:support.nuvvoo@pryvus.com">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 text-center text-sm text-slate-500">
          © 2026 Pryvus Inc.
        </div>
      </Container>
    </footer>
  );
}
