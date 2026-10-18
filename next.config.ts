import type { NextConfig } from "next";

// Spring Boot backend. Browsers call same-origin /api/*, which Next forwards here, so the
// backend's HttpOnly auth cookies belong to this site and no cross-origin setup is needed.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:2420";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "eha.eco" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
