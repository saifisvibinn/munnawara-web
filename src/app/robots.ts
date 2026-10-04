import { siteOrigin } from "@/lib/seo"
import type { MetadataRoute } from "next"

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/", disallow: "/chat/" },
  sitemap: `${siteOrigin()}/sitemap.xml`,
})

export default robots
