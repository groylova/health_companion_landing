import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nuvvooBg: '#FAFAF7',
        nuvvooInk: '#0F172A',
        nuvvooMuted: '#64748B',
        nuvvooGreen: {
          50: '#F1FAF4',
          100: '#E3F6EA',
          200: '#C6EED5',
          300: '#9DE1B8',
          400: '#6FD095',
          500: '#43BC73',
          600: '#2F9A5A',
          700: '#277B49',
          800: '#215F3C',
          900: '#1C4E32'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config;
