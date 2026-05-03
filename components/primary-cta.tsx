'use client';

import { useAppStoreLink } from '@/lib/use-app-store-link';

type Props = { buttonLocation: string; label: string };

export function PrimaryCta({ buttonLocation, label }: Props) {
  const { url, handleClick } = useAppStoreLink(buttonLocation);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group inline-flex h-14 w-[280px] items-center justify-center gap-2 rounded-2xl bg-[#52A574] px-6 text-base font-semibold text-white shadow-[0_8px_20px_rgba(82,165,116,0.35)] transition hover:bg-[#459860] hover:shadow-[0_10px_24px_rgba(82,165,116,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuvvooGreen-300"
    >
      <span>{label}</span>
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
    </a>
  );
}
