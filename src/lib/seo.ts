import { getSiteConfig } from "@/content"
import { routing } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export type SeoPage =
  | "about"
  | "companies"
  | "fleet"
  | "corporate"
  | "clients"
  | "gallery"
  | "news"
  | "careers"
  | "contact"
  | "quote"

/** Public path (without locale prefix) for each statically routed page. */
export const seoPaths: Record<SeoPage, string> = {
  about: "/about",
  companies: "/companies",
  fleet: "/fleet",
  corporate: "/corporate",
  clients: "/clients",
  gallery: "/gallery",
  news: "/news",
  careers: "/careers",
  contact: "/contact",
  quote: "/quote",
}

/**
 * Canonical origin. `NEXT_PUBLIC_SITE_URL` wins, then the Vercel production
 * domain (so canonicals match the deployed host), then `siteConfig.siteUrl`.
 */
export const siteOrigin = () => {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : "") ||
    getSiteConfig().siteUrl
  return origin.replace(/\/$/, "")
}

/** `/ar` or `/en` plus the page path; "" path is the locale home. */
export const localizedPath = (locale: string, path: string) =>
  `/${locale}${path === "/" ? "" : path}`

/** hreflang map for one page, with `x-default` pointing at the default locale. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedPath(locale, path)]),
  ),
  "x-default": localizedPath(routing.defaultLocale, path),
})

/**
 * Title comes from `nav.*`, description from `seo.*`. The locale is passed
 * explicitly because `setRequestLocale` has not run inside `generateMetadata`.
 */
export const buildPageMetadata = async (
  locale: string,
  page: SeoPage,
): Promise<Metadata> => {
  const [tNav, tSeo] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "seo" }),
  ])
  const path = seoPaths[page]
  const title = tNav(page)
  const description = tSeo(page)

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: { title, description, url: localizedPath(locale, path) },
  }
}
