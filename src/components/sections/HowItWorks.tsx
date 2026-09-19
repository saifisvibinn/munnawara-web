import { HowItWorksClient } from "@/components/sections/HowItWorksClient"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const HowItWorks = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)

  return (
    <HowItWorksClient
      title={home.howTitle}
      subtitle={home.howSubtitle}
      stepPrefix={home.howStepPrefix}
      steps={home.howSteps}
    />
  )
}
