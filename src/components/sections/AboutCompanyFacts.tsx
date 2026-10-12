import { AboutCompanyFactsClient } from "@/components/sections/AboutCompanyFactsClient"
import type { AboutContent, AppLocale } from "@/content/types"

type AboutCompanyFactsProps = {
  about: AboutContent
  locale: AppLocale
}

export const AboutCompanyFacts = ({ about, locale }: AboutCompanyFactsProps) => {
  return (
    <AboutCompanyFactsClient
      drivesEyebrow={about.drivesEyebrow}
      drivesHeadline={about.drivesHeadline}
      driveItems={about.driveItems}
      valuesTitle={about.valuesTitle}
      valuePillars={about.valuePillars}
      statsTitle={about.statsTitle}
      stats={about.stats}
      techTitle={about.techTitle}
      techBody={about.techBody}
      locale={locale}
    />
  )
}
