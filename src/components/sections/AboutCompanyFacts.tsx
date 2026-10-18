import { AboutCompanyFactsClient } from "@/components/sections/AboutCompanyFactsClient"
import type { AboutContent, AppLocale } from "@/content/types"

type AboutCompanyFactsProps = {
  about: AboutContent
  locale: AppLocale
}

export const AboutCompanyFacts = ({ about, locale }: AboutCompanyFactsProps) => {
  return <AboutCompanyFactsClient about={about} locale={locale} />
}
