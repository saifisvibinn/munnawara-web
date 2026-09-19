"use client"

import { FleetViewer } from "@/components/fleet/FleetViewer"
import type { FleetCategory } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { motion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react"

type FleetShowcaseProps = {
  categories: readonly FleetCategory[]
}

const AUTO_ADVANCE_MS = 4800
const DRAG_STEP_PX = 56
const CLICK_SUPPRESS_PX = 10

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
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(activeIndex)
  const viewerOpenRef = useRef(viewerOpen)
  const dragRef = useRef({
    tracking: false,
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    leftover: 0,
    moved: 0,
    pointerId: -1,
  })
  const suppressClickRef = useRef(false)
  const active = categories[activeIndex]

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    viewerOpenRef.current = viewerOpen
  }, [viewerOpen])

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

  const handleCardActivate = (index: number, isActive: boolean) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    if (isActive) {
      handleOpenViewer(index)
      return
    }
    handleSelect(index)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewerOpenRef.current) return
      if (event.key === "ArrowRight") {
        event.preventDefault()
        handleSelect(activeIndexRef.current + direction)
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        handleSelect(activeIndexRef.current - direction)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [direction, handleSelect])

  useEffect(() => {
    if (reduced || viewerOpen || isDragging || categories.length <= 1) return

    const timer = window.setInterval(() => {
      handleSelect(activeIndexRef.current + 1)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [reduced, viewerOpen, isDragging, categories.length, handleSelect])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (viewerOpenRef.current) return
    if (event.button !== 0) return

    dragRef.current = {
      tracking: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      leftover: 0,
      moved: 0,
      pointerId: event.pointerId,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.tracking) return

    if (!drag.dragging) {
      const totalX = event.clientX - drag.startX
      const totalY = event.clientY - drag.startY
      if (Math.abs(totalX) < 8 && Math.abs(totalY) < 8) return
      if (Math.abs(totalY) > Math.abs(totalX)) {
        drag.tracking = false
        return
      }

      drag.dragging = true
      drag.lastX = event.clientX
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    const dx = event.clientX - drag.lastX
    drag.lastX = event.clientX
    drag.leftover += dx
    drag.moved += Math.abs(dx)

    if (Math.abs(drag.leftover) < DRAG_STEP_PX) return

    const step = drag.leftover > 0 ? -direction : direction
    handleSelect(activeIndexRef.current + step)
    drag.leftover = 0
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.tracking && !drag.dragging) return

    if (drag.moved > CLICK_SUPPRESS_PX) {
      suppressClickRef.current = true
    }

    if (
      drag.dragging &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    drag.tracking = false
    drag.dragging = false
    setIsDragging(false)
  }

  if (!active) return null

  return (
    <div className="space-y-8">
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative touch-pan-y overflow-hidden py-6",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
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
                onClick={() => handleCardActivate(index, isActive)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    handleCardActivate(index, isActive)
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
                    : { type: "spring", stiffness: 70, damping: 22, mass: 0.9 }
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
                  className="object-cover pointer-events-none"
                  sizes="(max-width:768px) 80vw, 520px"
                  draggable={false}
                  priority={isActive}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
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
