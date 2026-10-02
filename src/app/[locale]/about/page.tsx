import { AboutFilm } from "@/components/about/AboutFilm"
import { getAbout } from "@/content"
import type { AppLocale } from "@/content/types"
import { setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const AboutPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const about = getAbout(locale as AppLocale)

  return <AboutFilm film={about.film} pageTitle={about.title} />
}

export default AboutPage
