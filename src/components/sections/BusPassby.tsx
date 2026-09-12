import { BusPassbyClient } from "@/components/sections/BusPassbyClient"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const BusPassby = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)

  return (
    <BusPassbyClient
      eyebrow={home.passbyEyebrow}
      title={home.passbyTitle}
      titleAfter={home.passbyTitleAfter}
    />
  )
}
