import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function AppleIcon({ size = 18, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M16.2 13.3c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.6 0-1.6-.8-2.7-.8-1.4 0-2.7.8-3.4 2-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.9-1 2.6-2 .8-1.2 1.1-2.4 1.1-2.4s-2.1-.8-2.1-3.5z" />
      <path d="M14.9 6.9c.6-.8 1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.9-.9 3 1 0 2-.6 2.6-1.4z" />
    </svg>
  );
}

// Простой "роботик"/Android-like. Не официальный логотип, зато безопасно и узнаваемо.
export function AndroidIcon({ size = 18, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M8 3l1.5 2M16 3l-1.5 2" />
      <rect x="6" y="6" width="12" height="10" rx="3" />
      <path d="M9 16v3M15 16v3" />
      <path d="M10 10h.01M14 10h.01" />
    </svg>
  );
}
