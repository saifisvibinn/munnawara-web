"use client"

import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import {
  forwardRef,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react"

export const ThemeToggle = forwardRef<HTMLButtonElement>(
  function ThemeToggle(_props, ref) {
    const t = useTranslations("theme")
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    const isDark = mounted && resolvedTheme === "dark"
    const label = isDark ? t("switchToLight") : t("switchToDark")

    const handleToggle = () => {
      setTheme(isDark ? "light" : "dark")
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleToggle()
      }
    }

    return (
      <button
        type="button"
        className="theme-toggle"
        ref={ref}
        aria-label={label}
        title={label}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="theme-toggle__icon" aria-hidden="true">
          {isDark ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="12" cy="12" r="4" />
              <path
                strokeLinecap="round"
                d="M12 2.5v1.5M12 20v1.5M4.5 12H3M21 12h-1.5M6.2 6.2 5.1 5.1M18.9 18.9l-1.1-1.1M6.2 17.8l-1.1 1.1M18.9 5.1l-1.1 1.1"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.2 13.4A7.8 7.8 0 0 1 10.6 3.8 8.2 8.2 0 1 0 20.2 13.4Z"
              />
            </svg>
          )}
        </span>
      </button>
    )
  },
)
