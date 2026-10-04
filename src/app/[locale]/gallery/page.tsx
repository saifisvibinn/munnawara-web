import { PhotoGallery } from "@/components/gallery/PhotoGallery"
import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { getPhotos } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

const GalleryPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const photos = getPhotos(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("gallery")} align="start" />
      <div className="mx-auto mt-12 max-w-6xl px-6">
        <PhotoGallery photos={photos} />
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "gallery")

export default GalleryPage
