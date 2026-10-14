"use client"

import { getPathname, usePathname, useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { forwardRef, useEffect, useTransition, type MouseEvent } from "react"

/** Glass pill EN/AR control — opposite the corner logo. */
export const LandingLanguageSwitcher = forwardRef<HTMLAnchorElement>(
  function LandingLanguageSwitcher(_props, ref) {
    const t = useTranslations("nav")
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const nextLocale = locale === "ar" ? "en" : "ar"
    const href = getPathname({ href: pathname, locale: nextLocale })

    // next-intl Link with `locale` never prefetches (cookie side-effect). Warm the
    // opposite locale ourselves so the switch is a soft navigation from cache.
    useEffect(() => {
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection
      if (connection?.saveData) return
      router.prefetch(pathname, { locale: nextLocale })
    }, [router, pathname, nextLocale])

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return
      }
      event.preventDefault()
      if (pending) return
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale })
      })
    }

    return (
      <a
        className="lang-switch"
        href={href}
        ref={ref}
        aria-label={t("switchLanguage")}
        aria-busy={pending || undefined}
        tabIndex={0}
        onClick={handleClick}
        onPointerEnter={() => router.prefetch(pathname, { locale: nextLocale })}
      >
        <span
          className="lang-switch__label"
          lang={nextLocale}
          dir={nextLocale === "ar" ? "rtl" : "ltr"}
        >
          {t("switchLanguage")}
        </span>
      </a>
    )
  },
)
