"use client"

import type { GalleryPhoto } from "@/content"
import type { PhotoCategory } from "@/content/photoManifest"
import { cn } from "@/lib/cn"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

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
  const [tab, setTab] = useState<TabId>("all")
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelId = useId()

  const visible = useMemo(() => {
    const categories = TABS.find((entry) => entry.id === tab)?.categories ?? []
    return photos.filter((photo) => categories.includes(photo.category))
  }, [photos, tab])

  const isOpen = openIndex !== null
  const current = isOpen ? visible[openIndex] : undefined

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

  // Open and close the native <dialog>; lock page scroll while it is open.
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
        className="flex flex-wrap gap-2"
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
              className={cn(
                "min-h-11 cursor-pointer rounded-full border px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                selected
                  ? "border-orange bg-orange text-black"
                  : "border-border bg-surface-elevated text-ink hover:border-ink-muted",
              )}
            >
              {t(entry.id)}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${tab}`}
        className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3"
      >
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`${t("open")}: ${photo.alt}`}
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
      >
        {current ? (
          <div className="relative flex size-full items-center justify-center">
            <Image
              key={current.id}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="92vw"
              priority
              className="max-h-[82dvh] w-auto max-w-[92vw] rounded-lg object-contain"
            />
            <p
              aria-live="polite"
              className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80"
            >
              {t("counter", { current: (openIndex ?? 0) + 1, total: visible.length })}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute end-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              <X aria-hidden className="size-5" />
            </button>
            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t("prev")}
                  className="absolute start-3 top-1/2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                >
                  <ChevronLeft aria-hidden className="size-6 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t("next")}
                  className="absolute end-3 top-1/2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
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
