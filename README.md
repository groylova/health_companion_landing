# Nuvvoo Landing (Next.js)

This is a clean, SEO-friendly landing page scaffold using Next.js App Router + Tailwind.

## Quick start

```bash
npm install
npm run dev
```

## Waitlist form (Python backend)

Set these env vars:

- `WAITLIST_API_URL` — your Python endpoint that accepts `POST { email, source }`
- `WAITLIST_API_KEY` — optional bearer token
- `NEXT_PUBLIC_SITE_URL` — for correct sitemap/OG metadata

Example `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WAITLIST_API_URL=https://your-backend.example.com/waitlist
WAITLIST_API_KEY=changeme
```

## Editing content

- Main page: `app/page.tsx`
- Legal pages: `app/legal/*`
- Images: `public/illustrations`, `public/screens`, `public/images`

