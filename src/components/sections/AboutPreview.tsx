import { AboutPreviewClient } from "@/components/sections/AboutPreviewClient"
import { getAbout, getHome, getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const AboutPreview = async () => {
  const locale = (await getLocale()) as AppLocale
  const about = getAbout(locale)
  const home = getHome(locale)
  const config = getSiteConfig()

  return (
    <AboutPreviewClient
      eyebrow={home.aboutEyebrow}
      headlineLines={home.aboutHeadlineLines}
      body={about.mission}
      primaryCta={home.aboutCta}
      secondaryCta={home.aboutSecondaryCta}
      socialCta={home.aboutSocialCta}
      social={config.social}
      imageAlt={about.title}
    />
  )
}
