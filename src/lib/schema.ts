import { getSiteConfig } from "@/content"
import { siteOrigin } from "@/lib/seo"

/** JSON-LD Organization, built from `siteConfig` so facts live in one place. */
export const buildOrganizationSchema = () => {
  const config = getSiteConfig()
  const profiles = Object.entries(config.social)
    .filter(([key]) => key !== "handle")
    .map(([, url]) => url)

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.brandNameEn,
    alternateName: [config.brandShort, config.brandNameAr],
    url: config.siteUrl,
    logo: `${siteOrigin()}/icon.png`,
    image: `${siteOrigin()}/og.png`,
    email: config.email,
    telephone: config.phones[0],
    sameAs: profiles,
  }
}

/** Serialise for an inline `<script type="application/ld+json">`. */
export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c")
