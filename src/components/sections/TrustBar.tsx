import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { getFleet, getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"

export const TrustBar = async () => {
  const t = await getTranslations("home")
  const locale = (await getLocale()) as AppLocale
  const fleetCount = getFleet(locale).length
  const config = getSiteConfig()

  const items = [
    { value: config.brandShort, label: t("trustLicensed") },
    { value: String(fleetCount), label: t("trustFleet") },
    { value: "2026", label: t("trustYears") },
    { value: t("trustCareValue"), label: t("trustCare") },
  ]

  return (
    <AnimatedSection className="bg-surface-mint">
      <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-10 md:py-12">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border bg-surface-elevated px-5 py-8 text-center shadow-sm"
          >
            <p className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              {item.value}
            </p>
            <p className="font-label mt-2 text-sm text-ink-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}
