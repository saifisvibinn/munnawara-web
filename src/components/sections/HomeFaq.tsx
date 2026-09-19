import { HomeFaqClient } from "@/components/sections/HomeFaqClient"
import { getFaq, getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const HomeFaq = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const faq = getFaq(locale)

  return (
    <HomeFaqClient
      title={home.faqTitle}
      subtitle={home.faqSubtitle}
      ctaLabel={home.faqCta}
      items={faq}
    />
  )
}
