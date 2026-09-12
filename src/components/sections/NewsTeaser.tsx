import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { TextLink } from "@/components/ui/TextLink"
import { getHome, getNews } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"

export const NewsTeaser = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const posts = getNews(locale).slice(0, 3)
  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")

  return (
    <AnimatedSection className="bg-white py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[80rem] px-4 md:px-10">
        <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 md:flex-row md:items-end">
          <div className="min-w-0">
            <h2 className="text-3xl font-semibold tracking-tight break-words text-ink sm:text-4xl md:text-5xl">
              {home.newsTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/55 sm:mt-3 sm:text-base">
              {home.newsSubtitle}
            </p>
          </div>
          <TextLink href="/news">{t("viewAllNews")}</TextLink>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-sm text-ink/45">{home.newsEmpty}</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-[1.5rem] border border-ink/6 bg-surface-muted/60 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
              >
                <p className="font-label text-xs text-ink/40">{post.publishedAt}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink transition group-hover:text-orange">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">
                  {post.excerpt}
                </p>
                <Link
                  href={`/news/${post.slug}`}
                  className="font-label mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                >
                  {tCommon("readMore")}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}
