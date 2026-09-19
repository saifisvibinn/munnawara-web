"use client"

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useId, useState } from "react"

const navKeys = [
  { href: "/fleet", key: "fleet" as const },
  { href: "/companies", key: "companies" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
]

const extraKeys = [
  { href: "/corporate", key: "corporate" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/gallery", key: "gallery" as const },
  { href: "/news", key: "news" as const },
  { href: "/careers", key: "careers" as const },
]

export const Header = () => {
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const tMeta = useTranslations("meta")
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [logoInHeader, setLogoInHeader] = useState(false)
  const menuId = useId()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const sync = () =>
      setLogoInHeader(document.documentElement.hasAttribute("data-logo-in-header"))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-logo-in-header"],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open])

  const handleToggle = () => setOpen((value) => !value)
  const isHome = pathname === "/"
  const hideChrome = isHome && !logoInHeader

  return (
    <header
      data-site-header
      className={cn(
        "sticky top-0 z-40 border-b border-ink/6 bg-white/95 text-ink backdrop-blur-xl",
        hideChrome && "pointer-events-none",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-4 px-4 md:h-[4.5rem] md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          aria-label={tMeta("siteName")}
        >
          <span data-site-logo className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt=""
              width={605}
              height={491}
              className="h-10 w-auto object-contain md:h-11"
              priority
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
          {navKeys.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-label text-[13px] font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                  active
                    ? "text-orange"
                    : "text-ink/65 hover:text-ink",
                )}
              >
                {t(item.key)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="font-label hidden rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:inline-flex"
          >
            {tCommon("contactUs")}
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full text-ink xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={handleToggle}
          >
            <span className="sr-only">
              {open ? t("closeMenu") : t("openMenu")}
            </span>
            <span aria-hidden className="text-lg leading-none">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-ink/6 bg-white xl:hidden"
      >
        <nav className="mx-auto flex max-w-[80rem] flex-col px-4 py-4" aria-label="Mobile">
          {[...navKeys, ...extraKeys].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-base text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              tabIndex={0}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
