import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { getFleet } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Image from "next/image"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

const GalleryPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const fleet = getFleet(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("gallery")} align="start" />
      <div className="mx-auto mt-16 grid max-w-6xl gap-4 px-6 sm:grid-cols-2">
        {fleet.map((item) => (
          <figure key={item.id} className="m-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-elevated">
              <Image
                src={item.coverImage}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-start">
              <span className="font-medium text-ink">{item.name}</span>
              <span className="text-sm text-ink-muted">{item.yearLabel}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "gallery")

export default GalleryPage
