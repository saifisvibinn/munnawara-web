import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { optimizedImageHosts } from "./src/lib/media"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Prefer sharper masters in the gallery lightbox and editorial strips.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [64, 96, 128, 256, 384, 640],
    qualities: [75, 90],
    // Admin uploads (news covers, testimonial photos) get resized like local images.
    remotePatterns: optimizedImageHosts().map((hostname) => ({ protocol: "https", hostname })),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No other site may frame this one (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=()" },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
