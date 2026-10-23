/** Admin uploads can be a video (mp4/webm) in place of an image. */
export const isVideo = (url: string) => /\.(mp4|webm)(\?|#|$)/i.test(url)

/** Site-wide Next/Image quality (must be listed in next.config `images.qualities`). */
export const IMAGE_QUALITY = 90

/**
 * Hosts whose images go through the Next image optimizer (resized, WebP/AVIF).
 * Admin uploads live in Cloudflare R2: its r2.dev URLs, plus a custom domain if one
 * is set in NEXT_PUBLIC_MEDIA_HOST. `next.config.ts` builds remotePatterns from this.
 */
export const optimizedImageHosts = () =>
  ["**.r2.dev", process.env.NEXT_PUBLIC_MEDIA_HOST?.trim()].filter((h): h is string => Boolean(h))

const hostMatches = (host: string, pattern: string) =>
  pattern.startsWith("**.") ? host.endsWith(pattern.slice(2)) : host === pattern

/** True for remote images the optimizer may not fetch: those are served as-is. */
export const skipOptimizer = (src: string) => {
  if (!/^https?:/.test(src)) return false
  try {
    const { protocol, hostname } = new URL(src)
    return protocol !== "https:" || !optimizedImageHosts().some((p) => hostMatches(hostname, p))
  } catch {
    return true
  }
}
