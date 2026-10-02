import { QuoteBackLink, QuoteHomePrefetch, QuotePageLock } from "@/components/forms/QuotePageChrome"
import { QuoteWizard } from "@/components/forms/QuoteWizard"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

/** Fit-to-screen quote page: map pane + wizard panel (see .qpage in globals.css). */
const QuotePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("quote")
  const home = getHome(locale as AppLocale)

  return (
    <div data-quote-page className="qpage qpage-in">
      <QuotePageLock />
      <QuoteHomePrefetch />
      <QuoteWizard
        layout="split"
        heading={{ eyebrow: home.quoteEyebrow, title: t("title") }}
        toolbar={<QuoteBackLink />}
      />
    </div>
  )
}

export default QuotePage
