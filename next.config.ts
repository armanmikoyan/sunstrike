import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The e2e server builds into its own folder so a running `next dev` cannot
  // rewrite the chunks underneath it mid-test.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
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
