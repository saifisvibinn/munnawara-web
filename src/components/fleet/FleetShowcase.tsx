"use client"

import { FleetViewer } from "@/components/fleet/FleetViewer"
import type { FleetCategory } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { motion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

type FleetShowcaseProps = {
  categories: readonly FleetCategory[]
}

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length

export const FleetShowcase = ({ categories }: FleetShowcaseProps) => {
  const t = useTranslations("fleetViewer")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const reduced = useReducedMotion()
  const direction = locale === "ar" ? -1 : 1
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const active = categories[activeIndex]

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, categories.length))
    },
    [categories.length],
  )

  const handleOpenViewer = (index: number) => {
    handleSelect(index)
    setViewerOpen(true)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewerOpen) return
      if (event.key === "ArrowRight") {
        event.preventDefault()
        handleSelect(activeIndex + direction)
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        handleSelect(activeIndex - direction)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, direction, handleSelect, viewerOpen])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return

    const handleWheel = (event: WheelEvent) => {
      if (viewerOpen) return
      if (Math.abs(event.deltaY) < 18 && Math.abs(event.deltaX) < 18) return
      event.preventDefault()
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY
      handleSelect(activeIndex + (delta > 0 ? direction : -direction))
    }

    node.addEventListener("wheel", handleWheel, { passive: false })
    return () => node.removeEventListener("wheel", handleWheel)
  }, [activeIndex, direction, handleSelect, viewerOpen])

  if (!active) return null

  return (
    <div className="space-y-8">
      <div ref={stageRef} className="relative overflow-hidden py-6">
        <div
          className="relative mx-auto h-[min(62vw,420px)] max-w-6xl"
          aria-roledescription="carousel"
          aria-label={t("carouselLabel")}
          style={{ perspective: "1600px" }}
        >
          {categories.map((bus, index) => {
            const offset = index - activeIndex
            const wrapped =
              offset > categories.length / 2
                ? offset - categories.length
                : offset < -categories.length / 2
                  ? offset + categories.length
                  : offset
            const isActive = wrapped === 0
            const hidden = Math.abs(wrapped) > 2

            return (
              <motion.button
                key={bus.id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                aria-label={`${bus.name} ${bus.yearLabel}`}
                tabIndex={hidden ? -1 : 0}
                disabled={hidden}
                onClick={() => {
                  if (isActive) {
                    handleOpenViewer(index)
                    return
                  }
                  handleSelect(index)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    if (isActive) handleOpenViewer(index)
                    else handleSelect(index)
                  }
                }}
                className={cn(
                  "absolute top-0 left-1/2 h-full w-[min(78vw,520px)] overflow-hidden rounded-xl bg-black text-start shadow-md ring-1 ring-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                  hidden && "pointer-events-none",
                )}
                animate={{
                  x: `calc(-50% + ${wrapped * 58 * direction}%)`,
                  rotateY: reduced ? 0 : wrapped * -22 * direction,
                  scale: isActive ? 1 : 0.82,
                  z: -Math.abs(wrapped) * 90,
                  opacity: hidden ? 0 : 1 - Math.min(Math.abs(wrapped) * 0.18, 0.45),
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 90, damping: 18 }
                }
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 20 - Math.abs(wrapped),
                }}
              >
                <Image
                  src={bus.coverImage}
                  alt={bus.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 80vw, 520px"
                  priority={isActive}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-medium tracking-wide text-white/60">
                    {bus.yearLabel}
                    {bus.interactive ? ` · ${t("interactive")}` : ""}
                  </p>
                  <p className="text-xl font-semibold tracking-tight">{bus.name}</p>
                  <p className="mt-1 text-sm text-white/75">
                    {tCommon("seats")}: {bus.seatsLabel}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center md:px-6">
        <p className="text-sm leading-relaxed break-words text-ink-muted">{active.summary}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => handleSelect(activeIndex - 1)}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-ink/10 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {t("previousBus")}
          </button>
          <button
            type="button"
            onClick={() => handleOpenViewer(activeIndex)}
            className="rounded-lg bg-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            {active.interactive ? t("viewInterior") : t("inspectBus")}
          </button>
          <button
            type="button"
            onClick={() => handleSelect(activeIndex + 1)}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-ink/10 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {t("nextBus")}
          </button>
        </div>
        <p className="text-xs text-ink-muted">{t("scrollHint")}</p>
      </div>

      {active ? (
        <FleetViewer
          bus={active}
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      ) : null}
    </div>
  )
}
