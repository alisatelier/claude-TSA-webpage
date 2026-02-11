import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimize images for faster loading
    formats: ["image/avif", "image/webp"],
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
