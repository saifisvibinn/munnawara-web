"use client"

import type { GalleryPhoto } from "@/content"
import type { PhotoCategory } from "@/content/photoManifest"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { project } from "@/lib/appleMotion"
import { cn } from "@/lib/cn"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { AnimatePresence, motion, useMotionValue, type Variants } from "motion/react"
import { useTranslations } from "next-intl"
import { SiteImage as Image } from "@/components/ui/SiteImage"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

const SWIPE_DISTANCE = 72
const SWIPE_VELOCITY = 550

/** custom = visual direction: 1 = new photo enters from the right, -1 = from the left. */
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir * 64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -64, opacity: 0 }),
}

type TabId = "all" | "fleet" | "interior" | "workshop" | "facilities"

const TABS: readonly { id: TabId; categories: readonly PhotoCategory[] }[] = [
  { id: "all", categories: ["exterior", "interior", "workshop", "company"] },
  { id: "fleet", categories: ["exterior"] },
  { id: "interior", categories: ["interior"] },
  { id: "workshop", categories: ["workshop"] },
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
  const stripRef = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(1)
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

  /** Step by delta and slide in the matching direction (mirrored in RTL). */
  const go = useCallback(
    (delta: number) => {
      if (delta === 0) return
      const rtl = document.documentElement.dir === "rtl"
      setSlide((delta > 0) !== rtl ? 1 : -1)
      step(delta)
    },
    [step],
  )

  useEffect(() => {
    x.set(0)
    stripRef.current
      ?.querySelector("[data-active]")
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" })
  }, [openIndex, x, reduced])

  // Deep-link: /gallery?p=workshop-0331 opens that photo in the lightbox.
  // Read from the URL after mount (not useSearchParams), so the grid itself renders on the server.
  useEffect(() => {
    if (openedFromQuery.current) return
    const id = new URLSearchParams(window.location.search).get("p")
    if (!id) return
    const allCategories = TABS[0]?.categories ?? []
    const index = photos
      .filter((photo) => allCategories.includes(photo.category))
      .findIndex((photo) => photo.id === id)
    if (index < 0) return
    openedFromQuery.current = true
    setTab("all")
    setOpenIndex(index)
  }, [photos])

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
    go(forward ? 1 : -1)
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
    if (event.key === "ArrowRight") go(rtl ? -1 : 1)
    else if (event.key === "ArrowLeft") go(rtl ? 1 : -1)
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
              className={cn(
                "relative min-h-11 cursor-pointer px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                selected ? "text-ink" : "group text-ink-muted hover:text-ink",
              )}
            >
              {t(entry.id)}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-orange transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                  selected
                    ? "scale-x-100 opacity-100"
                    : "scale-x-50 opacity-0 group-hover:scale-x-75 group-hover:opacity-30",
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
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-surface-muted text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:mb-4"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
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
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-black/95"
      >
        {current ? (
          <div className="relative flex size-full flex-col items-center justify-center px-3 pb-28 pt-16 sm:px-8 sm:pb-32">
            <motion.div
              drag={reduced || count < 2 ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              dragTransition={{ bounceStiffness: 420, bounceDamping: 32 }}
              style={{ x }}
              onDragEnd={handleDragEnd}
              className="grid max-h-full max-w-full cursor-grab touch-pan-y select-none place-items-center active:cursor-grabbing"
            >
              <AnimatePresence initial={false} custom={slide} mode="popLayout">
                <motion.div
                  key={current.id}
                  custom={slide}
                  variants={reduced ? undefined : slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="[grid-area:1/1]"
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    width={current.width}
                    height={current.height}
                    sizes="100vw"
                    priority
                    draggable={false}
                    className="pointer-events-none max-h-[min(72dvh,880px)] w-auto max-w-[min(96vw,1400px)] rounded-xl object-contain shadow-[0_24px_80px_-28px_rgba(0,0,0,0.65)]"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Warm the neighbours so a swipe never waits on the network. */}
            {count > 1
              ? [visible[(openIndex! + 1) % count], visible[(openIndex! - 1 + count) % count]].map(
                  (photo) =>
                    photo ? (
                      <Image
                        key={`warm-${photo.id}`}
                        src={photo.src}
                        alt=""
                        aria-hidden
                        width={photo.width}
                        height={photo.height}
                        sizes="100vw"
                        loading="eager"
                        className="pointer-events-none absolute size-px opacity-0"
                      />
                    ) : null,
                )
              : null}

            {/* Mobile: tap the side thirds to step (arrow buttons are desktop-only). */}
            {count > 1 ? (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={() => go(-1)}
                  className="absolute inset-y-16 start-0 w-1/4 sm:hidden"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={() => go(1)}
                  className="absolute inset-y-16 end-0 w-1/4 sm:hidden"
                />
              </>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p
                aria-live="polite"
                className="font-label text-xs tracking-wide text-white/60 uppercase"
              >
                {t("counter", {
                  current: (openIndex ?? 0) + 1,
                  total: visible.length,
                })}
              </p>
              {count > 1 ? (
                <div
                  ref={stripRef}
                  className="flex max-w-full gap-2 overflow-x-auto px-1 pb-1 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {visible.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      data-active={index === openIndex ? "" : undefined}
                      aria-label={`${t("open")} ${index + 1}`}
                      aria-current={index === openIndex ? "true" : undefined}
                      onClick={() => go(index - (openIndex ?? 0))}
                      className={cn(
                        "relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-2 transition-[opacity,box-shadow] duration-200 focus-visible:outline-none sm:size-14",
                        index === openIndex
                          ? "opacity-100 ring-orange"
                          : "opacity-45 ring-transparent hover:opacity-80",
                      )}
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes="56px"
                        quality={75}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute end-3 top-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white shadow-md ring-1 ring-white/30 backdrop-blur-sm transition-[transform,background-color] duration-100 ease-out hover:bg-black/75 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 sm:end-5 sm:top-5"
            >
              <X aria-hidden className="size-5" />
            </button>

            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t("prev")}
                  className="absolute start-2 top-1/2 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color] duration-100 ease-out hover:bg-white/20 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 sm:inline-flex sm:size-12"
                >
                  <ChevronLeft aria-hidden className="size-6 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t("next")}
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
