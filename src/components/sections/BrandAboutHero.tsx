import { BrandAboutHeroClient } from "@/components/sections/BrandAboutHeroClient"
import { getAbout, getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const BrandAboutHero = async () => {
  const locale = (await getLocale()) as AppLocale
  const about = getAbout(locale)
  const home = getHome(locale)

  return (
    <BrandAboutHeroClient
      eyebrow={home.aboutEyebrow}
      title={about.title}
      mission=""
      intro={about.intro}
      ctaLabel={home.aboutCta}
    />
  )
}
