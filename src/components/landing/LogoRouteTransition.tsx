"use client"

import { routing } from "@/i18n/routing"
import { usePathname } from "@/i18n/navigation"
import gsap from "gsap"
import { useEffect, useLayoutEffect, useRef } from "react"
import { LogoMark } from "./LogoMark"

/** Session flag so home can skip the long first-load intro on return visits. */
export const LOGO_INTRO_SEEN_KEY = "dmtc-logo-intro-seen"

/** Deliberate page-switch timing — slowed so the bloom reads as intentional. */
const TIMING = {
  spin: 0.72,
  bloom: 0.52,
  stagger: 0.055,
  rotation: 16,
  /** Beat at center after bloom / while destination warms */
  hold: 0.28,
  travel: 1.05,
  nav: 0.48,
  fade: 0.4,
  breathe: 1.65,
} as const

/** Must exceed bloom + wait + travel + handoff on slow networks. */
const SAFETY_MS = 12000
const PAGE_READY_MS = 6500
const TARGET_WAIT_MS = 1400

const markSeen = () => {
  try {
    sessionStorage.setItem(LOGO_INTRO_SEEN_KEY, "1")
  } catch {
    // ignore
  }
}

const stripLocale = (path: string) => {
  const cleaned = path.split("?")[0]?.split("#")[0] || "/"
  for (const locale of routing.locales) {
    if (cleaned === `/${locale}`) return "/"
    if (cleaned.startsWith(`/${locale}/`)) {
      return cleaned.slice(locale.length + 1) || "/"
    }
  }
  return cleaned || "/"
}

const resolveTarget = (preferHome: boolean) => {
  if (preferHome) {
    return (
      document.querySelector<HTMLElement>(".corner-logo") ||
      document.querySelector<HTMLElement>(".corner-target") ||
      document.querySelector<HTMLElement>("[data-site-logo]")
    )
  }
  return (
    document.querySelector<HTMLElement>("[data-site-logo]") ||
    document.querySelector<HTMLElement>(".corner-logo") ||
    document.querySelector<HTMLElement>(".corner-target")
  )
}

const waitForTarget = (
  preferHome: boolean,
  maxMs = TARGET_WAIT_MS,
): Promise<HTMLElement | null> =>
  new Promise((resolve) => {
    const started = performance.now()
    const tick = () => {
      const target = resolveTarget(preferHome)
      if (target) {
        resolve(target)
        return
      }
      if (performance.now() - started >= maxMs) {
        resolve(null)
        return
      }
      requestAnimationFrame(tick)
    }
    tick()
  })

const waitForImage = (image: HTMLImageElement) => {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve()
  }
  return new Promise<void>((resolve) => {
    const done = () => resolve()
    image.addEventListener("load", done, { once: true })
    image.addEventListener("error", done, { once: true })
  })
}

/**
 * Hold the cover until the destination route has painted and its above-the-fold
 * media is warm — then the logo morphs in over a settled page.
 */
const waitForDestinationReady = async (preferHome: boolean) => {
  // Two frames so RSC-committed DOM has layout before we measure / decode
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

  const fonts = document.fonts?.ready ?? Promise.resolve()
  const main = document.querySelector("main")
  const images = main
    ? Array.from(main.querySelectorAll("img")).map(waitForImage)
    : []
  const videos = main
    ? Array.from(main.querySelectorAll("video")).map((video) => {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          return Promise.resolve()
        }
        return new Promise<void>((resolve) => {
          const done = () => resolve()
          video.addEventListener("loadeddata", done, { once: true })
          video.addEventListener("error", done, { once: true })
          window.setTimeout(done, 2000)
        })
      })
    : []

  const assets = Promise.allSettled([fonts, ...images, ...videos]).then(
    () => undefined,
  )
  const failsafe = new Promise<void>((resolve) => {
    window.setTimeout(resolve, PAGE_READY_MS)
  })

  await Promise.race([assets, failsafe])
  return waitForTarget(preferHome)
}

/**
 * Viewport box of the painted mark inside a corner/chrome logo target.
 */
const markRect = (target: HTMLElement) => {
  const mark =
    (target.matches("svg")
      ? target
      : target.querySelector<SVGSVGElement>("svg")) ?? target
  const r = mark.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

/** Pin the flight SVG to an exact viewport box (no scale/x transform math). */
const pinFlightBox = (
  logo: SVGSVGElement,
  box: { left: number; top: number; width: number; height: number },
) => {
  gsap.set(logo, {
    position: "fixed",
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
    margin: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    transformOrigin: "0 0",
  })
}

const resetFlightLayout = (logo: SVGSVGElement) => {
  gsap.set(logo, {
    clearProps:
      "position,left,top,width,height,margin,x,y,scale,rotation,transform,transformOrigin",
  })
}

const isInternalNavClick = (event: MouseEvent, currentPath: string) => {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false

  const anchor = (event.target as Element | null)?.closest?.("a[href]")
  if (!(anchor instanceof HTMLAnchorElement)) return false
  if (anchor.hasAttribute("download") || anchor.target === "_blank") return false

  const href = anchor.getAttribute("href")
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false
  }

  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return false
  }

  if (url.origin !== window.location.origin) return false

  const nextPath = stripLocale(url.pathname)
  const here = stripLocale(currentPath)
  return nextPath !== here
}

const tweenIf = (
  timeline: gsap.core.Timeline,
  target: gsap.TweenTarget | null | undefined,
  vars: gsap.TweenVars,
  position?: gsap.Position,
) => {
  if (!target) return timeline
  return timeline.to(target, vars, position)
}

/**
 * Intentional logo bloom + morph into the top bar on each client-side page switch.
 * Cover shows on click; land waits until the destination page is warm.
 */
export const LogoRouteTransition = () => {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const isFirstPath = useRef(true)
  const runIdRef = useRef(0)
  const phaseRef = useRef<"idle" | "covering" | "landing">("idle")
  const bloomTlRef = useRef<gsap.core.Timeline | null>(null)
  const landTlRef = useRef<gsap.core.Timeline | null>(null)
  const breatheRef = useRef<gsap.core.Tween | null>(null)
  const safetyRef = useRef<number | null>(null)
  const pathnameRef = useRef(pathname)

  pathnameRef.current = pathname

  const clearSafety = () => {
    if (safetyRef.current !== null) {
      window.clearTimeout(safetyRef.current)
      safetyRef.current = null
    }
  }

  const getPetals = () => {
    const logo = logoRef.current
    if (!logo) return [] as SVGGElement[]
    return [4, 2, 1, 3, 5]
      .map((n) => logo.querySelector<SVGGElement>(`#route-logo-petal-${n}`))
      .filter((petal): petal is SVGGElement => petal !== null)
  }

  const dismissOverlay = () => {
    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const logo = logoRef.current
    if (!overlay) return
    overlay.setAttribute("data-active", "false")
    overlay.removeAttribute("data-locking")
    overlay.setAttribute("aria-hidden", "true")
    gsap.set(overlay, { autoAlpha: 0 })
    if (backdrop) gsap.set(backdrop, { autoAlpha: 1 })
    if (logo) resetFlightLayout(logo)
    document.body.classList.remove("is-page-transitioning")
  }

  const finish = (runId: number) => {
    if (runId !== runIdRef.current) return
    clearSafety()
    landTlRef.current = null
    bloomTlRef.current = null
    breatheRef.current?.kill()
    breatheRef.current = null
    dismissOverlay()
    phaseRef.current = "idle"
    markSeen()
  }

  const armSafety = (runId: number) => {
    clearSafety()
    safetyRef.current = window.setTimeout(() => {
      if (runId !== runIdRef.current) return
      landTlRef.current?.kill()
      bloomTlRef.current?.kill()
      breatheRef.current?.kill()
      finish(runId)
    }, SAFETY_MS)
  }

  const beginCover = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markSeen()
      return
    }
    if (phaseRef.current !== "idle") return

    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const logo = logoRef.current
    if (!overlay || !logo) return

    const runId = ++runIdRef.current
    phaseRef.current = "covering"

    bloomTlRef.current?.kill()
    landTlRef.current?.kill()
    breatheRef.current?.kill()
    bloomTlRef.current = null
    landTlRef.current = null
    breatheRef.current = null

    const petals = getPetals()

    document.body.classList.add("is-page-transitioning")
    overlay.setAttribute("data-active", "true")
    overlay.removeAttribute("data-locking")
    overlay.setAttribute("aria-hidden", "false")
    gsap.set(overlay, { autoAlpha: 1 })
    if (backdrop) gsap.set(backdrop, { autoAlpha: 1 })
    resetFlightLayout(logo)
    gsap.set(logo, {
      x: 0,
      y: 0,
      rotation: -120,
      scale: 0.72,
      opacity: 1,
      transformOrigin: "center center",
    })
    gsap.set(petals, {
      opacity: 0,
      scale: 0.12,
      rotation: (index) => (index % 2 ? -1 : 1) * TIMING.rotation,
      transformOrigin: "427.5px 427.5px",
    })

    armSafety(runId)

    bloomTlRef.current = gsap
      .timeline()
      .to(logo, {
        rotation: 0,
        scale: 1,
        duration: TIMING.spin,
        ease: "expo.out",
      })
      .to(
        petals,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: TIMING.bloom,
          stagger: TIMING.stagger,
          ease: "power3.out",
        },
        0.08,
      )
      .add(() => {
        if (runId !== runIdRef.current) return
        // Covering or landing-wait — keep the logo alive until travel starts
        if (phaseRef.current !== "covering" && phaseRef.current !== "landing") {
          return
        }
        if (breatheRef.current) return
        breatheRef.current = gsap.to(logo, {
          scale: 1.035,
          duration: TIMING.breathe,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        })
      })
  }

  const landIntoBar = async (nextPath: string) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markSeen()
      phaseRef.current = "idle"
      dismissOverlay()
      return
    }

    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const logo = logoRef.current
    if (!overlay || !logo) return

    if (phaseRef.current === "idle") {
      beginCover()
    }
    if (phaseRef.current === "idle") return

    const runId = runIdRef.current
    phaseRef.current = "landing"
    // Trap pointer so the new page isn't clickable mid-morph
    overlay.setAttribute("data-locking", "true")
    armSafety(runId)

    const isHome = nextPath === "/"

    // Keep breathing while the destination route paints + warms media
    const target = await waitForDestinationReady(isHome)
    if (runId !== runIdRef.current) return

    // Minimum center beat after bloom so the land never feels rushed
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, TIMING.hold * 1000)
    })
    if (runId !== runIdRef.current) return

    breatheRef.current?.kill()
    breatheRef.current = null

    const cornerLogo = document.querySelector<HTMLElement>(".corner-logo")
    const nav = document.querySelector<HTMLElement>(".site-nav")
    const navBar = document.querySelector<HTMLElement>(".site-nav__bar")
    const navItems = Array.from(
      document.querySelectorAll<HTMLElement>(".site-nav__links a, .site-nav__quote"),
    )
    const langSwitch = document.querySelector<HTMLElement>(".lang-switch")
    const siteLogo = document.querySelector<HTMLElement>("[data-site-logo]")
    const siteHeader = document.querySelector<HTMLElement>("[data-site-header]")
    const rtl = document.documentElement.dir === "rtl"
    const navOrigin = rtl ? "right center" : "left center"
    const settledLogo = isHome ? cornerLogo : siteLogo

    if (isHome) {
      if (cornerLogo) gsap.set(cornerLogo, { opacity: 0, visibility: "visible" })
      if (nav) gsap.set(nav, { visibility: "visible" })
      if (navBar) gsap.set(navBar, { scaleX: 0, opacity: 0, transformOrigin: navOrigin })
      if (navItems.length) gsap.set(navItems, { x: rtl ? 10 : -10, opacity: 0 })
      if (langSwitch) gsap.set(langSwitch, { opacity: 0, visibility: "visible", y: -8 })
    } else {
      if (siteHeader) {
        gsap.set(siteHeader, { opacity: 1, visibility: "visible", pointerEvents: "auto" })
      }
      if (siteLogo) gsap.set(siteLogo, { opacity: 0 })
      if (nav) gsap.set(nav, { visibility: "visible" })
      if (navBar) {
        gsap.set(navBar, { scaleX: 1, opacity: 1, clearProps: "transform" })
      }
      if (navItems.length) gsap.set(navItems, { x: 0, opacity: 1 })
      if (langSwitch) {
        gsap.set(langSwitch, { opacity: 1, visibility: "visible", y: 0 })
      }
    }

    bloomTlRef.current?.progress(1)
    // Drop scale/x transforms before measuring — leftover breathe/bloom skews the box.
    gsap.set(logo, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 })

    landTlRef.current?.eventCallback("onComplete", null)
    landTlRef.current?.eventCallback("onInterrupt", null)
    landTlRef.current?.kill()
    const timeline = gsap.timeline({
      onComplete: () => finish(runId),
    })
    landTlRef.current = timeline

    if (target) {
      // Pin to the current painted box, then tween left/top/width/height so the
      // flight SVG's box matches the destination mark exactly (no scale+x math).
      const startRect = logo.getBoundingClientRect()
      pinFlightBox(logo, {
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
      })
      const endBox = markRect(target)

      const clipIntoPlace = () => {
        // Remeasure under the still-locked scroll, snap boxes, then swap.
        pinFlightBox(logo, markRect(target))
        if (settledLogo) gsap.set(settledLogo, { opacity: 1, visibility: "visible" })
        gsap.set(logo, { opacity: 0 })
        overlay.removeAttribute("data-locking")
        document.body.classList.remove("is-page-transitioning")
      }

      timeline
        .to(logo, {
          left: endBox.left,
          top: endBox.top,
          width: endBox.width,
          height: endBox.height,
          duration: TIMING.travel,
          ease: "power3.inOut",
        })
        .to(
          backdrop ?? overlay,
          {
            autoAlpha: 0,
            duration: TIMING.fade,
            ease: "power2.inOut",
          },
          `-=${TIMING.travel * 0.55}`,
        )
        // Seat the real bar logo the instant travel finishes (not when the fade ends).
        .add(clipIntoPlace, TIMING.travel)

      if (isHome) {
        tweenIf(
          timeline,
          navBar,
          { scaleX: 1, opacity: 1, duration: TIMING.nav, ease: "power3.out" },
          "-=0.14",
        )
        if (navItems.length) {
          timeline.to(
            navItems,
            {
              x: 0,
              opacity: 1,
              duration: TIMING.nav,
              stagger: 0.045,
              ease: "power3.out",
            },
            "<0.06",
          )
        }
        tweenIf(
          timeline,
          langSwitch,
          { opacity: 1, y: 0, duration: TIMING.nav, ease: "power3.out" },
          "<0.08",
        )
      }
    } else {
      timeline.to(backdrop ?? overlay, {
        autoAlpha: 0,
        duration: TIMING.fade,
        ease: "power2.inOut",
        onStart: () => {
          overlay.removeAttribute("data-locking")
          document.body.classList.remove("is-page-transitioning")
        },
      })
      if (settledLogo) gsap.set(settledLogo, { opacity: 1, visibility: "visible" })
    }
  }

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!isInternalNavClick(event, pathnameRef.current)) return
      beginCover()
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  }, [])

  useLayoutEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }

    void landIntoBar(pathname)
    // Intentionally no cleanup that kills the land timeline — that left the
    // overlay stuck when React tore the effect down mid-flight (Strict Mode).
  }, [pathname])

  useEffect(() => {
    return () => {
      clearSafety()
      bloomTlRef.current?.kill()
      landTlRef.current?.kill()
      breatheRef.current?.kill()
      document.body.classList.remove("is-page-transitioning")
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      className="logo-route-transition"
      data-active="false"
      aria-hidden="true"
      role="presentation"
    >
      <div ref={backdropRef} className="logo-route-transition__backdrop" aria-hidden="true" />
      <LogoMark
        ref={logoRef}
        className="logo-route-transition__mark"
        idPrefix="route-logo"
      />
    </div>
  )
}
