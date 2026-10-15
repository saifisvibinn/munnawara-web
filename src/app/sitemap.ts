import { routing } from "@/i18n/routing"
import {
  languageAlternates,
  localizedPath,
  seoPaths,
  siteOrigin,
} from "@/lib/seo"
import { loadNews } from "@/lib/siteContent"
import type { MetadataRoute } from "next"

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
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

  const newsPaths = (
    await Promise.all(routing.locales.map((locale) => loadNews(locale)))
  ).flatMap((posts) => posts.map((post) => `/news/${post.slug}`))

  return [
    ...entry("/"),
    // The tracking page is personal (noindex), so it stays out of the sitemap.
    ...Object.values(seoPaths)
      .filter((path) => path !== seoPaths.track)
      .flatMap(entry),
    ...[...new Set(newsPaths)].flatMap(entry),
  ]
}

export default sitemap
