import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Keep security-upgrade reminders on for future `next dev` / `next build`.
    agentUpgrade: "security",
    // Keep recently visited routes in the client cache so back/forward and
    // repeat navigations render without another round trip.
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    // Ship only the motion modules each component imports.
    optimizePackageImports: ["motion"],
  },
  // Keep the conventional root favicon URL working while the asset lives with
  // the rest of the brand files.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/brand/favicon.ico" }];
  },
  // Settings is a set of tab pages; the bare path lands on the account tab.
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/settings/account",
        permanent: false,
      },
    ];
  },
  // Model vendor logos come from the catalog, which syncs them from Runware.
  images: {
    remotePatterns: [new URL("https://assets.runware.ai/**")],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  agentRules: false,
  // The floating dev badge overlaps content in the bottom-left rail.
  devIndicators: false,
  partialPrefetching: true,
  // The dev server blocks cross-origin requests for its own JS/CSS by default,
  // which makes a phone on the LAN paint the page but never hydrate (no taps,
  // no animation). Next rejects a bare "*", so allow every host shape instead.
  // Development only — production is unaffected.
  allowedDevOrigins: ["*.*", "*.*.*", "*.*.*.*", "*.local"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
