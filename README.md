# Nuvvoo Landing

A clean, minimal landing page for Nuvvoo - an AI companion for food tracking. Built with Next.js 14 (App Router), Tailwind CSS, and Brevo email integration.

## Features

- 🎨 Clean, minimal design with soft colors
- 📱 Fully responsive (mobile-first)
- 📧 Email waitlist with Brevo integration
- 🚀 SEO-optimized (sitemap, robots.txt, metadata)
- ⚡ Fast loading with Next.js 14
- 🎯 Smooth scroll navigation

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Setup

Create a `.env.local` file (or rename `.env.example`):

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Brevo (formerly Sendinblue) API
BREVO_API_KEY=your-brevo-api-key
BREVO_LIST_ID=5
```

### Get Brevo Credentials

1. Sign up at [Brevo](https://www.brevo.com/)
2. Go to **Settings → API Keys** to get your API key
3. Create a list and note its ID (e.g., `5`)

The waitlist form will automatically add contacts to your Brevo list.

## Editing Content

- **Main page:** `app/page.tsx`
- **Navigation:** `components/nav.tsx`
- **Footer:** `components/footer.tsx`
- **Waitlist form:** `components/waitlist-form.tsx`
- **Legal pages:** `app/legal/*`
- **Images:** `public/illustrations`, `public/screens`, `public/images`
- **Styling:** `app/globals.css`, `tailwind.config.ts`

## Project Structure

```
├── app/
│   ├── api/waitlist/route.ts    # Brevo API integration
│   ├── legal/                   # Privacy, Terms, AI Disclosure
│   ├── page.tsx                 # Main landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── nav.tsx                  # Navigation bar
│   ├── footer.tsx               # Footer
│   ├── waitlist-form.tsx        # Email capture form
│   └── ui/button.tsx            # Button component
└── public/
    ├── illustrations/           # Scene illustrations
    └── screens/                 # App screenshots
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `BREVO_API_KEY`
   - `BREVO_LIST_ID`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

Environment variables are automatically secured by Vercel.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Email:** Brevo API
- **Deployment:** Vercel-ready
- **Language:** TypeScript

## License

© 2026 Pryvus Inc.
