import Link from 'next/link';

type Props = {
  href: string;
  title: string;
  description: string;
};

// Single card in a "Related guides" cross-link grid. Used at the bottom of
// SEO pages to surface tematically adjacent articles for both human readers
// and Google's internal-linking signals.
export function RelatedCard({ href, title, description }: Props) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white/70 p-5 transition hover:border-nuvvooGreen-300 hover:shadow-soft"
    >
      <h3 className="text-base font-semibold tracking-tight text-slate-900">
        {title}{' '}
        <span aria-hidden className="inline-block text-nuvvooGreen-700 transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </Link>
  );
}
