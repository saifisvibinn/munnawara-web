"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { skipNextRouteTransition } from "@/components/landing/LogoRouteTransition"
import { cn } from "@/lib/cn"
import { gsap } from "gsap"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * Fired by the nav and CTA band "Get a quote" buttons. The quote flow now lives
 * on its own page, so this simply navigates there.
 */
export const OPEN_QUOTE_EVENT = "munawwara:open-quote"

const BusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-white">
    <path
      d="M4 15.5V8.75C4 6.12665 6.12665 4 8.75 4H15.25C17.8734 4 20 6.12665 20 8.75V15.5M4 15.5H20M4 15.5V17.25C4 17.6642 4.33579 18 4.75 18H6.5M20 15.5V17.25C20 17.6642 19.6642 18 19.25 18H17.5M7.5 18.5C7.5 19.3284 6.82843 20 6 20C5.17157 20 4.5 19.3284 4.5 18.5C4.5 17.6716 5.17157 17 6 17C6.82843 17 7.5 17.6716 7.5 18.5ZM19.5 18.5C19.5 19.3284 18.8284 20 18 20C17.1716 20 16.5 19.3284 16.5 18.5C16.5 17.6716 17.1716 17 18 17C18.8284 17 19.5 17.6716 19.5 18.5ZM7 7.5H17M7 10.5H17"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Floating "Request a quote" pill: shows near the end of a page, never on /quote or beside another quote CTA. */
export const FloatingQuoteCta = () => {
  const t = useTranslations("common")
  const locale = useLocale()
  const isRtl = locale === "ar"
  const reduced = useReducedMotion()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  const ctaRef = useRef<HTMLAnchorElement>(null)
  const textWrapRef = useRef<HTMLSpanElement>(null)
  const busIconRef = useRef<HTMLSpanElement>(null)
  const appearTlRef = useRef<gsap.core.Timeline | null>(null)
  const textWidthRef = useRef(0)
  const visibleRef = useRef(false)

  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  // Nav / CTA band buttons dispatch this event — take the visitor to the quote page.
  useEffect(() => {
    const go = () => {
      skipNextRouteTransition()
      router.prefetch("/quote")
      router.push("/quote")
    }
    window.addEventListener(OPEN_QUOTE_EVENT, go)
    return () => window.removeEventListener(OPEN_QUOTE_EVENT, go)
  }, [router])

  useEffect(() => {
    // Warm the quote route only once the current page has settled.
    const warm = () => {
      router.prefetch("/quote")
      void import("@/components/forms/QuoteWizard")
    }
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(warm, 2500)
    return () => clearTimeout(id)
  }, [router])

  useEffect(() => {
    if (pathname === "/quote" || pathname.startsWith("/quote/")) {
      setVisible(false)
      return
    }

    let frame = 0
    const inView = (el: Element) => {
      const box = el.getBoundingClientRect()
      return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight
    }

    // Re-read the live DOM every time — the page under this component changes on navigation.
    const evaluate = () => {
      frame = 0
      const body = document.body.classList
      if (
        body.contains("is-loading") ||
        body.contains("is-transitioning") ||
        body.contains("is-page-transitioning")
      ) {
        setVisible(false)
        return
      }

      const doc = document.documentElement
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight)
      const footer = document.querySelector("footer")
      const nearEnd =
        remaining <= window.innerHeight * 0.6 || (footer ? inView(footer) : false)

      const main = document.querySelector("main")
      const quoteCtaOnScreen =
        !!main &&
        [
          ...main.querySelectorAll('a[href$="/quote"], [data-quote-section]'),
        ].some(inView)

      setVisible(nearEnd && !quoteCtaOnScreen)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(evaluate)
    }

    setVisible(false)
    // Let the new route paint and settle (images, pinned sections) before measuring.
    const settle = window.setTimeout(schedule, 400)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const bodyObserver = new MutationObserver(schedule)
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    const sizeObserver = new ResizeObserver(schedule)
    sizeObserver.observe(document.documentElement)

    return () => {
      window.clearTimeout(settle)
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      bodyObserver.disconnect()
      sizeObserver.disconnect()
    }
  }, [pathname])

  useLayoutEffect(() => {
    const cta = ctaRef.current
    const textWrap = textWrapRef.current
    const busIcon = busIconRef.current
    if (!cta || !textWrap || !busIcon) return

    appearTlRef.current?.kill()
    appearTlRef.current = null

    if (reduced) {
      gsap.set(cta, { opacity: 1, scale: 1, y: 0, clearProps: "transform" })
      gsap.set(textWrap, { width: "auto", clearProps: "width" })
      gsap.set(busIcon, { opacity: 1, scale: 1 })
      return
    }

    gsap.set(textWrap, { width: "auto" })
    textWidthRef.current = textWrap.scrollWidth

    gsap.set(cta, { opacity: 0, scale: 0, y: "100%" })
    gsap.set(textWrap, { width: 0 })
    gsap.set(busIcon, { opacity: 0, scale: 0.5 })

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } })
    tl.to(cta, { opacity: 1, scale: 1, y: 0, duration: 0.45 }, 0)
    tl.to(textWrap, { width: textWidthRef.current, duration: 0.55 }, 0.12)
    tl.to(busIcon, { opacity: 1, scale: 1, duration: 0.35 }, 0.22)
    appearTlRef.current = tl

    if (visibleRef.current) tl.progress(1)

    return () => {
      tl.kill()
      if (appearTlRef.current === tl) appearTlRef.current = null
    }
  }, [reduced, locale, t])

  useEffect(() => {
    if (reduced) {
      const cta = ctaRef.current
      const textWrap = textWrapRef.current
      const busIcon = busIconRef.current
      if (!cta || !textWrap || !busIcon) return
      gsap.set(cta, { opacity: visible ? 1 : 0, scale: 1, y: 0 })
      gsap.set(textWrap, { width: visible ? "auto" : 0 })
      gsap.set(busIcon, { opacity: visible ? 1 : 0, scale: 1 })
      return
    }
    const tl = appearTlRef.current
    if (!tl) return
    if (visible) tl.play()
    else tl.reverse()
  }, [visible, reduced])

  return (
    <div
      data-floating-quote-chrome
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[50] flex justify-center px-4 sm:bottom-6"
      aria-hidden={!visible}
    >
      <Link
        ref={ctaRef}
        href="/quote"
        data-no-route-transition
        tabIndex={visible ? 0 : -1}
        aria-label={t("requestQuote")}
        onClick={() => skipNextRouteTransition()}
        className={cn(
          "font-label pointer-events-auto inline-flex h-14 origin-bottom cursor-pointer items-center overflow-hidden rounded-full border border-ink/10 bg-surface-muted/80 text-sm font-medium text-ink shadow-md backdrop-blur-md transition-[border-color,background-color,box-shadow] hover:border-orange/40 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
          isRtl ? "flex-row-reverse pe-0.5 ps-1" : "ps-0.5 pe-1",
          !visible && "pointer-events-none",
        )}
        style={reduced ? undefined : { opacity: 0 }}
      >
        <span
          ref={textWrapRef}
          className={cn(
            "inline-flex h-14 items-center overflow-hidden whitespace-nowrap",
            reduced ? "w-auto" : "w-0",
          )}
        >
          <span className={cn("px-5", isRtl ? "text-end" : "text-start")}>
            {t("requestQuote")}
          </span>
        </span>
        <span className="relative inline-flex size-[3.35rem] shrink-0 items-center justify-center rounded-full bg-black text-white">
          <span
            ref={busIconRef}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              reduced ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <BusIcon />
          </span>
        </span>
      </Link>
    </div>
  )
}
