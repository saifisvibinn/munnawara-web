import { PhotoStrip } from "@/components/gallery/PhotoStrip"
import { TextLink } from "@/components/ui/TextLink"
import type { AppLocale } from "@/content/types"
import { getTranslations } from "next-intl/server"

const PHOTO_IDS = ["workshop-0146", "workshop-0153", "workshop-0358"] as const

type BehindTheScenesProps = {
  locale: AppLocale
}

export const BehindTheScenes = async ({ locale }: BehindTheScenesProps) => {
  const t = await getTranslations({ locale, namespace: "behindScenes" })

  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-muted">{t("subtitle")}</p>
        <PhotoStrip locale={locale} ids={PHOTO_IDS} className="mt-10" />
        <div className="mt-8">
          <TextLink href="/gallery">{t("cta")}</TextLink>
        </div>
      </div>
    </section>
  )
}
