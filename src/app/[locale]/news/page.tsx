import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { getNews } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const NewsPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tCommon = await getTranslations("common")
  const posts = getNews(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
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
                <p className="mt-3 text-ink-muted">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AnimatedSection>
  )
}

export default NewsPage
