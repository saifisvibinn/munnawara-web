"use client"

import { Badge } from "@/components/ui/Badge"
import type { FleetCategory, FleetCategoryId } from "@/content/types"
import { cn } from "@/lib/cn"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

type FleetGalleryProps = {
  categories: readonly FleetCategory[]
}

export const FleetGallery = ({ categories }: FleetGalleryProps) => {
  const t = useTranslations("common")
  const [active, setActive] = useState<FleetCategoryId | "all">("all")

  const filtered = useMemo(() => {
    if (active === "all") return categories
    return categories.filter((item) => item.id === active)
  }, [active, categories])

  return (
    <div className="space-y-8">
      <div
        role="tablist"
        aria-label={t("allCategories")}
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={active === "all"}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
            active === "all"
              ? "bg-orange text-white"
              : "bg-white text-ink-muted ring-1 ring-ink/10 hover:text-ink",
          )}
          onClick={() => setActive("all")}
        >
          {t("allCategories")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={active === category.id}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
              active === category.id
                ? "bg-orange text-white"
                : "bg-white text-ink-muted ring-1 ring-ink/10 hover:text-ink",
            )}
            onClick={() => setActive(category.id)}
          >
            {category.name} {category.yearLabel}
          </button>
        ))}
      </div>

      <div className="grid gap-10">
        {filtered.map((category) => (
          <article
            key={category.id}
            className="grid gap-6 border-b border-ink/10 pb-10 last:border-0 md:grid-cols-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink/5">
              <Image
                src={category.images[0]}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-wordmark">
                  {category.name}
                </h2>
                <Badge>{category.yearLabel}</Badge>
              </div>
              <p className="mb-2 text-sm font-medium text-orange">
                {t("seats")}: {category.seatsLabel}
              </p>
              <p className="mb-5 text-sm leading-relaxed text-ink-muted">
                {category.summary}
              </p>
              <h3 className="mb-2 text-sm font-semibold text-ink">
                {t("amenities")}
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {category.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-md bg-surface px-3 py-2 text-sm text-ink-muted"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
              {category.notes ? (
                <p className="mt-4 text-xs text-ink-muted">{category.notes}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
