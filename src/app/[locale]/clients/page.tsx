import { PartnerLogoGrid } from "@/components/sections/PartnerLogoGrid"
import { getClients } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { ArrowUpRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

const ClientsPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tHome = await getTranslations("home")
  const tCommon = await getTranslations("common")
  const clients = getClients(locale as AppLocale)

  return (
    <div className="bg-surface text-ink">
      <section className="px-4 pt-28 pb-12 sm:px-6 sm:pt-32 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display max-w-[12ch] text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] font-semibold tracking-tight text-balance">
            {t("clients")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
            {tHome("clientsTitle")}
          </p>
        </div>
      </section>

      <section
        aria-label={t("clients")}
        className="border-t border-ink/8 px-4 py-14 sm:px-6 lg:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <PartnerLogoGrid />
        </div>
      </section>

      <section
        aria-labelledby="clients-sectors-heading"
        className="border-t border-ink/8 px-4 py-16 sm:px-6 lg:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="clients-sectors-heading"
            className="font-display text-3xl font-semibold tracking-tight md:text-4xl"
          >
            {tHome("clientsSectorsTitle")}
          </h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-14">
            {clients.map((client) => (
              <li key={client.id} className="border-t border-ink/10 pt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                  {client.label}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  {client.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink/8 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {tHome("clientsCta")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted md:text-lg">
              {tHome("clientsCtaBody")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="font-label inline-flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              {tCommon("requestQuote")}
              <ArrowUpRight aria-hidden className="size-4 rtl:scale-x-[-1]" />
            </Link>
            <Link
              href="/contact"
              className="font-label inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-orange hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "clients")

export default ClientsPage
