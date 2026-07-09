import type { NextConfig } from "next";

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
};

export default nextConfig;
