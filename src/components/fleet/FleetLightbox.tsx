"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

type FleetLightboxProps = {
  images: readonly string[]
  alt: string
  /** Index to show, or null when closed. */
  index: number | null
  onIndexChange: (index: number | null) => void
}

type WindowWithLenis = Window & { __lenis?: { stop: () => void; start: () => void } }

const SWIPE_THRESHOLD = 48

export const FleetLightbox = ({
  images,
  alt,
  index,
  onIndexChange,
}: FleetLightboxProps) => {
  const t = useTranslations("photoGallery")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const startX = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const isOpen = index !== null
  const count = images.length

  const step = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return
      onIndexChange((index + delta + count) % count)
    },
    [index, count, onIndexChange],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen) return
    closeRef.current?.focus()
    const lenis = (window as WindowWithLenis).__lenis
    const previousOverflow = document.body.style.overflow
    lenis?.stop()
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    const rtl = document.documentElement.dir === "rtl"
    if (event.key === "ArrowRight") step(rtl ? -1 : 1)
    else if (event.key === "ArrowLeft") step(rtl ? 1 : -1)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    startX.current = event.clientX
    setDragging(true)
  }
  const onPointerUp = (event: React.PointerEvent) => {
    if (startX.current === null) return
    const delta = event.clientX - startX.current
    startX.current = null
    setDragging(false)
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    const rtl = document.documentElement.dir === "rtl"
    // Swiping toward the reading end advances.
    const forward = rtl ? delta > 0 : delta < 0
    step(forward ? 1 : -1)
  }

  const src = index === null ? undefined : images[index]
  const controlClass =
    "inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"

  return (
    <dialog
      ref={dialogRef}
      aria-label={alt}
      onClose={() => onIndexChange(null)}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-white bg-black/95 backdrop:bg-black/95"
    >
      {src ? (
        <div className="relative flex size-full items-center justify-center">
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              startX.current = null
              setDragging(false)
            }}
            className={`relative -mt-6 h-[72dvh] w-[calc(100%-1.5rem)] max-w-6xl touch-pan-y select-none sm:w-[calc(100%-9rem)] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          >
            <Image
              key={src}
              src={src}
              alt={`${alt} ${(index ?? 0) + 1}`}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              draggable={false}
              priority
              className="rounded-lg object-contain"
            />
          </div>
          <p
            aria-live="polite"
            className="absolute inset-x-0 bottom-7 text-center sm:bottom-4 text-sm text-white/80"
          >
            {t("counter", { current: (index ?? 0) + 1, total: count })}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t("close")}
            className={`absolute end-4 top-4 ${controlClass}`}
          >
            <X aria-hidden className="size-5" />
          </button>
          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("prev")}
                className={`absolute bottom-4 start-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${controlClass}`}
              >
                <ChevronLeft aria-hidden className="size-6 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("next")}
                className={`absolute bottom-4 end-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${controlClass}`}
              >
                <ChevronRight aria-hidden className="size-6 rtl:rotate-180" />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </dialog>
  )
}
