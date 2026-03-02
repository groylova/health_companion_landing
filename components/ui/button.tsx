import Link from 'next/link';
import React from 'react';

type Variant = 'primary' | 'ghost' | 'outline';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  asChild?: boolean;
  href?: string;
};

export function Button({
  variant = 'outline',
  asChild,
  href,
  className,
  children,
  ...rest
}: Props) {
  const base =
    'inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuvvooGreen-300 disabled:opacity-50 disabled:pointer-events-none';

  const styles: Record<Variant, string> = {
    primary:
      'bg-[#52A574] text-white hover:bg-[#459860] shadow-[0_2px_10px_rgba(82,165,116,0.3)]',
    ghost: 'bg-white/70 text-slate-700 hover:bg-white shadow-sm',
    outline: 'border border-slate-200 bg-white/70 text-slate-700 hover:bg-white shadow-sm',
  };

  const cn = [base, styles[variant], className].filter(Boolean).join(' ');

  if (asChild) {
    if (href) return (
      <Link href={href} className={cn}>
        {children}
      </Link>
    );
    return <span className={cn}>{children}</span>;
  }

  return (
    <button className={cn} {...rest}>
      {children}
    </button>
  );
}
