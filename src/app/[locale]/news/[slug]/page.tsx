import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { TextLink } from "@/components/ui/TextLink"
import { getNewsPost } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

const NewsPostPage = async ({ params }: PageProps) => {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = getNewsPost(locale as AppLocale, slug)
  if (!post) notFound()

  const tCommon = await getTranslations("common")

  return (
    <AnimatedSection className="pb-28 pt-20">
      <div className="mx-auto max-w-2xl px-6">
        <TextLink href="/news">{tCommon("readMore")}</TextLink>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-ink-muted">{post.publishedAt}</p>
        <p className="mt-8 text-lg leading-relaxed text-ink-muted">{post.body}</p>
      </div>
    </AnimatedSection>
  )
}

export default NewsPostPage
