"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { useRouter as useNextRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useRef } from "react"
import { routing } from "@/i18n/routing"

export const LOGO_INTRO_SEEN_KEY = "dmtc-logo-intro-seen"

/** Must match the `.route-veil` fade-in in dam-landing.css. */
const VEIL_IN_MS = 180
/** Longest the veil waits for the new page's images before revealing anyway. */
const ARRIVAL_CAP_MS = 600

let skipNext = false
let skipTimer: number | null = null

export const skipNextRouteTransition = () => {
  skipNext = true
  if (skipTimer !== null) window.clearTimeout(skipTimer)
  skipTimer = window.setTimeout(() => {
    skipNext = false
    skipTimer = null
  }, 4000)
  document.body.classList.remove("is-page-transitioning", "is-page-leaving", "is-page-arriving")
}

const markSeen = () => {
  try {
    sessionStorage.setItem(LOGO_INTRO_SEEN_KEY, "1")
  } catch {
    // Storage can be unavailable in private browsing contexts.
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

const isInternalNavClick = (event: MouseEvent, currentPath: string) => {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false

  const anchor = (event.target as Element | null)?.closest?.("a[href]")
  if (!(anchor instanceof HTMLAnchorElement)) return false
  if (anchor.hasAttribute("download") || anchor.target === "_blank") return false
  if (anchor.hasAttribute("data-no-route-transition")) return false

  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return false
  }
  if (url.origin !== window.location.origin) return false
  return stripLocale(url.pathname) !== stripLocale(currentPath)
}

const SITE_ROUTES = [
  "/", "/about", "/companies", "/fleet", "/corporate",
  "/clients", "/gallery", "/news", "/contact", "/quote",
]

export const PageRouteTransition = () => {
  const pathname = usePathname()
  const router = useRouter()

  // Warm every page in the visitor's language. Other languages are warmed when the
  // visitor points at the language switcher; most never switch.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return
    // Wait until the page has settled so prefetching never competes with first paint.
    const warm = () => {
      for (const route of SITE_ROUTES) router.prefetch(route)
    }
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(warm, 2500)
    return () => window.clearTimeout(id)
  }, [router])

  const pathnameRef = useRef(pathname)
  const firstPathRef = useRef(true)
  const pointerNavigationRef = useRef(false)
  const safetyTimerRef = useRef<number | null>(null)
  const arrivalTimerRef = useRef<number | null>(null)
  const navTimerRef = useRef<number | null>(null)
  const nextRouter = useNextRouter()

  pathnameRef.current = pathname

  useLayoutEffect(() => {
    const clearTimers = () => {
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current)
      if (arrivalTimerRef.current !== null) window.clearTimeout(arrivalTimerRef.current)
      if (navTimerRef.current !== null) window.clearTimeout(navTimerRef.current)
      safetyTimerRef.current = null
      arrivalTimerRef.current = null
      navTimerRef.current = null
    }
    const clearTransition = () => {
      clearTimers()
      pointerNavigationRef.current = false
      document.body.classList.remove("is-page-transitioning", "is-page-leaving", "is-page-arriving")
    }
    const onClick = (event: MouseEvent) => {
      if (!isInternalNavClick(event, pathnameRef.current)) return
      markSeen()
      if (event.detail === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      const anchor = (event.target as Element).closest("a[href]") as HTMLAnchorElement
      const url = new URL(anchor.href, window.location.href)
      // Fade the veil in first, then navigate: the new page's heavy first render
      // happens under it instead of as a visible hitch.
      event.preventDefault()
      pointerNavigationRef.current = true
      document.body.classList.remove("is-page-arriving")
      document.body.classList.add("is-page-transitioning", "is-page-leaving")
      if (navTimerRef.current !== null) window.clearTimeout(navTimerRef.current)
      navTimerRef.current = window.setTimeout(() => {
        navTimerRef.current = null
        nextRouter.push(url.pathname + url.search + url.hash)
      }, VEIL_IN_MS)
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = window.setTimeout(clearTransition, 5000)
    }

    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      clearTimers()
      document.body.classList.remove("is-page-transitioning", "is-page-leaving", "is-page-arriving")
    }
  }, [nextRouter])

  useLayoutEffect(() => {
    if (firstPathRef.current) {
      firstPathRef.current = false
      return
    }

    if (skipNext) {
      skipNext = false
      if (skipTimer !== null) window.clearTimeout(skipTimer)
      skipTimer = null
      pointerNavigationRef.current = false
      document.body.classList.remove("is-page-transitioning", "is-page-leaving", "is-page-arriving")
      markSeen()
      return
    }

    if (!pointerNavigationRef.current) return
    pointerNavigationRef.current = false
    if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current)
    safetyTimerRef.current = null

    // Keep the veil up until the new page has painted and its on-screen images
    // are decoded (capped), then fade it out over a settled page.
    const body = document.body
    body.classList.remove("is-page-leaving")
    body.classList.add("is-page-arriving")
    let cancelled = false
    const reveal = () => {
      if (cancelled) return
      body.classList.remove("is-page-transitioning", "is-page-arriving")
    }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const images = [...document.querySelectorAll<HTMLImageElement>("main img")].filter((img) => {
          const box = img.getBoundingClientRect()
          return box.bottom > 0 && box.top < window.innerHeight
        })
        const decoded = Promise.allSettled(images.map((img) => img.decode()))
        // Idle = the new page's own setup (scroll scenes, effects) has run too.
        const idle = new Promise((resolve) =>
          typeof window.requestIdleCallback === "function"
            ? window.requestIdleCallback(resolve, { timeout: ARRIVAL_CAP_MS })
            : resolve(null),
        )
        const cap = new Promise((resolve) => {
          arrivalTimerRef.current = window.setTimeout(resolve, ARRIVAL_CAP_MS)
        })
        void Promise.race([Promise.all([decoded, idle]), cap]).then(reveal)
      }),
    )
    return () => {
      cancelled = true
    }
  }, [pathname])

  return (
    <>
      <div className="header-scrim" aria-hidden="true" />
      <div className="route-veil" aria-hidden="true" />
      <div className="route-transition-progress" aria-hidden="true" />
    </>
  )
}
