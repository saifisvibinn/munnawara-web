"use client"

import { skipNextRouteTransition } from "@/components/landing/LogoRouteTransition"
import { Link, useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useLayoutEffect, type MouseEvent } from "react"

type WindowWithLenis = Window & {
  __lenis?: {
    stop: () => void
    start: () => void
    scrollTo: (
      target: string | number | HTMLElement,
      opts?: { immediate?: boolean; offset?: number },
    ) => void
  }
}

export const QUOTE_TICKET_RETURN = "dmtc-return-to-quote-ticket"

/** Survives soft nav long enough for both ReturnScroll and QuoteSection to read it. */
let returnToTicketPending = false

export const markReturnToTicket = () => {
  returnToTicketPending = true
  try {
    sessionStorage.setItem(QUOTE_TICKET_RETURN, "1")
  } catch {
    // ignore
  }
}

export const isReturningToTicket = () => {
  if (returnToTicketPending) return true
  if (typeof window !== "undefined" && window.location.hash === "#quote") return true
  try {
    return sessionStorage.getItem(QUOTE_TICKET_RETURN) === "1"
  } catch {
    return false
  }
}

const consumeReturnFlag = () => {
  try {
    sessionStorage.removeItem(QUOTE_TICKET_RETURN)
  } catch {
    // ignore
  }
  // Keep the in-memory flag through the rest of this layout flush so
  // QuoteSectionClient (parent) can skip GSAP after ReturnScroll runs.
  queueMicrotask(() => {
    returnToTicketPending = false
  })
}

/** Locks document scroll while the quote page is mounted. */
export const QuotePageLock = () => {
  useEffect(() => {
    document.body.classList.add("is-quote-page")
    const lenis = (window as WindowWithLenis).__lenis
    lenis?.stop()
    // Warm home so "back to ticket" feels instant.
    return () => {
      document.body.classList.remove("is-quote-page")
      if (
        !document.body.classList.contains("is-loading") &&
        !document.body.classList.contains("is-page-transitioning")
      ) {
        lenis?.start()
      }
    }
  }, [])

  return null
}

/** Prefetch home while on /quote for a seamless return. */
export const QuoteHomePrefetch = () => {
  const router = useRouter()
  useEffect(() => {
    router.prefetch("/")
  }, [router])
  return null
}

/** Returns to the home boarding-pass / ticket section. */
export const QuoteBackLink = ({ className }: { className?: string }) => {
  const t = useTranslations("quote")
  const router = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    markReturnToTicket()
    skipNextRouteTransition()
    router.push("/")
  }

  return (
    <Link
      href="/#quote"
      scroll={false}
      data-no-route-transition
      onClick={handleClick}
      className={
        className ??
        "font-label inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
      }
      aria-label={t("backToTicket")}
    >
      <span aria-hidden className="text-base leading-none rtl:rotate-180">
        ←
      </span>
      {t("backToTicket")}
    </Link>
  )
}

/** On home: jump straight to the ticket when returning from /quote. */
export const QuoteTicketReturnScroll = () => {
  useLayoutEffect(() => {
    if (!isReturningToTicket()) return

    const jump = () => {
      const el = document.getElementById("quote")
      if (!el) return false

      // Un-hide ticket section if GSAP scrub left it mid-fade.
      el.querySelectorAll<HTMLElement>("[data-quote-copy], [data-quote-form]").forEach((node) => {
        node.style.opacity = "1"
        node.style.transform = "none"
      })

      const lenis = (window as WindowWithLenis).__lenis
      if (lenis) {
        lenis.start()
        lenis.scrollTo(el, { immediate: true, offset: -12 })
      } else {
        el.scrollIntoView({ behavior: "instant", block: "start" })
      }

      consumeReturnFlag()

      try {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#quote`,
        )
      } catch {
        // ignore
      }
      return true
    }

    if (!jump()) {
      const id = window.requestAnimationFrame(() => {
        jump()
      })
      return () => window.cancelAnimationFrame(id)
    }
  }, [])

  return null
}
