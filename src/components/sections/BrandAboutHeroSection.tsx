import { BrandAboutHero } from "@/components/sections/BrandAboutHero"
import { getAbout, getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const BrandAboutHeroSection = async () => {
  const locale = (await getLocale()) as AppLocale
  const about = getAbout(locale)
  const home = getHome(locale)

  return (
    <BrandAboutHero
      eyebrow={home.aboutEyebrow}
      title={about.title}
      mission={about.mission}
      intro={about.intro}
      ctaLabel={home.aboutCta}
    />
  )
}
