import { CareRevealClient } from "@/components/sections/CareRevealClient"
import { getCareReveal } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const CareReveal = async () => {
  const locale = (await getLocale()) as AppLocale
  const content = getCareReveal(locale)

  return <CareRevealClient content={content} />
}
