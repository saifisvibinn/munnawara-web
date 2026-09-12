import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { TextLink } from "@/components/ui/TextLink"
import { getTranslations, setRequestLocale } from "next-intl/server"

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
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("corporate")} subtitle={tCorporate("intro")} />
      <ul className="mx-auto mt-16 max-w-2xl px-6">
        {services.map((service) => (
          <li
            key={service}
            className="border-b border-ink/8 py-6 text-2xl font-medium tracking-tight text-ink"
          >
            {service}
          </li>
        ))}
      </ul>
      <div className="mt-12 text-center">
        <TextLink href="/contact">{tCommon("requestQuote")}</TextLink>
      </div>
    </AnimatedSection>
  )
}

export default CorporatePage
