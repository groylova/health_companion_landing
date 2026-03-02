/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Keep default (SSR/SSG) for best SEO + API routes.
};

export default nextConfig;
