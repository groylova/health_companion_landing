'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

type TrackedButtonProps = {
  href: string;
  variant?: 'primary' | 'ghost' | 'outline';
  className?: string;
  eventName: string;
  eventParams?: Record<string, any>;
  children: React.ReactNode;
};

export function TrackedButton({
  href,
  variant = 'ghost',
  className,
  eventName,
  eventParams = {},
  children,
}: TrackedButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', eventName, eventParams);
      }
      if (window.dataLayer) {
        window.dataLayer.push({ event: eventName, ...eventParams });
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick} className="inline-block">
      <Button variant={variant} className={className}>
        {children}
      </Button>
    </Link>
  );
}
