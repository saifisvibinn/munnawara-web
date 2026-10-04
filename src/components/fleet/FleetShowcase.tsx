"use client"

import "@/components/fleet/fleet.css"
import { FleetLightbox } from "@/components/fleet/FleetLightbox"
import type { FleetCategory } from "@/content/types"
import { cn } from "@/lib/cn"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useId, useMemo, useState } from "react"

type FleetShowcaseProps = {
  categories: readonly FleetCategory[]
}

type View = "exterior" | "interior"

const chipBase =
  "min-h-11 shrink-0 cursor-pointer snap-start rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
const chipOn = "border-orange bg-orange text-black"
const chipOff =
  "border-border bg-surface-elevated text-ink hover:border-ink-muted"

export const FleetShowcase = ({ categories }: FleetShowcaseProps) => {
  const t = useTranslations("fleetViewer")
  const tCommon = useTranslations("common")
  const panelId = useId()
  const [busIndex, setBusIndex] = useState(0)
  const [view, setView] = useState<View>("exterior")
  const [shot, setShot] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const bus = categories[busIndex]

  const images = useMemo(() => {
    if (!bus) return []
    const list = view === "interior" ? bus.interiorImages : bus.exteriorImages
    return list.length > 0 ? list : [bus.coverImage]
  }, [bus, view])

  if (!bus) return null

  const hasInterior = bus.interiorImages.length > 0
  const activeView: View = view === "interior" && hasInterior ? "interior" : "exterior"
  const current = images[Math.min(shot, images.length - 1)] ?? bus.coverImage
  const currentIndex = Math.max(0, images.indexOf(current))

  const selectBus = (index: number) => {
    setBusIndex(index)
    setView("exterior")
    setShot(0)
  }
  const selectView = (next: View) => {
    setView(next)
    setShot(0)
  }

  return (
    <div className="mx-auto max-w-[80rem] px-4 md:px-10" aria-label={t("carouselLabel")}>
      {/* Bus selector */}
      <div
        role="tablist"
        aria-label={t("carouselLabel")}
        data-lenis-prevent-wheel
        className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
      >
        {categories.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            id={`${panelId}-bus-${index}`}
            aria-selected={index === busIndex}
            aria-controls={panelId}
            onClick={() => selectBus(index)}
            className={cn(chipBase, index === busIndex ? chipOn : chipOff)}
          >
            {entry.name}
            <span
              className={cn(
                "ms-2 font-normal",
                index === busIndex ? "text-black/70" : "text-ink-muted",
              )}
            >
              {entry.yearLabel}
            </span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-bus-${busIndex}`}
        className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10"
      >
        {/* Media */}
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setLightbox(currentIndex)}
            aria-label={`${t("inspectBus")}: ${bus.name}`}
            className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            {/* Blurred backdrop so any aspect ratio fills the frame without cropping the bus. */}
            <Image
              src={current}
              alt=""
              aria-hidden
              fill
              sizes="48px"
              className="scale-125 object-cover opacity-70 blur-2xl"
            />
            <Image
              key={current}
              src={current}
              alt={bus.name}
              fill
              priority={busIndex === 0}
              sizes="(max-width: 1024px) 100vw, 720px"
              className="object-contain"
            />
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {hasInterior ? (
              <div className="flex gap-2" role="group" aria-label={bus.name}>
                {(["exterior", "interior"] as const).map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    aria-pressed={activeView === entry}
                    onClick={() => selectView(entry)}
                    className={cn(chipBase, activeView === entry ? chipOn : chipOff)}
                  >
                    {t(entry)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {images.length > 1 ? (
            <ul
              data-lenis-prevent-wheel
              className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-2"
            >
              {images.map((src, index) => (
                <li key={src} className="shrink-0 snap-start">
                  <button
                    type="button"
                    onClick={() => setShot(index)}
                    aria-label={`${bus.name} ${index + 1}`}
                    aria-current={src === current}
                    className={cn(
                      "relative block h-16 w-24 cursor-pointer overflow-hidden rounded-lg bg-surface-muted ring-2 transition focus-visible:outline-none focus-visible:ring-orange sm:h-[4.5rem] sm:w-28",
                      src === current ? "ring-orange" : "ring-transparent hover:ring-border",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="112px"
                      className="object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Details */}
        <div className="min-w-0 text-start">
          <p className="font-label text-xs font-semibold tracking-[0.14em] text-orange uppercase">
            {t("detailsLabel")}
          </p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            {bus.name}
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            {bus.yearLabel} · {tCommon("seats")}: {bus.seatsLabel}
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/75">{bus.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {bus.amenities.map((item) => (
              <li
                key={item}
                className="rounded-full bg-surface-muted px-3 py-1.5 text-xs text-ink/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <FleetLightbox
        images={images}
        alt={bus.name}
        index={lightbox}
        onIndexChange={(next) => {
          setLightbox(next)
          if (next !== null) setShot(next)
        }}
      />
    </div>
  )
}
