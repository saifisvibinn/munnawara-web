"use client"

import { LandingLanguageSwitcher } from "@/components/landing/LandingLanguageSwitcher"
import { LogoMark } from "@/components/landing/LogoMark"
import { Link, usePathname } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react"

const NAV_ITEMS = [
  { id: "home", href: "/", key: "home" as const },
  { id: "companies", href: "/companies", key: "companies" as const },
  { id: "fleet", href: "/fleet", key: "fleet" as const },
  { id: "about", href: "/about", key: "about" as const },
  { id: "contact", href: "/contact", key: "contact" as const },
] as const

export const Header = () => {
  const t = useTranslations("nav")
  const tMeta = useTranslations("meta")
  const pathname = usePathname()
  const locale = useLocale()
  const linksRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState("home")
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const isHome = pathname === "/"

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
    if (isHome) return
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
  }, [active, locale, isHome, menuOpen])

  if (isHome) return null

  const handleToggleMenu = () => setMenuOpen((value) => !value)
  const handleCloseMenu = () => setMenuOpen(false)
  const handleNavClick = () => setMenuOpen(false)

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false)
    if (pathname !== "/") return
    event.preventDefault()
  }

  return (
    <div data-site-header className="site-chrome">
      <div className="site-chrome__spacer" aria-hidden="true" />

      <Link
        href="/"
        className="corner-logo site-chrome__logo"
        data-site-logo
        aria-label={tMeta("siteName")}
        tabIndex={0}
      >
        <LogoMark className="logo-mark logo-mark--live" idPrefix="site-chrome" />
      </Link>

      <nav
        className={`site-nav site-nav--chrome${menuOpen ? " is-menu-open" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="site-nav__bar">
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
                onClick={item.id === "home" ? handleHomeClick : handleNavClick}
                tabIndex={0}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <Link
            className="site-nav__quote"
            href="/contact"
            onClick={handleNavClick}
            tabIndex={0}
          >
            {t("quote")}
          </Link>
          <button
            className={`menu-hook${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={handleToggleMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <LandingLanguageSwitcher />

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
            <Link
              className="site-nav__drawer-quote"
              href="/contact"
              onClick={handleNavClick}
              tabIndex={0}
            >
              {t("quote")}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
