import { CTABandClient } from "@/components/sections/CTABandClient"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"

export const CTABand = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const tCommon = await getTranslations("common")

  return (
    <CTABandClient
      eyebrow={home.ctaBandEyebrow}
      title={home.ctaBandTitle}
      subtitle={home.ctaBandSubtitle}
      ctaLabel={tCommon("requestQuote")}
    />
  )
}
