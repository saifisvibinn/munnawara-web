import { AboutPreview } from "@/components/sections/AboutPreview"
import { BusPassby } from "@/components/sections/BusPassby"
import { CareReveal } from "@/components/sections/CareReveal"
import { CTABand } from "@/components/sections/CTABand"
import { HomeFaq } from "@/components/sections/HomeFaq"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { NewsTeaser } from "@/components/sections/NewsTeaser"
import { QuoteSection } from "@/components/sections/QuoteSection"
import { Testimonials } from "@/components/sections/Testimonials"
import { FloatingQuoteCta } from "@/components/layout/FloatingQuoteCta"
import { DamLanding } from "@/components/landing/DamLanding"
import { getHome, getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const config = getSiteConfig()
  const home = getHome(locale as AppLocale)
  const tWhatsapp = await getTranslations()

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
      <FloatingQuoteCta
        whatsappNumber={config.whatsappNumber}
        whatsappPrefill={tWhatsapp("whatsappPrefill")}
      />
    </>
  )
}

export default HomePage
