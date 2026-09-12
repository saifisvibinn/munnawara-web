"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

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

export const FloatingQuoteCta = () => {
  const t = useTranslations("common")
  const locale = useLocale()
  const isRtl = locale === "ar"
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const textWrapRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const hero = document.getElementById("hero")
    if (!hero) {
      setVisible(true)
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=48",
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    })

    return () => trigger.kill()
  }, [])

  useEffect(() => {
    const cta = ctaRef.current
    const textWrap = textWrapRef.current
    const icon = iconRef.current
    if (!cta || !textWrap || !icon) return

    timelineRef.current?.kill()
    timelineRef.current = null

    if (reduced) {
      gsap.set(cta, { opacity: visible ? 1 : 0, scale: 1, clearProps: "width" })
      gsap.set(textWrap, { width: "auto" })
      gsap.set(icon, { opacity: 1, scale: 1 })
      return
    }

    if (!visible) {
      gsap.set(cta, { opacity: 0, scale: 0.92 })
      gsap.set(textWrap, { width: 0 })
      gsap.set(icon, { opacity: 0, scale: 0.6 })
      return
    }

    // Measure label width, then start collapsed as a circle
    gsap.set(textWrap, { width: "auto" })
    const fullTextWidth = textWrap.scrollWidth
    gsap.set(textWrap, { width: 0 })
    gsap.set(icon, { opacity: 0, scale: 0.6 })
    gsap.set(cta, { opacity: 0.85, scale: 0.92 })

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    timelineRef.current = tl

    // Airvoir-style: circle appears, then expands into labeled pill
    tl.to(cta, { opacity: 1, scale: 1, duration: 0.35 }, 0)
    tl.to(textWrap, { width: fullTextWidth, duration: 0.55 }, 0.12)
    tl.to(icon, { opacity: 1, scale: 1, duration: 0.35 }, 0.28)

    return () => {
      tl.kill()
      if (timelineRef.current === tl) timelineRef.current = null
    }
  }, [visible, reduced, locale])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[35] flex justify-center px-4 sm:bottom-6"
      aria-hidden={!visible}
    >
      <Link
        ref={ctaRef}
        href="/contact"
        tabIndex={visible ? 0 : -1}
        className={cn(
          "font-label pointer-events-auto inline-flex h-14 items-center overflow-hidden rounded-full border border-ink/10 bg-zinc-100/80 text-sm font-medium text-ink shadow-md backdrop-blur-md transition-[border-color,background-color] hover:border-orange/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
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
        <span
          ref={iconRef}
          className={cn(
            "inline-flex size-[3.35rem] shrink-0 items-center justify-center rounded-full bg-ink text-white",
            reduced ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        >
          <BusIcon />
        </span>
      </Link>
    </div>
  )
}
