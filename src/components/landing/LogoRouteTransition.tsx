"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { useEffect, useLayoutEffect, useRef } from "react"
import { routing } from "@/i18n/routing"

export const LOGO_INTRO_SEEN_KEY = "dmtc-logo-intro-seen"

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
  "/clients", "/gallery", "/news", "/careers", "/contact", "/quote",
]

export const PageRouteTransition = () => {
  const pathname = usePathname()
  const router = useRouter()

  // Warm every page while the loader plays; prefetch is a no-op in `next dev`.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return
    SITE_ROUTES.forEach((route) => router.prefetch(route))
  }, [router])

  const pathnameRef = useRef(pathname)
  const firstPathRef = useRef(true)
  const pointerNavigationRef = useRef(false)
  const safetyTimerRef = useRef<number | null>(null)
  const arrivalTimerRef = useRef<number | null>(null)

  pathnameRef.current = pathname

  useLayoutEffect(() => {
    const clearTimers = () => {
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current)
      if (arrivalTimerRef.current !== null) window.clearTimeout(arrivalTimerRef.current)
      safetyTimerRef.current = null
      arrivalTimerRef.current = null
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
      pointerNavigationRef.current = true
      document.body.classList.remove("is-page-arriving")
      document.body.classList.add("is-page-transitioning", "is-page-leaving")
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = window.setTimeout(clearTransition, 5000)
    }

    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      clearTimers()
      document.body.classList.remove("is-page-transitioning", "is-page-leaving", "is-page-arriving")
    }
  }, [])

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

    const body = document.body
    body.classList.remove("is-page-transitioning", "is-page-leaving")
    body.classList.add("is-page-arriving")
    arrivalTimerRef.current = window.setTimeout(() => {
      body.classList.remove("is-page-arriving")
      arrivalTimerRef.current = null
    }, 240)
  }, [pathname])

  return <div className="route-transition-progress" aria-hidden="true" />
}
