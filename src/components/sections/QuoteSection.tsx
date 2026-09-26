import { QuoteSectionClient } from "@/components/sections/QuoteSectionClient"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"

export const QuoteSection = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const t = await getTranslations("quote")

  return (
    <QuoteSectionClient
      eyebrow={home.quoteEyebrow}
      headline={home.quoteHeadline}
      body={home.quoteBody}
      ariaLabel={t("title")}
    />
  )
}
