import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["ar", "en", "fr", "id"],
  defaultLocale: "ar",
  localePrefix: "always",
})

export type AppLocale = (typeof routing.locales)[number]

/** Native labels for the language switcher (shown in each language’s own script). */
export const localeNativeNames: Record<AppLocale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
  id: "Bahasa Indonesia",
}

export const isRtlLocale = (locale: string) => locale === "ar"

export const ogLocaleTag = (locale: string) =>
  (
    {
      ar: "ar_SA",
      en: "en_US",
      fr: "fr_FR",
      id: "id_ID",
    } as const
  )[locale as AppLocale] ?? "en_US"
