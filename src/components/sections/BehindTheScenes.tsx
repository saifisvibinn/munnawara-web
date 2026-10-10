import { PhotoStrip } from "@/components/gallery/PhotoStrip"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { ArrowUpRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

// Parts / yard objects only — no face-forward portraits in the home preview.
const PHOTO_IDS = ["workshop-0331", "workshop-0358", "workshop-0362"] as const

type BehindTheScenesProps = {
  locale: AppLocale
}

export const BehindTheScenes = async ({ locale }: BehindTheScenesProps) => {
  const t = await getTranslations({ locale, namespace: "behindScenes" })
  const tGallery = await getTranslations({ locale, namespace: "photoGallery" })

  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl md:leading-[1.1]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/gallery"
            className="font-label inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-ink/10 bg-surface-elevated px-5 text-sm font-semibold text-ink shadow-sm transition-[transform,border-color,background-color] duration-100 ease-out hover:border-orange/40 hover:bg-surface-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 md:self-auto"
          >
            {t("cta")}
            <ArrowUpRight aria-hidden className="size-4 text-orange" />
          </Link>
        </div>

        <PhotoStrip
          locale={locale}
          ids={PHOTO_IDS}
          variant="editorial"
          openLabel={tGallery("open")}
          className="mt-10 md:mt-14"
        />
      </div>
    </section>
  )
}
