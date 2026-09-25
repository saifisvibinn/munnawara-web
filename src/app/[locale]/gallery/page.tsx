import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { getFleet } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Image from "next/image"

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
          <div
            key={item.id}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white"
          >
            <Image
              src={item.coverImage}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default GalleryPage
