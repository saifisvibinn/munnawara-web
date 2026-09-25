"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { forwardRef } from "react"

/** Glass pill EN/AR control — opposite the corner logo. */
export const LandingLanguageSwitcher = forwardRef<HTMLAnchorElement>(
  function LandingLanguageSwitcher(_props, ref) {
    const t = useTranslations("nav")
    const locale = useLocale()
    const pathname = usePathname()
    const nextLocale = locale === "ar" ? "en" : "ar"

    return (
      <Link
        className="lang-switch"
        href={pathname}
        locale={nextLocale}
        ref={ref}
        aria-label={t("switchLanguage")}
        tabIndex={0}
      >
        <span
          className="lang-switch__label"
          lang={nextLocale}
          dir={nextLocale === "ar" ? "rtl" : "ltr"}
        >
          {t("switchLanguage")}
        </span>
      </Link>
    )
  },
)
