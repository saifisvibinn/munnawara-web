import { FleetShowcase } from "@/components/fleet/FleetShowcase"
import { PageIntro } from "@/components/ui/PageIntro"
import { getFleet } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const FleetPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tHome = await getTranslations("home")
  const fleet = getFleet(locale as AppLocale)

  return (
    <section className="overflow-hidden pb-24 pt-20">
      <PageIntro title={t("fleet")} subtitle={tHome("fleetSubtitle")} />
      <div className="mt-12">
        <FleetShowcase categories={fleet} />
      </div>
    </section>
  )
}

export default FleetPage
