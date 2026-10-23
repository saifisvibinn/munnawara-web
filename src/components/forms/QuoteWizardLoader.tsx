"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import type { WizardProps } from "./quoteWizardTypes"

function QuoteWizardFallback() {
  const t = useTranslations("quote")
  return (
    <div
      role="status"
      className="flex min-h-[50svh] flex-1 flex-col gap-4 p-4 sm:p-6"
      aria-busy="true"
      aria-label={t("loading")}
    >
      <h1 className="sr-only">{t("title")}</h1>
      <div className="h-8 w-2/3 max-w-sm animate-pulse rounded-lg bg-surface-muted" aria-hidden="true" />
      <div className="min-h-[14rem] flex-1 animate-pulse rounded-2xl bg-surface-muted" aria-hidden="true" />
      <div className="h-11 w-40 animate-pulse rounded-full bg-surface-muted" aria-hidden="true" />
    </div>
  )
}

const QuoteWizard = dynamic(
  () => import("./QuoteWizard").then((m) => m.QuoteWizard),
  {
    ssr: false,
    loading: () => <QuoteWizardFallback />,
  },
)

/** Defers the heavy wizard + map chunks until after the quote shell paints. */
export const QuoteWizardLoader = (props: WizardProps) => <QuoteWizard {...props} />
