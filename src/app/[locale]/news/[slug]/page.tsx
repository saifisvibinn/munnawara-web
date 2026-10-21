import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { TextLink } from "@/components/ui/TextLink"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { languageAlternates, localizedPath } from "@/lib/seo"
import { formatContentDate, loadNewsPost } from "@/lib/siteContent"
import Image from "next/image"
import { isVideo } from "@/lib/media"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale, slug } = await params
  const post = await loadNewsPost(locale as AppLocale, slug)
  if (!post) return { title: "404", robots: { index: false } }

  const path = `/news/${slug}`
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph:
      post.coverImage && !isVideo(post.coverImage) ? { images: [post.coverImage] } : undefined,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: languageAlternates(path),
    },
  }
}

const NewsPostPage = async ({ params }: PageProps) => {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await loadNewsPost(locale as AppLocale, slug)
  if (!post) notFound()

  const tCommon = await getTranslations("common")

  return (
    <AnimatedSection className="pt-20">
      <div className="mx-auto max-w-2xl px-6">
        <TextLink href="/news" back>{tCommon("backToNews")}</TextLink>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          {formatContentDate(post.publishedAt, locale as AppLocale)}
        </p>
        {post.coverImage && isVideo(post.coverImage) ? (
          <video
            src={post.coverImage}
            controls
            playsInline
            preload="metadata"
            className="mt-8 aspect-[16/9] w-full rounded-2xl bg-surface-muted object-cover"
          />
        ) : post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              unoptimized={/^https?:/.test(post.coverImage)}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        ) : null}
        {/* Staff write plain text in the admin; blank lines separate paragraphs. */}
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-muted">
          {post.body
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default NewsPostPage
