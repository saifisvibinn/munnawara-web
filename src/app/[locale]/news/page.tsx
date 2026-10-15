import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { SocialFeeds } from "@/components/sections/SocialFeeds"
import { getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata } from "@/lib/seo"
import { formatContentDate, loadNews } from "@/lib/siteContent"

type PageProps = {
  params: Promise<{ locale: string }>
}

const NewsPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tCommon = await getTranslations("common")
  const posts = await loadNews(locale as AppLocale)
  const { social } = getSiteConfig()

  return (
    <AnimatedSection className="pt-20">
      <PageIntro title={t("news")} align="start" />
      <div className="mx-auto mt-16 max-w-2xl px-6 text-center">
        {posts.length === 0 ? (
          <p className="text-lg text-ink-muted">{tCommon("noNews")}</p>
        ) : (
          <ul className="space-y-8 text-start">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-ink/8 pb-8">
                <Link
                  href={`/news/${post.slug}`}
                  className="text-2xl font-semibold tracking-tight text-ink hover:text-ink-muted"
                >
                  {post.title}
                </Link>
                {post.publishedAt ? (
                  <p className="mt-2 text-sm text-ink-muted">
                    {formatContentDate(post.publishedAt, locale as AppLocale)}
                  </p>
                ) : null}
                <p className="mt-3 text-ink-muted">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <SocialFeeds
        title={tCommon("latestFromSocial")}
        twitterUrl={social.twitter}
        facebookUrl={social.facebook}
        twitterLabel={tCommon("socialTwitter")}
        facebookLabel={tCommon("socialFacebook")}
        openLabel={tCommon("openProfile")}
        locale={locale}
      />
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "news")

export default NewsPage
