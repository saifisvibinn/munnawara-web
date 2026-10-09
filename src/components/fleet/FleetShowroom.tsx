"use client"

import { FleetCheck } from "@/components/fleet/FleetCheck"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import type { FleetCategory } from "@/content/types"
import { useTranslations } from "next-intl"
import Image from "next/image"
import "./fleet.css"
import { useCallback, useEffect, useState } from "react"

type FleetShowroomProps = {
  categories: readonly FleetCategory[]
}

type Mode = "exterior" | "interior"

const AMENITY_PREVIEW = 8

const Chevron = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("size-5 rtl:-scale-x-100", className)}
    aria-hidden
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const circleButton =
  "grid size-10 place-items-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-sm transition-[transform,background-color] duration-150 ease-out hover:bg-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100"

const pad = (n: number) => String(n).padStart(2, "0")

/** Dark showroom: photo leads, category rail supports, specs follow the selection. */
export const FleetShowroom = ({ categories }: FleetShowroomProps) => {
  const t = useTranslations("fleetViewer")
  const tCommon = useTranslations("common")
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<Mode>("exterior")
  const [shot, setShot] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const bus = categories[index]
  const hasInterior = (bus?.interiorImages.length ?? 0) > 0
  const photos = bus
    ? mode === "interior" && hasInterior
      ? bus.interiorImages
      : bus.exteriorImages
    : []
  const count = photos.length
  const position = Math.min(shot, count - 1)
  const current = photos[position] ?? bus?.coverImage

  const step = useCallback(
    (delta: number) => setShot((s) => (s + delta + count) % Math.max(count, 1)),
    [count],
  )

  const selectBus = (next: number) => {
    setIndex(next)
    setExpanded(false)
    setMode("exterior")
    setShot(0)
  }

  const selectMode = (next: Mode) => {
    setMode(next)
    setShot(0)
  }

  useEffect(() => {
    if (!lightbox) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false)
      if (event.key === "ArrowRight") step(document.dir === "rtl" ? -1 : 1)
      if (event.key === "ArrowLeft") step(document.dir === "rtl" ? 1 : -1)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [lightbox, step])

  if (!bus || !current) return null

  const counter = t("photoCount", { current: position + 1, total: count })
  const hiddenAmenities = bus.amenities.length - AMENITY_PREVIEW
  const shownAmenities = expanded
    ? bus.amenities
    : bus.amenities.slice(0, AMENITY_PREVIEW)

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)] lg:items-start lg:gap-x-16 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] xl:gap-x-24">
      <div
        role="tablist"
        aria-label={t("categoriesLabel")}
        aria-orientation="vertical"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:sticky lg:top-28 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:self-start"
      >
        {categories.map((item, i) => {
          const active = i === index
          return (
            <button
              key={item.id}
              id={`fleet-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="fleet-panel"
              onClick={() => selectBus(i)}
              className={cn(
                "group flex shrink-0 items-center gap-2.5 rounded-full px-3 py-2 text-start transition-[color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 lg:w-auto lg:max-w-full lg:rounded-none lg:px-0 lg:py-2",
                active ? "text-white" : "text-white/40 hover:text-white/75",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 rounded-full bg-orange transition-opacity duration-150 ease-out",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="font-display text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base lg:text-[1.0625rem] lg:leading-snug lg:whitespace-normal">
                {item.name}
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="fleet-panel"
        role="tabpanel"
        aria-labelledby={`fleet-tab-${bus.id}`}
        className="min-w-0"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-white/5 ring-1 ring-white/12">
          <Image
            key={current}
            src={current}
            alt={`${bus.name} — ${counter}`}
            fill
            priority={index === 0 && shot === 0}
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-cover motion-safe:animate-[fleet-fade_450ms_ease-out]"
          />
          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("previousShot")}
                className={cn(circleButton, "absolute start-3 top-1/2 -translate-y-1/2")}
              >
                <Chevron />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("nextShot")}
                className={cn(circleButton, "absolute end-3 top-1/2 -translate-y-1/2")}
              >
                <Chevron className="rotate-180" />
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label={t("openPhoto")}
            className={cn(circleButton, "absolute end-3 top-3 size-9")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
          <p
            className="absolute start-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white tabular-nums backdrop-blur-sm"
            aria-hidden
          >
            <span dir="ltr">
              {pad(position + 1)} / {pad(count)}
            </span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          {hasInterior ? (
            <div className="flex rounded-full bg-white/10 p-1" role="group">
              {(["exterior", "interior"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => selectMode(m)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100",
                    mode === m
                      ? "bg-white text-black"
                      : "text-white/70 hover:text-white",
                  )}
                >
                  {t(m)}
                </button>
              ))}
            </div>
          ) : null}
          {count > 1 ? (
            <ul className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
              {photos.map((src, i) => (
                <li key={src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={t("photoCount", {
                      current: i + 1,
                      total: count,
                    })}
                    aria-current={i === position}
                    className={cn(
                      "block rounded-lg border-2 transition-[opacity,border-color,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100",
                      i === position
                        ? "border-orange"
                        : "border-transparent opacity-50 hover:opacity-100",
                    )}
                  >
                    <span className="relative block aspect-[4/3] w-16 overflow-hidden rounded-[0.4rem] bg-white/5 sm:w-20">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className="mt-10 border-t border-white/12 pt-8 md:mt-12"
          key={bus.id}
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-white/55">{tCommon("seats")}</p>
              <p className="mt-1 font-display text-4xl leading-none font-semibold tabular-nums md:text-5xl">
                <span dir="ltr" className="inline-block">
                  {bus.seatsLabel}
                </span>
              </p>
            </div>
            <Link
              href="/quote"
              className="inline-flex shrink-0 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-orange-soft active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {tCommon("requestQuote")}
            </Link>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            {bus.summary}
          </p>

          <ul
            className="mt-6 grid gap-x-10 sm:grid-cols-2"
            aria-label={t("specsAmenities")}
          >
            {shownAmenities.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 border-b border-white/10 py-2.5 text-sm leading-snug text-white/80"
              >
                <FleetCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {hiddenAmenities > 0 ? (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 rounded-full px-1 py-1 text-sm font-medium text-orange-soft underline-offset-4 transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              {expanded
                ? t("showLess")
                : t("showAll", { count: bus.amenities.length })}
            </button>
          ) : null}
        </div>
      </div>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={bus.name}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative aspect-[16/10] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current}
              alt={`${bus.name} — ${counter}`}
              fill
              sizes="100vw"
              className="rounded-2xl object-contain"
            />
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => setLightbox(false)}
            aria-label={tCommon("close")}
            className={cn(circleButton, "absolute end-4 top-4")}
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button>
          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label={t("previousShot")}
                className={cn(
                  circleButton,
                  "absolute start-4 top-1/2 -translate-y-1/2",
                )}
              >
                <Chevron />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label={t("nextShot")}
                className={cn(
                  circleButton,
                  "absolute end-4 top-1/2 -translate-y-1/2",
                )}
              >
                <Chevron className="rotate-180" />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
