// ====================================================
// Next.js Configuration
// Minimal — no image optimization config needed since
// we're using plain <img> tags throughout (see notes on
// the Dashboard page for why), no rewrites/redirects
// needed since the frontend and backend are fully
// separate deployments communicating via NEXT_PUBLIC_API_URL.
// ====================================================

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't fail the Vercel build on lint warnings —
    // only on actual TypeScript type errors. Keeps
    // deploys unblocked by non-critical lint issues
    // during active development.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
