import { Stagger, StaggerItem } from "@/components/motion/Stagger"
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
          <Stagger as="ul" className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-14">
            {clients.map((client) => (
              <StaggerItem
                as="li"
                key={client.id}
                className="group relative pt-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-ink/10 after:absolute after:start-0 after:top-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-orange after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 rtl:after:origin-right motion-reduce:after:transition-none"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-orange md:text-2xl">
                  {client.label}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  {client.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
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
              className="group font-label inline-flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-black transition-[transform,background-color] duration-150 ease-out hover:bg-orange-soft active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {tCommon("requestQuote")}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:scale-x-[-1] rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
            <Link
              href="/contact"
              className="font-label inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-[transform,border-color,color] duration-150 ease-out hover:border-orange hover:text-orange active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100"
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
