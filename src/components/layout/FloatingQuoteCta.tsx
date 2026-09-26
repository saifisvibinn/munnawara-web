"use client"

import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { useLocale, useTranslations } from "next-intl"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react"

gsap.registerPlugin(ScrollTrigger)

export const OPEN_QUOTE_EVENT = "munawwara:open-quote"

const BusIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="text-white"
  >
    <path
      d="M4 15.5V8.75C4 6.12665 6.12665 4 8.75 4H15.25C17.8734 4 20 6.12665 20 8.75V15.5M4 15.5H20M4 15.5V17.25C4 17.6642 4.33579 18 4.75 18H6.5M20 15.5V17.25C20 17.6642 19.6642 18 19.25 18H17.5M7.5 18.5C7.5 19.3284 6.82843 20 6 20C5.17157 20 4.5 19.3284 4.5 18.5C4.5 17.6716 5.17157 17 6 17C6.82843 17 7.5 17.6716 7.5 18.5ZM19.5 18.5C19.5 19.3284 18.8284 20 18 20C17.1716 20 16.5 19.3284 16.5 18.5C16.5 17.6716 17.1716 17 18 17C18.8284 17 19.5 17.6716 19.5 18.5ZM7 7.5H17M7 10.5H17"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="text-ink"
  >
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const getLenis = () =>
  (window as Window & { __lenis?: Lenis }).__lenis

export const FloatingQuoteCta = () => {
  const t = useTranslations("common")
  const tQuote = useTranslations("quote")
  const locale = useLocale()
  const isRtl = locale === "ar"
  const reduced = useReducedMotion()
  const [scrollVisible, setScrollVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const scrollVisibleRef = useRef(false)

  const ctaRef = useRef<HTMLButtonElement>(null)
  const textWrapRef = useRef<HTMLSpanElement>(null)
  const busIconRef = useRef<HTMLSpanElement>(null)
  const closeIconRef = useRef<HTMLSpanElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const appearTlRef = useRef<gsap.core.Timeline | null>(null)
  const overlayTlRef = useRef<gsap.core.Timeline | null>(null)
  const textWidthRef = useRef(0)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    scrollVisibleRef.current = scrollVisible
  }, [scrollVisible])

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = getLenis()
    if (locked) {
      lenis?.stop()
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
      return
    }
    lenis?.start()
    document.documentElement.style.overflow = ""
    document.body.style.overflow = ""
  }, [])

  useEffect(() => {
    // Appear only after the AboutPreview headlines block
    // ("Safe, comfortable journeys…" / Arabic equivalent).
    const aboutGate =
      document.querySelector("[data-about-preview]") ??
      document.getElementById("about-preview-heading")?.closest("section")
    const quote = document.querySelector("[data-quote-section]")
    let pastAbout = false
    let overQuote = false

    const syncVisible = () => {
      if (openRef.current) return
      setScrollVisible(pastAbout && !overQuote)
    }

    const triggers: ScrollTrigger[] = []

    if (aboutGate) {
      triggers.push(
        ScrollTrigger.create({
          trigger: aboutGate,
          start: "bottom top+=48",
          onEnter: () => {
            pastAbout = true
            syncVisible()
          },
          onLeaveBack: () => {
            pastAbout = false
            syncVisible()
          },
          onRefresh: (self) => {
            pastAbout = self.scroll() >= self.start
            syncVisible()
          },
        }),
      )
    }

    if (quote) {
      triggers.push(
        ScrollTrigger.create({
          trigger: quote,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const next = self.isActive
            if (next === overQuote) return
            overQuote = next
            syncVisible()
          },
          onRefresh: (self) => {
            overQuote = self.isActive
            syncVisible()
          },
        }),
      )
    }

    syncVisible()
    ScrollTrigger.refresh()

    return () => {
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [])

  useLayoutEffect(() => {
    const cta = ctaRef.current
    const textWrap = textWrapRef.current
    const busIcon = busIconRef.current
    const closeIcon = closeIconRef.current
    if (!cta || !textWrap || !busIcon || !closeIcon) return

    appearTlRef.current?.kill()
    appearTlRef.current = null

    if (reduced) {
      gsap.set(cta, { opacity: 1, scale: 1, y: 0, clearProps: "transform" })
      gsap.set(textWrap, { width: "auto", clearProps: "width" })
      gsap.set(busIcon, { opacity: 1, scale: 1 })
      gsap.set(closeIcon, { opacity: 0, scale: 0.6 })
      return
    }

    gsap.set(textWrap, { width: "auto" })
    textWidthRef.current = textWrap.scrollWidth

    gsap.set(cta, { opacity: 0, scale: 0, y: "100%" })
    gsap.set(textWrap, { width: 0 })
    gsap.set(busIcon, { opacity: 0, scale: 0.5 })
    gsap.set(closeIcon, { opacity: 0, scale: 0.6 })

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut" },
    })
    tl.to(cta, { opacity: 1, scale: 1, y: 0, duration: 0.45 }, 0)
    tl.to(textWrap, { width: textWidthRef.current, duration: 0.55 }, 0.12)
    tl.to(busIcon, { opacity: 1, scale: 1, duration: 0.35 }, 0.22)

    appearTlRef.current = tl

    if (scrollVisibleRef.current || openRef.current) {
      tl.progress(1)
    }

    return () => {
      tl.kill()
      if (appearTlRef.current === tl) appearTlRef.current = null
    }
  }, [reduced, locale, t])

  useEffect(() => {
    if (open) return

    if (reduced) {
      const cta = ctaRef.current
      const textWrap = textWrapRef.current
      const busIcon = busIconRef.current
      if (!cta || !textWrap || !busIcon) return
      gsap.set(cta, { opacity: scrollVisible ? 1 : 0, scale: 1, y: 0 })
      gsap.set(textWrap, { width: scrollVisible ? "auto" : 0 })
      gsap.set(busIcon, { opacity: scrollVisible ? 1 : 0, scale: 1 })
      return
    }

    const tl = appearTlRef.current
    if (!tl) return
    if (scrollVisible) tl.play()
    else tl.reverse()
  }, [scrollVisible, open, reduced])

  const placeCircleAtButton = () => {
    const circle = circleRef.current
    const cta = ctaRef.current
    if (!circle || !cta) return
    const rect = cta.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    gsap.set(circle, {
      display: "block",
      width: size,
      height: size,
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
      xPercent: -50,
      yPercent: -50,
      borderRadius: "9999px",
      opacity: 1,
    })
  }

  const handleOpen = useCallback(() => {
    if (openRef.current) return
    setOpen(true)
    lockScroll(true)

    const circle = circleRef.current
    const panel = panelRef.current
    const textWrap = textWrapRef.current
    const busIcon = busIconRef.current
    const closeIcon = closeIconRef.current
    if (!circle || !panel || !textWrap || !busIcon || !closeIcon) return

    overlayTlRef.current?.kill()

    // External opens (nav / CTA band) may fire while the floating pill is hidden —
    // seat it so the circle expansion has a real origin.
    appearTlRef.current?.progress(1)
    gsap.set(ctaRef.current, { opacity: 1, scale: 1, y: 0 })

    if (reduced) {
      gsap.set(panel, { display: "flex", opacity: 1 })
      gsap.set(circle, { display: "none" })
      gsap.set(textWrap, { width: 0 })
      gsap.set(busIcon, { opacity: 0 })
      gsap.set(closeIcon, { opacity: 1, scale: 1 })
      gsap.set(ctaRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        backgroundColor: "rgb(255,255,255)",
      })
      return
    }

    appearTlRef.current?.pause()
    placeCircleAtButton()
    gsap.set(panel, { display: "flex", opacity: 0 })

    const cover = Math.hypot(window.innerWidth, window.innerHeight) * 2.2

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } })
    overlayTlRef.current = tl

    tl.to(textWrap, { width: 0, duration: 0.28 }, 0)
    tl.to(busIcon, { opacity: 0, scale: 0.5, duration: 0.2 }, 0)
    tl.to(
      ctaRef.current,
      {
        backgroundColor: "rgb(255,255,255)",
        borderColor: "rgba(26,18,16,0.12)",
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.25,
      },
      0,
    )
    tl.to(closeIcon, { opacity: 1, scale: 1, duration: 0.25 }, 0.12)
    tl.to(
      circle,
      { width: cover, height: cover, duration: 0.7, ease: "power2.inOut" },
      0,
    )
    tl.to(panel, { opacity: 1, duration: 0.35 }, 0.4)
  }, [lockScroll, reduced])

  const handleClose = useCallback(() => {
    if (!openRef.current) return

    const circle = circleRef.current
    const panel = panelRef.current
    const textWrap = textWrapRef.current
    const busIcon = busIconRef.current
    const closeIcon = closeIconRef.current
    const cta = ctaRef.current
    if (!circle || !panel || !textWrap || !busIcon || !closeIcon || !cta) {
      setOpen(false)
      lockScroll(false)
      return
    }

    overlayTlRef.current?.kill()

    const finishClose = () => {
      setOpen(false)
      lockScroll(false)
      gsap.set(panel, { display: "none", opacity: 0 })
      gsap.set(circle, { display: "none" })
      gsap.set(closeIcon, { opacity: 0, scale: 0.6 })
      gsap.set(cta, {
        backgroundColor: "",
        borderColor: "",
        paddingLeft: "",
        paddingRight: "",
        clearProps: "backgroundColor,borderColor,paddingLeft,paddingRight",
      })

      if (reduced) {
        gsap.set(textWrap, { width: scrollVisibleRef.current ? "auto" : 0 })
        gsap.set(busIcon, {
          opacity: scrollVisibleRef.current ? 1 : 0,
          scale: 1,
        })
        return
      }

      // Restore appear timeline to current scroll visibility
      const appear = appearTlRef.current
      if (!appear) return
      if (scrollVisibleRef.current) {
        gsap.set(textWrap, { width: textWidthRef.current })
        gsap.set(busIcon, { opacity: 1, scale: 1 })
        gsap.set(cta, { opacity: 1, scale: 1, y: 0 })
        appear.progress(1)
      } else {
        gsap.set(textWrap, { width: 0 })
        gsap.set(busIcon, { opacity: 0, scale: 0.5 })
        gsap.set(cta, { opacity: 0, scale: 0, y: "100%" })
        appear.progress(0)
      }
    }

    if (reduced) {
      finishClose()
      return
    }

    placeCircleAtButton()
    const cover = Math.hypot(window.innerWidth, window.innerHeight) * 2.2
    const rect = cta.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)

    gsap.set(circle, {
      display: "block",
      width: cover,
      height: cover,
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
    })

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: finishClose,
    })
    overlayTlRef.current = tl

    tl.to(panel, { opacity: 0, duration: 0.25 }, 0)
    tl.to(closeIcon, { opacity: 0, scale: 0.6, duration: 0.2 }, 0)
    tl.to(
      circle,
      { width: size, height: size, duration: 0.65, ease: "power2.inOut" },
      0.05,
    )
    tl.to(
      cta,
      {
        backgroundColor: "rgba(244,244,245,0.8)",
        duration: 0.25,
      },
      0.35,
    )
    tl.to(busIcon, { opacity: 1, scale: 1, duration: 0.25 }, 0.45)
    tl.to(
      textWrap,
      {
        width: scrollVisibleRef.current ? textWidthRef.current : 0,
        duration: 0.35,
      },
      0.5,
    )
  }, [lockScroll, reduced])

  useEffect(() => {
    const handleExternalOpen = () => handleOpen()
    window.addEventListener(OPEN_QUOTE_EVENT, handleExternalOpen)
    return () => window.removeEventListener(OPEN_QUOTE_EVENT, handleExternalOpen)
  }, [handleOpen])

  useEffect(() => {
    if (!open) return

    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, handleClose])

  useEffect(() => {
    return () => {
      lockScroll(false)
      overlayTlRef.current?.kill()
    }
  }, [lockScroll])

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (open) handleClose()
    else handleOpen()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (open) handleClose()
      else handleOpen()
    }
  }

  const chromeVisible = open || scrollVisible

  return (
    <>
      <div
        ref={circleRef}
        aria-hidden
        className="pointer-events-none fixed z-[48] hidden bg-white"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-overlay-heading"
        className="fixed inset-0 z-[49] hidden overflow-y-auto bg-white"
        style={{ opacity: 0 }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-[52rem] flex-col justify-center px-5 py-24 sm:px-8 md:px-10 md:py-28">
          <h2
            id="quote-overlay-heading"
            className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            {tQuote("title")}
          </h2>
          <div className="mt-8 sm:mt-10">
            <QuoteRequestForm
              variant="overlay"
              formId="quote-overlay"
            />
          </div>
        </div>
      </div>

      <div
        data-floating-quote-chrome
        className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[50] flex justify-center px-4 sm:bottom-6"
        aria-hidden={!chromeVisible}
      >
        <button
          ref={ctaRef}
          type="button"
          tabIndex={chromeVisible ? 0 : -1}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={cn(
            "font-label pointer-events-auto inline-flex h-14 origin-bottom cursor-pointer items-center overflow-hidden rounded-full border border-ink/10 text-sm font-medium text-ink transition-[border-color,background-color,box-shadow,padding] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
            open
              ? "bg-white p-0 shadow-sm hover:border-ink/20"
              : cn(
                  "bg-zinc-100/80 shadow-md backdrop-blur-md hover:border-orange/40 hover:bg-white",
                  isRtl ? "flex-row-reverse pe-0.5 ps-1" : "ps-0.5 pe-1",
                ),
            !chromeVisible && "pointer-events-none",
          )}
          style={reduced ? undefined : { opacity: 0 }}
          aria-label={open ? t("close") : t("requestQuote")}
          aria-expanded={open}
          aria-controls="quote-overlay"
        >
          <span
            ref={textWrapRef}
            className={cn(
              "inline-flex h-14 items-center overflow-hidden whitespace-nowrap",
              reduced && !open ? "w-auto" : "w-0",
            )}
          >
            <span className={cn("px-5", isRtl ? "text-end" : "text-start")}>
              {t("requestQuote")}
            </span>
          </span>
          <span
            className={cn(
              "relative inline-flex size-[3.35rem] shrink-0 items-center justify-center rounded-full",
              open ? "bg-transparent text-ink" : "bg-ink text-white",
            )}
          >
            <span
              ref={busIconRef}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                reduced && !open ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            >
              <BusIcon />
            </span>
            <span
              ref={closeIconRef}
              className="absolute inset-0 flex items-center justify-center opacity-0"
              aria-hidden
            >
              <CloseIcon />
            </span>
          </span>
        </button>
      </div>
    </>
  )
}
