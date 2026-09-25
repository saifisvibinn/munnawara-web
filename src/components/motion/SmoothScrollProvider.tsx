"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"

gsap.registerPlugin(ScrollTrigger)

type WindowWithLenis = Window & { __lenis?: Lenis }

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      // Lower lerp = more glide / inertia
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: false,
    })

    ;(window as WindowWithLenis).__lenis = lenis

    lenis.on("scroll", ScrollTrigger.update)

    const handleTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(handleTick)
    gsap.ticker.lagSmoothing(0)

    const syncGate = () => {
      const locked =
        document.body.classList.contains("is-loading") ||
        document.body.classList.contains("is-transitioning") ||
        document.body.classList.contains("is-page-transitioning")
      if (locked) lenis.stop()
      else lenis.start()
    }

    syncGate()
    const observer = new MutationObserver(syncGate)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
      gsap.ticker.remove(handleTick)
      const w = window as WindowWithLenis
      if (w.__lenis === lenis) delete w.__lenis
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
