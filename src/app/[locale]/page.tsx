import { AboutPreview } from "@/components/sections/AboutPreview"
import { BusPassby } from "@/components/sections/BusPassby"
import { CTABand } from "@/components/sections/CTABand"
import { Hero } from "@/components/sections/Hero"
import { HomeFaq } from "@/components/sections/HomeFaq"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { NewsTeaser } from "@/components/sections/NewsTeaser"
import { Testimonials } from "@/components/sections/Testimonials"
import { ValueProposition } from "@/components/sections/ValueProposition"
import { FloatingQuoteCta } from "@/components/layout/FloatingQuoteCta"
import { setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <ValueProposition />
      <BusPassby />
      <HowItWorks />
      <AboutPreview />
      <Testimonials />
      <NewsTeaser />
      <HomeFaq />
      <CTABand />
      <FloatingQuoteCta />
    </>
  )
}

export default HomePage
