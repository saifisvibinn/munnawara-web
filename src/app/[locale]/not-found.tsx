import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

const action =
  "inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full px-7 text-[0.95rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"

const NotFound = async () => {
  const t = await getTranslations("notFound")
  const tCommon = await getTranslations("common")

  return (
    <section className="mx-auto grid min-h-[60dvh] max-w-2xl content-center justify-items-center gap-6 px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-semibold text-orange">404</p>
      <h1 className="font-display text-3xl leading-tight font-semibold text-balance text-ink sm:text-4xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-lg leading-relaxed text-ink-muted">{t("body")}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link href="/" className={`${action} bg-orange text-black hover:bg-orange-soft`}>
          {t("home")}
        </Link>
        <Link
          href="/contact"
          className={`${action} border border-border bg-surface-elevated text-ink hover:border-ink-muted`}
        >
          {tCommon("contactUs")}
        </Link>
      </div>
    </section>
  )
}

export default NotFound
