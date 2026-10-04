import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PhotoStrip } from "@/components/gallery/PhotoStrip"
import { PageIntro } from "@/components/ui/PageIntro"
import type { AppLocale } from "@/content/types"
import { TextLink } from "@/components/ui/TextLink"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

const CorporatePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tCommon = await getTranslations("common")
  const tCorporate = await getTranslations("corporate")

  const services = [
    tCorporate("staff"),
    tCorporate("school"),
    tCorporate("contracts"),
  ]

  return (
    <AnimatedSection className="pt-20">
      <PageIntro title={t("corporate")} subtitle={tCorporate("intro")} align="start" />
      <ul className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
        {services.map((service) => (
          <li
            key={service}
            className="border-b border-ink/8 py-6 text-2xl font-medium tracking-tight text-ink"
          >
            {service}
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
        <PhotoStrip
          locale={locale as AppLocale}
          ids={["workshop-0123", "workshop-0342", "interior-0269"]}
        />
      </div>
      <div className="mt-12 text-center">
        <TextLink href="/quote">{tCommon("requestQuote")}</TextLink>
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "corporate")

export default CorporatePage
