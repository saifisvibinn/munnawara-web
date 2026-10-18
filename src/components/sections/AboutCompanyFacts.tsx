import { AboutCompanyFactsClient } from "@/components/sections/AboutCompanyFactsClient"
import type { AboutContent, AppLocale } from "@/content/types"

type AboutCompanyFactsProps = {
  about: AboutContent
  locale: AppLocale
}

export const AboutCompanyFacts = ({ about, locale }: AboutCompanyFactsProps) => {
  return (
    <AboutCompanyFactsClient
      overviewTitle={about.overviewTitle}
      overviewParagraphs={about.overviewParagraphs}
      drivesEyebrow={about.drivesEyebrow}
      drivesHeadline={about.drivesHeadline}
      driveItems={about.driveItems}
      strategicObjectivesTitle={about.strategicObjectivesTitle}
      strategicObjectives={about.strategicObjectives}
      leadershipTitle={about.leadershipTitle}
      leadership={about.leadership}
      statsTitle={about.statsTitle}
      stats={about.stats}
      techTitle={about.techTitle}
      techBody={about.techBody}
      locale={locale}
    />
  )
}
