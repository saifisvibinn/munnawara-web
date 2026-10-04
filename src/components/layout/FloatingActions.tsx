"use client"

import { ChatWidget } from "@/components/chat/ChatWidget"
import { WhatsAppButton } from "@/components/layout/WhatsAppButton"
import { usePathname } from "@/i18n/navigation"
import { useEffect } from "react"

/**
 * Publishes `--float-lift` on <html>: how far the floating chat / WhatsApp /
 * quote chrome must rise so it rests above the footer instead of covering
 * footer links once the footer scrolls into view.
 */
const useFooterLift = () => {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const update = () => {
      frame = 0
      const footer = document.querySelector("footer")
      if (!footer) {
        root.style.setProperty("--float-lift", "0px")
        return
      }
      const top = footer.getBoundingClientRect().top
      const lift = Math.max(0, window.innerHeight - top)
      // Footer fills most of the screen (mobile): hide instead of floating mid-page.
      root.toggleAttribute("data-footer-covers", top < window.innerHeight * 0.45)
      root.style.setProperty("--float-lift", `${Math.round(lift)}px`)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    const settle = window.setTimeout(schedule, 500)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const sizeObserver = new ResizeObserver(schedule)
    sizeObserver.observe(document.documentElement)

    return () => {
      window.clearTimeout(settle)
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      sizeObserver.disconnect()
      root.style.removeProperty("--float-lift")
      root.removeAttribute("data-footer-covers")
    }
  }, [pathname])
}

export const FloatingActions = () => {
  useFooterLift()

  return (
    <div
      data-floating-actions
      className="float-above-footer fixed end-4 z-40 flex flex-row items-center sm:end-6"
    >
      <ChatWidget revealed />
      <WhatsAppButton />
    </div>
  )
}
