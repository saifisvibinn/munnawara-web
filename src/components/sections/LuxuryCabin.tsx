import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { TextLink } from "@/components/ui/TextLink"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

export const LuxuryCabin = async () => {
  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")

  const features = [
    t("cabinFeature1"),
    t("cabinFeature2"),
    t("cabinFeature3"),
    t("cabinFeature4"),
  ]

  return (
    <AnimatedSection className="bg-surface-mint py-16 md:py-20">
      <div className="mx-auto grid max-w-[80rem] items-center gap-10 px-4 md:grid-cols-2 md:gap-14 md:px-10">
        <div>
          <p className="font-label text-xs font-semibold tracking-[0.2em] text-orange uppercase">
            {t("cabinEyebrow")}
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {t("cabinTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            {t("cabinSubtitle")}
          </p>
          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-ink md:text-base"
              >
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-orange text-[10px] text-white"
                  aria-hidden
                >
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <TextLink href="/fleet">{tCommon("viewFleet")}</TextLink>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-md">
          <Image
            src="/fleet/premium-vip-2026/interior/pv-in-1.webp"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
