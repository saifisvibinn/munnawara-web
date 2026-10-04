import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PartnerLogoGrid } from "@/components/sections/PartnerLogoGrid"
import { PageIntro } from "@/components/ui/PageIntro"
import { getClients } from "@/content"
import type { AppLocale } from "@/content/types"
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
  const clients = getClients(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("clients")} subtitle={tHome("clientsTitle")} align="start" />
      <PartnerLogoGrid className="mx-auto mt-16 max-w-4xl px-4 sm:px-6" />
      <div className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
        {clients.map((client) => (
          <article key={client.id} className="border-b border-ink/8 py-10">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              {client.label}
            </h2>
            <p className="mt-3 text-lg text-ink-muted">{client.description}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "clients")

export default ClientsPage
