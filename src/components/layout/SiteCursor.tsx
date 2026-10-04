"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

type CursorMode = "idle" | "open" | "drag" | "play" | "hide"

const ACTION_SELECTOR =
  'a[href], button, summary, [role="button"], label[for], .cursor-pointer, [data-cursor="open"]'
const DRAG_SELECTOR =
  '[data-cursor="drag"], [data-draggable], [draggable="true"], .cursor-grab, [class*="cursor-grab"]'
const PLAY_SELECTOR = '[data-cursor="play"]'
const HIDE_SELECTOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), iframe, video[controls], audio[controls], [data-native-cursor], [data-cursor="hide"]'

const isLoadingSurface = () => {
  const body = document.body
  return (
    body.classList.contains("is-loading") ||
    body.classList.contains("is-page-transitioning") ||
    body.classList.contains("is-transitioning")
  )
}

const Bracket = ({ mirror = false }: { mirror?: boolean }) => (
  <svg
    className={`site-cursor__bracket${mirror ? " site-cursor__bracket--end" : ""}`}
    width="6"
    height="20"
    viewBox="0 0 6 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5.43 0.5H0.5V19.07H5.43"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeMiterlimit="10"
    />
  </svg>
)

const resolveMode = (target: EventTarget | null): CursorMode => {
  if (!(target instanceof Element)) return "idle"
  if (target.closest(HIDE_SELECTOR)) return "hide"
  if (target.closest(PLAY_SELECTOR)) return "play"
  if (target.closest(DRAG_SELECTOR)) return "drag"
  if (target.closest(ACTION_SELECTOR)) return "open"
  return "idle"
}

export const SiteCursor = () => {
  const t = useTranslations("cursor")
  const locale = useLocale()
  const isArabic = locale === "ar"
  const reducedMotion = useReducedMotion()
  const markRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const drawn = useRef({ x: -100, y: -100 })
  const rafRef = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<CursorMode>("idle")
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setEnabled(media.matches && !reducedMotion)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) return

    const mark = markRef.current
    if (!mark) return

    const tick = () => {
      const ease = 0.55
      drawn.current.x += (pos.current.x - drawn.current.x) * ease
      drawn.current.y += (pos.current.y - drawn.current.y) * ease
      mark.style.transform = `translate3d(${drawn.current.x}px, ${drawn.current.y}px, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const handlePointerMove = (event: PointerEvent) => {
      pos.current.x = event.clientX
      pos.current.y = event.clientY
      setVisible(true)
      setLoading(isLoadingSurface())
      setMode(resolveMode(event.target))
    }

    const handlePointerOver = (event: PointerEvent) => {
      setLoading(isLoadingSurface())
      setMode(resolveMode(event.target))
    }

    const handlePointerLeave = () => {
      setVisible(false)
      setMode("idle")
    }

    const observer = new MutationObserver(() => {
      setLoading(isLoadingSurface())
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    })

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerover", handlePointerOver, { passive: true })
    document.documentElement.addEventListener("mouseleave", handlePointerLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerover", handlePointerOver)
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave)
    }
  }, [enabled])

  if (!enabled) return null

  const label =
    mode === "open"
      ? t("click")
      : mode === "drag"
        ? t("drag")
        : mode === "play"
          ? t("play")
          : t("scroll")

  // Loader / route bloom: no label. Native OS cursor still shows.
  const shouldRenderLabel = visible && !loading && mode !== "hide"

  return (
    <div
      className="site-cursor"
      aria-hidden="true"
      data-visible={shouldRenderLabel ? "true" : "false"}
      data-mode={mode}
      data-loading={loading ? "true" : "false"}
    >
      <div ref={markRef} className="site-cursor__mark">
        {shouldRenderLabel ? (
          <div className="site-cursor__item" dir="ltr">
            <Bracket />
            <span
              className="site-cursor__label"
              dir={isArabic ? "rtl" : "ltr"}
              lang={locale}
            >
              {label}
            </span>
            <Bracket mirror />
          </div>
        ) : null}
      </div>
    </div>
  )
}
