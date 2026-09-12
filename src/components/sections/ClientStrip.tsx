import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { getClients } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"

export const ClientStrip = async () => {
  const t = await getTranslations("home")
  const locale = (await getLocale()) as AppLocale
  const clients = getClients(locale)

  return (
    <AnimatedSection className="bg-surface py-14 md:py-16">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          {t("clientsTitle")}
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {clients.map((client) => (
            <p
              key={client.id}
              className="font-label rounded-full border border-border bg-surface-muted px-4 py-2 text-sm text-ink-muted"
            >
              {client.label}
            </p>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
