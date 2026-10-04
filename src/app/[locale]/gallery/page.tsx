import { PhotoGallery } from "@/components/gallery/PhotoGallery"
import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { getPhotos } from "@/content"
import type { AppLocale } from "@/content/types"
import { buildPageMetadata } from "@/lib/seo"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Suspense } from "react"

type PageProps = {
  params: Promise<{ locale: string }>
}

const GalleryPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("photoGallery")
  const photos = getPhotos(locale as AppLocale)

  return (
    <AnimatedSection className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h1 className="font-display text-[clamp(1.85rem,7vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-ink">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            {t("pageSubtitle")}
          </p>
        </header>
        <div className="mt-12 md:mt-16">
          <Suspense fallback={null}>
            <PhotoGallery photos={photos} />
          </Suspense>
        </div>
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "gallery")

export default GalleryPage
