import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const chatApiTarget = (
  process.env.CHAT_API_URL ||
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  "https://164-92-131-93.sslip.io"
).replace(/\/$/, "")

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/chat/:path*",
        destination: `${chatApiTarget}/chat/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${chatApiTarget}/socket.io/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
