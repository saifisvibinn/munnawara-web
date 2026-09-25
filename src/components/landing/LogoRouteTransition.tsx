"use client"

import { routing } from "@/i18n/routing"
import { usePathname } from "@/i18n/navigation"
import gsap from "gsap"
import { useEffect, useLayoutEffect, useRef } from "react"
import { LogoMark } from "./LogoMark"

/** Session flag so home can skip the long first-load intro on return visits. */
export const LOGO_INTRO_SEEN_KEY = "dmtc-logo-intro-seen"

const FAST = {
  spin: 0.32,
  bloom: 0.22,
  stagger: 0.025,
  rotation: 14,
  hold: 0.04,
  travel: 0.48,
  handoff: 0.1,
  nav: 0.24,
  fade: 0.18,
  breathe: 1.2,
} as const

const SAFETY_MS = 4200

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
  maxMs = 400,
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

const destinationFor = (logo: SVGSVGElement, target: HTMLElement) => {
  const to = target.getBoundingClientRect()
  const flight = logo.parentElement?.getBoundingClientRect()
  const width = logo.clientWidth || 1
  const centerX = flight ? flight.left + flight.width / 2 : window.innerWidth / 2
  const centerY = flight ? flight.top + flight.height / 2 : window.innerHeight / 2

  return {
    x: to.left + to.width / 2 - centerX,
    y: to.top + to.height / 2 - centerY,
    scale: Math.min(1, to.width / width),
  }
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
 * Fast logo bloom + morph into the top bar on each client-side page switch.
 * Cover plate shows on click (before RSC finishes) so loading feels instant.
 */
export const LogoRouteTransition = () => {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
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
    if (!overlay) return
    overlay.setAttribute("data-active", "false")
    overlay.removeAttribute("data-locking")
    overlay.setAttribute("aria-hidden", "true")
    gsap.set(overlay, { autoAlpha: 0 })
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
      rotation: (index) => (index % 2 ? -1 : 1) * FAST.rotation,
      transformOrigin: "427.5px 427.5px",
    })

    armSafety(runId)

    bloomTlRef.current = gsap
      .timeline()
      .to(logo, {
        rotation: 0,
        scale: 1,
        duration: FAST.spin,
        ease: "expo.out",
      })
      .to(
        petals,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: FAST.bloom,
          stagger: FAST.stagger,
          ease: "power3.out",
        },
        0.04,
      )
      .add(() => {
        if (runId !== runIdRef.current || phaseRef.current !== "covering") return
        breatheRef.current = gsap.to(logo, {
          scale: 1.035,
          duration: FAST.breathe,
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
    const logo = logoRef.current
    if (!overlay || !logo) return

    if (phaseRef.current === "idle") {
      beginCover()
    }
    if (phaseRef.current === "idle") return

    const runId = runIdRef.current
    phaseRef.current = "landing"
    // Now that navigation committed, trap pointer so the new page isn't clickable mid-morph
    overlay.setAttribute("data-locking", "true")
    armSafety(runId)

    breatheRef.current?.kill()
    breatheRef.current = null

    const isHome = nextPath === "/"
    const target = await waitForTarget(isHome)
    if (runId !== runIdRef.current) return

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
    gsap.set(logo, { scale: 1, rotation: 0, opacity: 1 })

    landTlRef.current?.eventCallback("onComplete", null)
    landTlRef.current?.eventCallback("onInterrupt", null)
    landTlRef.current?.kill()
    const timeline = gsap.timeline({
      onComplete: () => finish(runId),
    })
    landTlRef.current = timeline

    if (target) {
      const dest = () => destinationFor(logo, target)

      timeline
        .to(logo, {
          x: () => dest().x,
          y: () => dest().y,
          scale: () => dest().scale,
          duration: FAST.travel,
          ease: "power3.inOut",
          delay: FAST.hold,
        })
        .to(
          overlay,
          {
            autoAlpha: 0,
            duration: FAST.fade * 1.1,
            ease: "power2.inOut",
            onStart: () => {
              // Drop pointer trap as soon as fade begins
              overlay.setAttribute("data-active", "false")
              overlay.removeAttribute("data-locking")
              overlay.setAttribute("aria-hidden", "true")
              document.body.classList.remove("is-page-transitioning")
            },
          },
          `-=${FAST.travel * 0.7}`,
        )

      if (isHome) {
        tweenIf(
          timeline,
          cornerLogo,
          { opacity: 1, duration: FAST.handoff, ease: "power2.inOut" },
          "-=0.12",
        )
        timeline.to(
          logo,
          { opacity: 0, duration: FAST.handoff, ease: "power2.inOut" },
          "<",
        )
        tweenIf(
          timeline,
          navBar,
          { scaleX: 1, opacity: 1, duration: FAST.nav, ease: "power3.out" },
          "-=0.1",
        )
        if (navItems.length) {
          timeline.to(
            navItems,
            {
              x: 0,
              opacity: 1,
              duration: FAST.nav,
              stagger: 0.03,
              ease: "power3.out",
            },
            "<0.04",
          )
        }
        tweenIf(
          timeline,
          langSwitch,
          { opacity: 1, y: 0, duration: FAST.nav, ease: "power3.out" },
          "<0.05",
        )
      } else {
        tweenIf(
          timeline,
          siteLogo,
          { opacity: 1, duration: FAST.handoff, ease: "power2.inOut" },
          "-=0.1",
        )
        timeline.to(
          logo,
          { opacity: 0, duration: FAST.handoff, ease: "power2.inOut" },
          "<",
        )
      }
    } else {
      timeline.to(overlay, {
        autoAlpha: 0,
        duration: FAST.fade,
        ease: "power2.inOut",
        delay: FAST.hold,
        onStart: () => {
          overlay.setAttribute("data-active", "false")
          overlay.removeAttribute("data-locking")
          overlay.setAttribute("aria-hidden", "true")
          document.body.classList.remove("is-page-transitioning")
        },
      })
      if (!isHome && siteLogo) gsap.set(siteLogo, { opacity: 1 })
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
      <LogoMark
        ref={logoRef}
        className="logo-route-transition__mark"
        idPrefix="route-logo"
      />
    </div>
  )
}
