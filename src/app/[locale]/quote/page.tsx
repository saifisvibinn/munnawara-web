import { QuoteWizard } from "@/components/forms/QuoteWizard"
import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const QuotePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("quote")
  const home = getHome(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro
        eyebrow={home.quoteEyebrow}
        title={t("title")}
        subtitle={home.quoteBody}
        align="start"
      />
      <div className="qpage-in mx-auto mt-10 w-full max-w-2xl px-4 sm:mt-14 sm:px-6">
        <QuoteWizard />
      </div>
    </AnimatedSection>
  )
}

export default QuotePage
