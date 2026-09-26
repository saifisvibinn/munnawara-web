import { AboutPreview } from "@/components/sections/AboutPreview"
import { BusPassby } from "@/components/sections/BusPassby"
import { CareReveal } from "@/components/sections/CareReveal"
import { CTABand } from "@/components/sections/CTABand"
import { HomeFaq } from "@/components/sections/HomeFaq"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { NewsTeaser } from "@/components/sections/NewsTeaser"
import { QuoteSection } from "@/components/sections/QuoteSection"
import { Testimonials } from "@/components/sections/Testimonials"
import { DamLanding } from "@/components/landing/DamLanding"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const home = getHome(locale as AppLocale)

  return (
    <>
      <DamLanding copy={home.landingHero} />
      <CareReveal />
      <BusPassby />
      <HowItWorks />
      <AboutPreview />
      <QuoteSection />
      <Testimonials />
      <NewsTeaser />
      <HomeFaq />
      <CTABand />
    </>
  )
}

export default HomePage
