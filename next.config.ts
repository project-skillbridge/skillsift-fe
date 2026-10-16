import type { NextConfig } from "next";

/** Path the browser uses to reach the API; rewritten to NEXT_PUBLIC_API_URL below. */
const API_PROXY_PATH = "/backend";
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    // AI-backed endpoints (e.g. skill assessment generation) can take ~2 min.
    proxyTimeout: 180_000,
  },
  /**
   * The API sets its auth cookies as host-only `SameSite=Strict`, so the
   * browser drops them on cross-site calls (e.g. localhost -> the API host).
   * Proxying through the app keeps browser requests same-origin.
   */
  async rewrites() {
    if (!apiUrl) return [];
    return [
      {
        source: `${API_PROXY_PATH}/:path*`,
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.skillsift.online",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
