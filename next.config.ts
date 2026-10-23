import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { optimizedImageHosts } from "./src/lib/media"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** Chat/socket origin for connect-src (HTTP + WS). Falls back to the known droplet host. */
const chatOrigin = (() => {
  const raw =
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_SOCKET_URL ||
    process.env.CHAT_API_URL ||
    "https://164-92-131-93.sslip.io"
  try {
    return new URL(raw).origin
  } catch {
    return "https://164-92-131-93.sslip.io"
  }
})()

const chatWsOrigin = chatOrigin.replace(/^http/i, "ws")

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST?.trim()
const mediaImgSrc = mediaHost ? ` https://${mediaHost}` : ""

/**
 * Full CSP for the marketing site. Pages are mostly SSG, so nonces are not
 * practical — use 'unsafe-inline' for theme/boot scripts and Tailwind (Next.js
 * "Without Nonces" guidance). Keep third-party hosts limited to what we embed.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next runtime + inline theme/scroll boots; Twitter/X + Facebook widget scripts.
  // 'unsafe-eval' is required by this repo's `next build --turbopack` client chunks
  // (verified: CSP kEvalViolation in `_next/static/chunks/*.js` without it).
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.twitter.com https://cdn.syndication.twimg.com https://connect.facebook.net`,
  // Tailwind / CSS-in-JS + Google Fonts CSS import in dam-landing.css.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Local + R2 media, OSM tiles, social CDNs, data/blob for UI.
  `img-src 'self' data: blob: https://*.r2.dev${mediaImgSrc} https://tile.openstreetmap.org https://*.twimg.com https://pbs.twimg.com https://abs.twimg.com https://www.facebook.com https://*.facebook.com https://*.fbcdn.net`,
  // Same-origin /chat proxy, live socket, OSRM routing, OSM tiles, social widgets, Vercel live preview.
  `connect-src 'self' ${chatOrigin} ${chatWsOrigin} https://router.project-osrm.org https://tile.openstreetmap.org https://syndication.twitter.com https://cdn.syndication.twimg.com https://*.twitter.com https://*.x.com https://www.facebook.com https://connect.facebook.net https://vercel.live wss://vercel.live`,
  // Contact map + Facebook page plugin (+ Twitter iframe fallbacks).
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.facebook.com https://platform.twitter.com https://syndication.twitter.com https://vercel.live",
  "worker-src 'self' blob:",
  "media-src 'self' blob: https://*.r2.dev" + mediaImgSrc,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
]
  .join("; ")
  .replace(/\s+/g, " ")
  .trim()

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Prefer sharper masters in the gallery lightbox and editorial strips.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [64, 96, 128, 256, 384, 640, 750, 828],
    // SiteImage defaults to 90; 100 for fleet showroom / lightbox masters.
    qualities: [75, 90, 100],
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
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=()" },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
