import { AboutFilm } from "@/components/about/AboutFilm"
import { AboutCompanyFacts } from "@/components/sections/AboutCompanyFacts"
import { getAbout } from "@/content"
import type { AppLocale } from "@/content/types"
import { setRequestLocale } from "next-intl/server"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

const AboutPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale
  const about = getAbout(appLocale)

  return (
    <AboutFilm film={about.film} pageTitle={about.title}>
      <AboutCompanyFacts about={about} locale={appLocale} />
    </AboutFilm>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "about")

export default AboutPage
