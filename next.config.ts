import path from "node:path";
import type { NextConfig } from "next";

// Next unconditionally bundles `polyfill-module` into the client entry; it is
// not gated on browserslist. See src/lib/modernPolyfills.js for why replacing
// it is safe. If a future Next release moves this file the alias key simply
// stops matching and the stock polyfill comes back — it cannot break the build.
const nextPolyfillModule = path.join(
  process.cwd(),
  "node_modules/next/dist/build/polyfills/polyfill-module.js",
);

// Applied to every route. `frame-ancestors` is the clickjacking control (XFO is
// kept alongside it for older agents that ignore CSP). No default-src/script-src
// here: a meaningful script-src needs per-request nonces from middleware, which
// is currently scoped to `/` and `/kontak` only, and a nonce-less policy would
// have to allow 'unsafe-inline' anyway.
const csp = ["frame-ancestors 'none'", "base-uri 'self'", "object-src 'none'"].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // No external/CDN image domains are in use yet — the site currently
    // ships zero raster images (only the SVG logo, served as a static
    // asset). If product screenshots or a CDN-hosted media library are
    // added later, register the CDN hostname here, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "cdn.cargogrid.net" }],
    remotePatterns: [],
  },
  experimental: {
    // `motion/react` and `lucide-react` are barrel files; without this every
    // importer pulls the whole barrel into its chunk.
    optimizePackageImports: ["motion/react", "lucide-react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  webpack(config) {
    config.resolve.alias[nextPolyfillModule] = path.join(process.cwd(), "src/lib/modernPolyfills.js");
    return config;
  },
};

export default nextConfig;
