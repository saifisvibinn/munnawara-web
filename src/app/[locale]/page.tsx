import { AboutPreview } from "@/components/sections/AboutPreview"
import { BehindTheScenes } from "@/components/sections/BehindTheScenes"
import { BusPassby } from "@/components/sections/BusPassby"
import { CTABand } from "@/components/sections/CTABand"
import { HomeFaq } from "@/components/sections/HomeFaq"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { NewsTeaser } from "@/components/sections/NewsTeaser"
import { QuoteSection } from "@/components/sections/QuoteSection"
import { Testimonials } from "@/components/sections/Testimonials"
import { DamLanding } from "@/components/landing/DamLanding"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { ogLocaleTag } from "@/i18n/routing"
import { languageAlternates, localizedPath, shareImageMeta } from "@/lib/seo"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale } = await params
  const [tMeta, tSeo] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getTranslations({ locale, namespace: "seo" }),
  ])
  const siteName = tMeta("siteName")
  const description = tSeo("site")
  const image = shareImageMeta(siteName)

  return {
    alternates: {
      canonical: localizedPath(locale, "/"),
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      url: localizedPath(locale, "/"),
      locale: ogLocaleTag(locale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [image],
    },
  }
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale
  const home = getHome(appLocale)

  return (
    <>
      <DamLanding copy={home.landingHero} />
      <BusPassby />
      <HowItWorks />
      <AboutPreview />
      <BehindTheScenes locale={appLocale} />
      <QuoteSection />
      <Testimonials />
      <NewsTeaser />
      <HomeFaq />
      <CTABand />
    </>
  )
}

export default HomePage
