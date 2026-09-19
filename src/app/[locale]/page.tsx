import { AboutPreview } from "@/components/sections/AboutPreview"
import { BrandAboutHero } from "@/components/sections/BrandAboutHero"
import { BusPassby } from "@/components/sections/BusPassby"
import { CareReveal } from "@/components/sections/CareReveal"
import { CTABand } from "@/components/sections/CTABand"
import { HomeFaq } from "@/components/sections/HomeFaq"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { NewsTeaser } from "@/components/sections/NewsTeaser"
import { QuoteSection } from "@/components/sections/QuoteSection"
import { Testimonials } from "@/components/sections/Testimonials"
import { FloatingQuoteCta } from "@/components/layout/FloatingQuoteCta"
import { MunawwaraIntro } from "@/components/intro/MunawwaraIntro"
import { getSiteConfig } from "@/content"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const config = getSiteConfig()
  const tWhatsapp = await getTranslations()

  return (
    <>
      <MunawwaraIntro />
      <BrandAboutHero />
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
