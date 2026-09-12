import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { getFleet } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"

export const FleetPreview = async () => {
  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")
  const locale = (await getLocale()) as AppLocale
  const fleet = getFleet(locale).slice(0, 3)

  return (
    <AnimatedSection className="bg-surface py-16 md:py-20">
      <div className="mx-auto flex max-w-[80rem] flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-10 md:text-start">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {t("fleetTitle")}
          </h2>
          <p className="mt-3 text-base text-ink-muted md:text-lg">
            {t("fleetSubtitle")}
          </p>
        </div>
        <Link
          href="/fleet"
          className="font-label inline-flex rounded-lg border border-orange bg-transparent px-5 py-2.5 text-[15px] font-semibold text-orange transition hover:bg-orange hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          {tCommon("viewFleet")}
        </Link>
      </div>
      <div className="mx-auto mt-12 grid max-w-[80rem] gap-6 px-4 md:grid-cols-3 md:px-10">
        {fleet.map((item) => (
          <article
            key={item.id}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.coverImage}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col px-5 py-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {item.name}
              </h3>
              <p className="font-label mt-1 text-sm text-orange">
                {tCommon("seats")} {item.seatsLabel}
              </p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-muted">
                {item.amenities.slice(0, 3).map((amenity) => (
                  <li key={amenity} className="flex gap-2">
                    <span className="text-orange" aria-hidden>
                      ✓
                    </span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/fleet"
                className="font-label mt-5 inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-orange hover:bg-secondary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                {tCommon("learnMore")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}
