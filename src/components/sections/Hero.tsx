import { HeroClient } from "@/components/sections/HeroClient"
import { getSiteConfig } from "@/content"
import { getTranslations } from "next-intl/server"

export const Hero = async () => {
  const t = await getTranslations("home")
  const tMeta = await getTranslations("meta")
  const tWhatsapp = await getTranslations()
  const config = getSiteConfig()

  return (
    <HeroClient
      siteName={tMeta("siteName")}
      headline={t("headline")}
      subhead={t("subhead")}
      whatsappNumber={config.whatsappNumber}
      whatsappPrefill={tWhatsapp("whatsappPrefill")}
    />
  )
}
