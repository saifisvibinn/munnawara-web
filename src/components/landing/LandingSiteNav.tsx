"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { OPEN_QUOTE_EVENT } from "@/components/layout/FloatingQuoteCta"
import { useLocale, useTranslations } from "next-intl"
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react"

const NAV_ITEMS = [
  { id: "home", href: "/", key: "home" as const },
  { id: "companies", href: "/companies", key: "companies" as const },
  { id: "fleet", href: "/fleet", key: "fleet" as const },
  { id: "about", href: "/about", key: "about" as const },
  { id: "contact", href: "/contact", key: "contact" as const },
] as const

type LandingSiteNavProps = {
  navRef: RefObject<HTMLElement | null>
  navBarRef: RefObject<HTMLDivElement | null>
  collectNavItem: (element: HTMLElement | null) => void
  scrollTo: (target: string, options?: { offset?: number }) => void
}

export const LandingSiteNav = ({
  navRef,
  navBarRef,
  collectNavItem,
  scrollTo,
}: LandingSiteNavProps) => {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const locale = useLocale()
  const linksRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState("home")
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useLayoutEffect(() => {
    if (pathname === "/") {
      setActive("home")
      return
    }
    const match = NAV_ITEMS.find(
      (item) => item.href !== "/" && pathname.startsWith(item.href),
    )
    if (match) setActive(match.id)
  }, [pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) {
      document.body.classList.remove("is-landing-menu-open")
      return
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    document.body.classList.add("is-landing-menu-open")
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.classList.remove("is-landing-menu-open")
      window.removeEventListener("keydown", handleKey)
    }
  }, [menuOpen])

  useLayoutEffect(() => {
    const root = linksRef.current
    if (!root) return

    const update = () => {
      const link = root.querySelector<HTMLElement>(`[data-nav="${active}"]`)
      if (!link) {
        setPill((prev) => ({ ...prev, opacity: 0 }))
        return
      }
      const rootBox = root.getBoundingClientRect()
      const linkBox = link.getBoundingClientRect()
      setPill({
        left: linkBox.left - rootBox.left,
        width: linkBox.width,
        opacity: 1,
      })
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [active, locale])

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false)
    if (pathname !== "/") return
    event.preventDefault()
    setActive("home")
    scrollTo("#home", { offset: 0 })
  }

  const handleQuoteClick = () => {
    setMenuOpen(false)
    window.dispatchEvent(new Event(OPEN_QUOTE_EVENT))
  }

  const handleNavClick = () => setMenuOpen(false)
  const handleToggleMenu = () => setMenuOpen((value) => !value)
  const handleCloseMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={`site-nav${menuOpen ? " is-menu-open" : ""}`}
        ref={navRef}
        aria-label="Primary navigation"
      >
        <div className="site-nav__bar" ref={navBarRef}>
          <div className="site-nav__links" ref={linksRef}>
            <span
              className="site-nav__pill"
              aria-hidden="true"
              style={{
                transform: `translate3d(${pill.left}px, -50%, 0)`,
                width: pill.width,
                opacity: pill.opacity,
              }}
            />
            {NAV_ITEMS.map((item) => (
              <Link
                href={item.href}
                key={item.id}
                data-nav={item.id}
                className={active === item.id ? "is-active" : undefined}
                ref={collectNavItem}
                onClick={item.id === "home" ? handleHomeClick : undefined}
                tabIndex={0}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="site-nav__quote"
            ref={collectNavItem}
            onClick={handleQuoteClick}
            tabIndex={0}
          >
            {t("quote")}
          </button>
          <button
            className={`menu-hook${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            ref={collectNavItem}
            onClick={handleToggleMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id={menuId}
          className="site-nav__drawer is-open"
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
          <button
            type="button"
            className="site-nav__drawer-backdrop"
            aria-label={t("closeMenu")}
            tabIndex={-1}
            onClick={handleCloseMenu}
          />
          <nav className="site-nav__drawer-panel" aria-label={t("menu")}>
            {NAV_ITEMS.map((item) => (
              <Link
                href={item.href}
                key={`drawer-${item.id}`}
                className={active === item.id ? "is-active" : undefined}
                onClick={item.id === "home" ? handleHomeClick : handleNavClick}
                tabIndex={0}
              >
                {t(item.key)}
              </Link>
            ))}
            <button
              type="button"
              className="site-nav__drawer-quote"
              onClick={handleQuoteClick}
              tabIndex={0}
            >
              {t("quote")}
            </button>
          </nav>
        </div>
      ) : null}
    </>
  )
}
