import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF birinchi (50% kichikroq), so'ng WebP (25% kichikroq)
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 30 kunlik browser cache
    minimumCacheTTL: 86400 * 30,
  },
  // Assetlar uchun uzunroq cache
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
      {
        source: "/gallery/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
