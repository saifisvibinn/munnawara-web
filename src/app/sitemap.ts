import { getNews } from "@/content"
import { routing } from "@/i18n/routing"
import {
  languageAlternates,
  localizedPath,
  seoPaths,
  siteOrigin,
} from "@/lib/seo"
import type { MetadataRoute } from "next"

const sitemap = (): MetadataRoute.Sitemap => {
  const origin = siteOrigin()
  const entry = (path: string): MetadataRoute.Sitemap =>
    routing.locales.map((locale) => ({
      url: `${origin}${localizedPath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([lang, href]) => [
            lang,
            `${origin}${href}`,
          ]),
        ),
      },
    }))

  const newsPaths = routing.locales.flatMap((locale) =>
    getNews(locale).map((post) => `/news/${post.slug}`),
  )

  return [
    ...entry("/"),
    ...Object.values(seoPaths).flatMap(entry),
    ...[...new Set(newsPaths)].flatMap(entry),
  ]
}

export default sitemap
