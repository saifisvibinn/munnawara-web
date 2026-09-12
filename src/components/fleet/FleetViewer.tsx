"use client"

import type { FleetCategory } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
} from "react"

type ViewerMode = "exterior" | "interior"

type FleetViewerProps = {
  bus: FleetCategory
  open: boolean
  onClose: () => void
}

const wrapIndex = (index: number, length: number) => {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

export const FleetViewer = ({ bus, open, onClose }: FleetViewerProps) => {
  const t = useTranslations("fleetViewer")
  const tCommon = useTranslations("common")
  const reduced = useReducedMotion()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, lastX: 0, leftover: 0 })
  const [mode, setMode] = useState<ViewerMode>("exterior")
  const [frame, setFrame] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const frames = mode === "interior" ? bus.interiorImages : bus.exteriorImages
  const canEnterCabin = bus.interiorImages.length > 0

  const handleStep = useCallback(
    (delta: number) => {
      if (frames.length <= 1) return
      setFrame((current) => wrapIndex(current + delta, frames.length))
      setTilt(delta * 8)
    },
    [frames.length],
  )

  useEffect(() => {
    if (!open) return
    setMode("exterior")
    setFrame(0)
    setTilt(0)
    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open, bus.id])

  useEffect(() => {
    setFrame(0)
    setTilt(0)
  }, [mode])

  useEffect(() => {
    if (!open || reduced || isDragging || frames.length <= 1) return
    const timer = window.setInterval(() => handleStep(1), 1100)
    return () => window.clearInterval(timer)
  }, [open, reduced, isDragging, frames.length, handleStep, mode, frame])

  useEffect(() => {
    if (tilt === 0) return
    const timer = window.setTimeout(() => setTilt(0), 220)
    return () => window.clearTimeout(timer)
  }, [tilt])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        handleStep(1)
        return
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        handleStep(-1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, handleStep, onClose])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { active: true, lastX: event.clientX, leftover: 0 }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return
    const dx = event.clientX - dragRef.current.lastX
    dragRef.current.lastX = event.clientX
    dragRef.current.leftover += dx
    const threshold = 36
    if (Math.abs(dragRef.current.leftover) < threshold) return
    handleStep(dragRef.current.leftover > 0 ? -1 : 1)
    dragRef.current.leftover = 0
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleEnterInterior = () => {
    if (!canEnterCabin) return
    setMode("interior")
  }

  const handleEnterExterior = () => setMode("exterior")

  if (!open) return null

  const currentSrc = frames[frame] ?? bus.coverImage

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex flex-col bg-black/92 text-white"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-orange-soft">
            {mode === "interior" ? t("interior") : t("exterior")}
          </p>
          <h2 id={titleId} className="text-xl font-bold md:text-2xl">
            {bus.name} {bus.yearLabel}
          </h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="rounded-md px-3 py-2 text-sm font-medium text-white/80 ring-1 ring-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          {t("close")}
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-10">
        <div className="w-full max-w-5xl" style={{ perspective: "1400px" }}>
          <div
            ref={stageRef}
            role="img"
            aria-label={t("dragToRotate")}
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative aspect-[16/10] cursor-grab overflow-hidden rounded-xl bg-ink/40 touch-none active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${currentSrc}`}
                className="absolute inset-0"
                initial={
                  reduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        rotateY: mode === "interior" ? 72 : tilt >= 0 ? 28 : -28,
                        scale: 0.92,
                        z: -80,
                      }
                }
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 1, rotateY: tilt, scale: 1, z: 0 }
                }
                exit={
                  reduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        rotateY: mode === "interior" ? -72 : tilt >= 0 ? -22 : 22,
                        scale: 1.04,
                      }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src={currentSrc}
                  alt={`${bus.name} ${mode === "interior" ? t("interior") : t("exterior")}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-white/70">
              {t("dragToRotate")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-8">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          className="rounded-md px-4 py-2 text-sm ring-1 ring-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          {t("previousShot")}
        </button>
        {canEnterCabin ? (
          <button
            type="button"
            onClick={mode === "interior" ? handleEnterExterior : handleEnterInterior}
            className="rounded-md bg-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {mode === "interior" ? t("viewExterior") : t("viewInterior")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => handleStep(1)}
          className="rounded-md px-4 py-2 text-sm ring-1 ring-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          {t("nextShot")}
        </button>
        <p className={cn("w-full text-center text-xs text-white/50")}>
          {tCommon("seats")}: {bus.seatsLabel}
        </p>
      </div>
    </div>
  )
}
