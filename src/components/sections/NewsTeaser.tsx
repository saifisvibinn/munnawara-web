import { NewsTeaserClient } from "@/components/sections/NewsTeaserClient"
import { getHome } from "@/content"
import { formatContentDate, loadNews } from "@/lib/siteContent"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"

export const NewsTeaser = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const posts = (await loadNews(locale)).slice(0, 3)
  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")

  return (
    <NewsTeaserClient
      title={home.newsTitle}
      subtitle={home.newsSubtitle}
      emptyMessage={home.newsEmpty}
      viewAllLabel={t("viewAllNews")}
      readMoreLabel={tCommon("readMore")}
      posts={posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        publishedAt: formatContentDate(post.publishedAt, locale),
        coverImage: post.coverImage,
      }))}
    />
  )
}
