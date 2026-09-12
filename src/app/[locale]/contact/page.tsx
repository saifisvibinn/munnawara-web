import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { MapEmbed } from "@/components/ui/MapEmbed"
import { PageIntro } from "@/components/ui/PageIntro"
import { getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const ContactPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tCommon = await getTranslations("common")
  const tHome = await getTranslations("home")
  const config = getSiteConfig()
  const currentLocale = (await getLocale()) as AppLocale
  const address =
    currentLocale === "ar" ? config.address.ar : config.address.en
  const hours =
    currentLocale === "ar" ? config.workingHours.ar : config.workingHours.en

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("contact")} subtitle={tHome("ctaBandSubtitle")} />
      <div className="mx-auto mt-16 grid max-w-5xl gap-16 px-6 md:grid-cols-2 md:items-start">
        <div className="space-y-10">
          <div>
            <p className="text-sm text-ink-muted">{tCommon("email")}</p>
            <a
              href={`mailto:${config.email}`}
              className="mt-2 block text-2xl font-medium tracking-tight text-ink hover:text-ink-muted"
            >
              {config.email}
            </a>
          </div>
          <div>
            <p className="text-sm text-ink-muted">{tCommon("phone")}</p>
            <ul className="mt-2 space-y-2">
              {config.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone}`}
                    className="text-2xl font-medium tracking-tight text-ink hover:text-ink-muted"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-ink-muted">{tCommon("address")}</p>
            <p className="mt-2 text-lg leading-relaxed text-ink">{address}</p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">{tCommon("workingHours")}</p>
            <p className="mt-2 text-lg text-ink">{hours}</p>
          </div>
        </div>
        <MapEmbed address={address} />
      </div>
    </AnimatedSection>
  )
}

export default ContactPage
