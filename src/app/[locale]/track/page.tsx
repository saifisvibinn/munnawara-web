import { TrackRequest } from "@/components/forms/TrackRequest"
import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { buildPageMetadata } from "@/lib/seo"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ id?: string }>
}

const TrackPage = async ({ params, searchParams }: PageProps) => {
  const { locale } = await params
  const { id } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <AnimatedSection className="pt-20 pb-24">
      <PageIntro title={t("nav.track")} subtitle={t("seo.track")} align="start" />
      <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
        <TrackRequest initialLeadId={typeof id === "string" ? id : ""} />
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) => ({
  ...(await buildPageMetadata((await params).locale, "track")),
  robots: { index: false, follow: true },
})

export default TrackPage
