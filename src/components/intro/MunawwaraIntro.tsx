"use client"

import {
  INTRO_COLORS,
  INTRO_DURATION,
  INTRO_EASE,
  INTRO_SKY_SRC,
  INTRO_STORAGE_KEY,
} from "@/components/intro/introConfig"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { gsap } from "gsap"
import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type MunawwaraIntroProps = {
  enabled?: boolean
  forcePlay?: boolean
  onComplete?: () => void
}

const hasSeenIntro = (): boolean => {
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1")
  } catch {
    // ignore
  }
}

const setIntroActive = (active: boolean) => {
  document.documentElement.toggleAttribute("data-intro-active", active)
  if (!active) document.documentElement.removeAttribute("data-intro-ready")
  document.body.style.overflow = active ? "hidden" : ""
}

const removeBootOverlay = () => {
  document.getElementById("intro-boot")?.remove()
}

const flipTo = (fromEl: HTMLElement, toEl: HTMLElement) => {
  const from = fromEl.getBoundingClientRect()
  const to = toEl.getBoundingClientRect()
  if (from.width < 4 || to.width < 4) return { x: 0, y: 0, scale: 1 }
  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scale: to.width / from.width,
  }
}

/**
 * Cinematic intro: real logo-full.png settles, then FLIPs into the landing seat
 * (same motion language as the original GSAP morph — correct asset).
 */
export const MunawwaraIntro = ({
  enabled = true,
  forcePlay = false,
  onComplete,
}: MunawwaraIntroProps) => {
  const reduced = useReducedMotion()
  const [shouldPlay, setShouldPlay] = useState(false)
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const completedRef = useRef(false)

  useLayoutEffect(() => {
    setMounted(true)
    if (!enabled) {
      removeBootOverlay()
      return
    }
    if (!(forcePlay || !hasSeenIntro())) {
      removeBootOverlay()
      setIntroActive(false)
      document.documentElement.removeAttribute("data-logo-in-header")
      // Reveal landing logo for returning visitors
      const lockup = document.querySelector<HTMLElement>("[data-brand-lockup]")
      const copy = document.querySelector<HTMLElement>("[data-brand-copy]")
      if (lockup) gsap.set(lockup, { opacity: 1 })
      if (copy) gsap.set(copy, { opacity: 1, y: 0 })
      return
    }
    setIntroActive(true)
    setShouldPlay(true)
  }, [enabled, forcePlay])

  const handleComplete = () => {
    if (completedRef.current) return
    completedRef.current = true
    markIntroSeen()
    removeBootOverlay()
    setIntroActive(false)
    const siteLogo = document.querySelector<HTMLElement>("[data-site-logo]")
    if (siteLogo) gsap.set(siteLogo, { opacity: 0 })
    const lockup = document.querySelector<HTMLElement>("[data-brand-lockup]")
    const copy = document.querySelector<HTMLElement>("[data-brand-copy]")
    if (lockup) gsap.set(lockup, { opacity: 1, clearProps: "transform,clipPath" })
    if (copy) gsap.set(copy, { opacity: 1, y: 0 })
    setShouldPlay(false)
    onComplete?.()
  }

  const handleSkip = () => {
    timelineRef.current?.progress(1, false) ?? handleComplete()
  }

  useLayoutEffect(() => {
    if (!mounted || !shouldPlay || !rootRef.current || !logoWrapRef.current) return

    const root = rootRef.current
    const logoWrap = logoWrapRef.current
    const plate = plateRef.current
    const brandTarget = document.querySelector<HTMLElement>("[data-brand-logo]")
    const brandLockup = document.querySelector<HTMLElement>("[data-brand-lockup]")
    const brandCopy = document.querySelector<HTMLElement>("[data-brand-copy]")
    const siteLogo = document.querySelector<HTMLElement>("[data-site-logo]")
    const header = document.querySelector<HTMLElement>("header")
    const siteShell = document.querySelectorAll<HTMLElement>(
      "#main, footer, [data-whatsapp-fab]",
    )

    setIntroActive(true)
    document.documentElement.setAttribute("data-intro-ready", "")
    document.documentElement.removeAttribute("data-logo-in-header")

    if (siteLogo) gsap.set(siteLogo, { opacity: 0 })
    if (header) gsap.set(header, { autoAlpha: 0 })
    if (brandLockup) gsap.set(brandLockup, { opacity: 0 })
    if (brandCopy) gsap.set(brandCopy, { opacity: 0, y: 20 })
    gsap.set(siteShell, { autoAlpha: 0 })

    // Show intro logo first, then drop boot — no empty frame
    gsap.set(logoWrap, { opacity: 1, scale: 0.96, transformOrigin: "50% 50%" })
    requestAnimationFrame(() => removeBootOverlay())

    if (reduced) {
      if (brandLockup) gsap.set(brandLockup, { opacity: 1 })
      if (brandCopy) gsap.set(brandCopy, { opacity: 1, y: 0 })
      const quick = gsap.timeline({ onComplete: handleComplete })
      quick.to(plate, { opacity: 0, duration: 0.25 }, 0.1)
      quick.to(siteShell, { autoAlpha: 1, duration: 0.3 }, 0.1)
      if (header) quick.set(header, { autoAlpha: 0 }, 0)
      quick.to(root, { opacity: 0, duration: 0.15 }, 0.25)
      timelineRef.current = quick
      return () => quick.kill()
    }

    const tl = gsap.timeline({ onComplete: handleComplete })
    timelineRef.current = tl

    tl.to(logoWrap, { scale: 1, duration: INTRO_DURATION.settle, ease: INTRO_EASE.reveal }, 0)
    tl.to(logoWrap, { scale: 1.03, duration: 0.35, ease: "power1.out" }, INTRO_DURATION.settle)

    const morphAt = INTRO_DURATION.settle + INTRO_DURATION.hold

    // Reveal page under the morph (header stays hidden via CSS until scroll)
    tl.to(plate, { opacity: 0, duration: INTRO_DURATION.siteReveal, ease: INTRO_EASE.site }, morphAt)
    tl.to(
      siteShell,
      { autoAlpha: 1, duration: INTRO_DURATION.siteReveal, ease: INTRO_EASE.site },
      morphAt,
    )

    // Classic FLIP into landing seat (same asset)
    tl.to(
      logoWrap,
      {
        duration: INTRO_DURATION.morph,
        ease: INTRO_EASE.morph,
        x: () => (brandTarget ? flipTo(logoWrap, brandTarget).x : 0),
        y: () => (brandTarget ? flipTo(logoWrap, brandTarget).y : 0),
        scale: () => (brandTarget ? flipTo(logoWrap, brandTarget).scale : 1),
      },
      morphAt,
    )

    // Crossfade onto parked landing logo — brand visible BEFORE intro fades
    if (brandLockup) {
      tl.set(brandLockup, { opacity: 1 }, morphAt + INTRO_DURATION.morph - 0.12)
    }
    tl.to(
      logoWrap,
      { opacity: 0, duration: 0.2, ease: "power1.in" },
      morphAt + INTRO_DURATION.morph - 0.1,
    )

    if (brandCopy) {
      tl.to(
        brandCopy,
        { opacity: 1, y: 0, duration: INTRO_DURATION.copy, ease: INTRO_EASE.reveal },
        morphAt + INTRO_DURATION.morph - 0.05,
      )
    }

    tl.to(root, { opacity: 0, duration: 0.15 }, morphAt + INTRO_DURATION.morph + 0.15)

    return () => {
      tl.kill()
      timelineRef.current = null
      if (!completedRef.current) {
        setIntroActive(false)
        gsap.set(siteShell, { clearProps: "opacity,visibility" })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, shouldPlay, reduced])

  if (!mounted || !shouldPlay) return null

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Brand introduction"
    >
      <div
        ref={plateRef}
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: INTRO_COLORS.plate }}
        aria-hidden
      >
        <img
          src={INTRO_SKY_SRC}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 50% 42%, rgb(255 248 240 / 0.2), transparent 72%)",
          }}
        />
      </div>
      <div
        ref={logoWrapRef}
        className="relative z-10 w-[min(78vw,22rem)] will-change-transform sm:w-[min(56vw,24rem)] md:w-[min(38vw,26rem)]"
      >
        <img
          src="/logo-full.png"
          alt="DMTC — Durrah Al-Munawwara"
          width={800}
          height={1000}
          className="h-auto w-full object-contain"
          draggable={false}
        />
      </div>
      <button
        type="button"
        onClick={handleSkip}
        className={cn(
          "font-label absolute end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20",
          "rounded-full px-3 py-1.5 text-[11px] tracking-wide text-ink/40",
          "transition hover:text-ink/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink/30",
          "sm:end-8 sm:bottom-8",
        )}
        aria-label="Skip introduction"
      >
        Skip
      </button>
    </div>,
    document.body,
  )
}
