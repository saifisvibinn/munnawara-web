import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { serverChatApiUrl } from "./src/lib/chat/upstream"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const chatApiTarget = serverChatApiUrl()

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Prefer sharper masters in the gallery lightbox and editorial strips.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [64, 96, 128, 256, 384, 640],
    qualities: [75, 90],
  },
  async rewrites() {
    // /chat is handled by src/app/chat/[...path]/route.ts (strips Origin so
    // droplet CORS allowlists do not block same-origin Vercel proxy calls).
    return [
      {
        source: "/socket.io/:path*",
        destination: `${chatApiTarget}/socket.io/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
