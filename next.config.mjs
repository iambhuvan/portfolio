/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// On GitHub Pages the site is served from /<repo>/ unless a custom domain
// is configured. The CI workflow sets NEXT_PUBLIC_BASE_PATH=/portfolio for
// the default github.io URL. When a CNAME is added, leave it unset.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
