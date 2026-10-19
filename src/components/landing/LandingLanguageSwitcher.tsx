"use client"

import {
  isRtlLocale,
  localeNativeNames,
  routing,
  type AppLocale,
} from "@/i18n/routing"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react"

/** Compact trigger labels so the glass pill stays short next to the theme toggle. */
const triggerLabels: Record<AppLocale, string> = {
  ar: "العربية",
  en: "EN",
  fr: "FR",
  id: "ID",
}

/** Glass pill language menu — fixed opposite the corner logo. */
export const LandingLanguageSwitcher = forwardRef<HTMLDivElement>(
  function LandingLanguageSwitcher(_props, ref) {
    const t = useTranslations("nav")
    const locale = useLocale() as AppLocale
    const pathname = usePathname()
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement | null>(null)
    const listId = useId()

    useEffect(() => {
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection
      if (connection?.saveData) return
      for (const next of routing.locales) {
        if (next === locale) continue
        router.prefetch(pathname, { locale: next })
      }
    }, [router, pathname, locale])

    useEffect(() => {
      if (!open) return
      const handlePointer = (event: MouseEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
      }
      const handleKey = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false)
      }
      document.addEventListener("mousedown", handlePointer)
      document.addEventListener("keydown", handleKey)
      return () => {
        document.removeEventListener("mousedown", handlePointer)
        document.removeEventListener("keydown", handleKey)
      }
    }, [open])

    const handleSelect = (nextLocale: AppLocale) => {
      setOpen(false)
      if (nextLocale === locale || pending) return
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale })
      })
    }

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setOpen(true)
      }
    }

    return (
      <div
        className="lang-switch"
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
      >
        <button
          type="button"
          className="lang-switch__trigger"
          aria-label={t("switchLanguage")}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-busy={pending || undefined}
          disabled={pending}
          tabIndex={0}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={handleTriggerKeyDown}
          onPointerEnter={() => {
            for (const next of routing.locales) {
              if (next === locale) continue
              router.prefetch(pathname, { locale: next })
            }
          }}
        >
          <span
            className="lang-switch__label"
            lang={locale}
            dir={isRtlLocale(locale) ? "rtl" : "ltr"}
          >
            {triggerLabels[locale]}
          </span>
        </button>

        {open ? (
          <ul
            id={listId}
            className="lang-switch__menu"
            role="listbox"
            aria-label={t("switchLanguage")}
          >
            {routing.locales.map((next) => {
              const selected = next === locale
              return (
                <li key={next} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={
                      selected
                        ? "lang-switch__option lang-switch__option--active"
                        : "lang-switch__option"
                    }
                    lang={next}
                    dir={isRtlLocale(next) ? "rtl" : "ltr"}
                    tabIndex={0}
                    onClick={() => handleSelect(next)}
                  >
                    {localeNativeNames[next]}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    )
  },
)
