"use client"

import type { GalleryPhoto } from "@/content"
import type { PhotoCategory } from "@/content/photoManifest"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { project } from "@/lib/appleMotion"
import { cn } from "@/lib/cn"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, useMotionValue } from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

const SWIPE_DISTANCE = 72
const SWIPE_VELOCITY = 550
const IMAGE_QUALITY = 92

type TabId = "all" | "fleet" | "interior" | "workshop" | "team" | "facilities"

const TABS: readonly { id: TabId; categories: readonly PhotoCategory[] }[] = [
  { id: "all", categories: ["exterior", "interior", "workshop", "people", "company"] },
  { id: "fleet", categories: ["exterior"] },
  { id: "interior", categories: ["interior"] },
  { id: "workshop", categories: ["workshop"] },
  { id: "team", categories: ["people"] },
  { id: "facilities", categories: ["company"] },
]

type WindowWithLenis = Window & { __lenis?: { stop: () => void; start: () => void } }

const LOCKING_BODY_CLASSES = [
  "is-loading",
  "is-transitioning",
  "is-page-transitioning",
  "is-quote-page",
]

type PhotoGalleryProps = {
  photos: readonly GalleryPhoto[]
}

export const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const t = useTranslations("photoGallery")
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<TabId>("all")
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openedFromQuery = useRef(false)
  const panelId = useId()
  const x = useMotionValue(0)
  const reduced = useReducedMotion()

  const visible = useMemo(() => {
    const categories = TABS.find((entry) => entry.id === tab)?.categories ?? []
    return photos.filter((photo) => categories.includes(photo.category))
  }, [photos, tab])

  const isOpen = openIndex !== null
  const current = isOpen ? visible[openIndex] : undefined
  const count = visible.length

  const close = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((index) =>
        index === null ? index : (index + delta + visible.length) % visible.length,
      )
    },
    [visible.length],
  )

  useEffect(() => {
    x.set(0)
  }, [openIndex, x])

  // Deep-link: /gallery?p=workshop-0146 opens that photo in the lightbox.
  useEffect(() => {
    if (openedFromQuery.current) return
    const id = searchParams.get("p")
    if (!id) return
    const allCategories = TABS[0]?.categories ?? []
    const index = photos
      .filter((photo) => allCategories.includes(photo.category))
      .findIndex((photo) => photo.id === id)
    if (index < 0) return
    openedFromQuery.current = true
    setTab("all")
    setOpenIndex(index)
  }, [photos, searchParams])

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (count < 2 || reduced) return
    const projected = info.offset.x + project(info.velocity.x)
    const rtl = document.documentElement.dir === "rtl"
    const flicked =
      Math.abs(projected) > SWIPE_DISTANCE ||
      Math.abs(info.velocity.x) > SWIPE_VELOCITY
    if (!flicked) return
    const forward = rtl ? projected > 0 : projected < 0
    step(forward ? 1 : -1)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen) return

    const lenis = (window as WindowWithLenis).__lenis
    const previousOverflow = document.body.style.overflow
    lenis?.stop()
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
      const locked = LOCKING_BODY_CLASSES.some((name) =>
        document.body.classList.contains(name),
      )
      if (!locked) lenis?.start()
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    const rtl = document.documentElement.dir === "rtl"
    if (event.key === "ArrowRight") step(rtl ? -1 : 1)
    else if (event.key === "ArrowLeft") step(rtl ? 1 : -1)
    else if (event.key === "Escape") close()
  }

  const selectTab = (next: TabId) => {
    setTab(next)
    setOpenIndex(null)
  }

  return (
    <>
      <div
        role="tablist"
        aria-label={t("tabs")}
        className="flex flex-wrap gap-x-1 gap-y-2 border-b border-border pb-px"
      >
        {TABS.map((entry) => {
          const selected = entry.id === tab
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={`${panelId}-tab-${entry.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              onClick={() => selectTab(entry.id)}
              data-cursor="open"
              className={cn(
                "relative min-h-11 cursor-pointer px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                selected ? "text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {t(entry.id)}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-orange transition-opacity",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${tab}`}
        className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4"
      >
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`${t("open")}: ${photo.alt}`}
            onClick={() => setOpenIndex(index)}
            data-cursor="open"
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-surface-muted text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:mb-4"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              quality={IMAGE_QUALITY}
              priority={index < 4}
              className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current?.alt ?? t("open")}
        onClose={() => setOpenIndex(null)}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === dialogRef.current) close()
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-ink/92 backdrop:backdrop-blur-sm"
      >
        {current ? (
          <div className="relative flex size-full flex-col items-center justify-center px-3 pb-16 pt-16 sm:px-8">
            <motion.div
              key={current.id}
              drag={reduced || count < 2 ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              dragTransition={{ bounceStiffness: 420, bounceDamping: 32 }}
              style={{ x }}
              onDragEnd={handleDragEnd}
              data-cursor="drag"
              className="flex max-h-full max-w-full cursor-grab touch-pan-y select-none items-center justify-center active:cursor-grabbing"
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                quality={IMAGE_QUALITY}
                priority
                draggable={false}
                className="pointer-events-none max-h-[min(82dvh,920px)] w-auto max-w-[min(96vw,1400px)] object-contain shadow-[0_24px_80px_-28px_rgba(0,0,0,0.65)]"
              />
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-4 pb-5 pt-10 bg-gradient-to-t from-black/70 to-transparent">
              <p className="max-w-2xl text-center text-sm text-white/90 sm:text-base">
                {current.alt}
              </p>
              <p
                aria-live="polite"
                className="font-label text-xs tracking-wide text-white/55 uppercase"
              >
                {t("counter", {
                  current: (openIndex ?? 0) + 1,
                  total: visible.length,
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              data-cursor="open"
              className="absolute end-3 top-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color] duration-100 ease-out hover:bg-white/20 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 sm:end-5 sm:top-5"
            >
              <X aria-hidden className="size-5" />
            </button>

            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t("prev")}
                  data-cursor="open"
                  className="absolute start-2 top-1/2 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color] duration-100 ease-out hover:bg-white/20 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 sm:inline-flex sm:size-12"
                >
                  <ChevronLeft aria-hidden className="size-6 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t("next")}
                  data-cursor="open"
                  className="absolute end-2 top-1/2 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color] duration-100 ease-out hover:bg-white/20 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 sm:inline-flex sm:size-12"
                >
                  <ChevronRight aria-hidden className="size-6 rtl:rotate-180" />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  )
}
