import { getFleet, getFleetPage } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const cardClass =
  "group relative isolate flex h-[26rem] overflow-hidden rounded-2xl border border-white/15 focus-within:ring-2 focus-within:ring-orange"

const HiddenFleetPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale
  const fleet = getFleet(appLocale)
  const page = getFleetPage(appLocale)
  const t = await getTranslations("fleetLayout")
  const tCommon = await getTranslations("common")
  const tNav = await getTranslations("nav")

  const titleWords = page.title.split(" ")
  const accentWord = titleWords.pop()
  const leadWords = titleWords.join(" ")

  return (
    <div className="bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-14 md:pt-40 md:pb-24">
        <p className="font-label flex items-center gap-4 text-xs font-semibold tracking-[0.3em] text-orange uppercase rtl:tracking-normal">
          <span aria-hidden className="h-px w-10 bg-orange" />
          {page.typesEyebrow}
        </p>
        <h1 className="font-display mt-8 text-5xl leading-[1.05] font-light tracking-tight text-balance md:text-7xl lg:text-[5.5rem] rtl:tracking-normal">
          {leadWords}{" "}
          <em className="text-orange italic rtl:not-italic">{accentWord}</em>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          {page.subtitle} {page.intro}
        </p>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src="/fleet/premium-vip-2026/interior/pv-in-1.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/80" />

        <div className="mx-auto max-w-7xl px-6 py-16 md:px-14 md:py-24">
          <ul className="grid gap-5 sm:grid-cols-2">
            {fleet.map((bus, index) => (
              <li key={bus.id} className={index === 0 ? "sm:col-span-2" : undefined}>
                <article className={cardClass}>
                  <Image
                    src={bus.coverImage}
                    alt={`${bus.name} ${bus.yearLabel}`}
                    fill
                    sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent"
                  />
                  <div className="font-label absolute inset-x-4 top-4 flex items-start justify-between gap-2 text-[0.6875rem] font-semibold tracking-wide">
                    <span className="rounded-full border border-orange/40 bg-black/75 px-3 py-1.5 text-orange">
                      {bus.yearLabel}
                    </span>
                    <span className="rounded-full border border-orange/40 bg-black/75 px-3 py-1.5 text-orange tabular-nums">
                      {tCommon("seats")}: {bus.seatsLabel}
                    </span>
                  </div>
                  <div className="relative mt-auto flex w-full flex-col gap-3 p-5 md:p-6">
                    <h2 className="font-display text-2xl font-light md:text-3xl">
                      {bus.name}
                    </h2>
                    <ul className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-white/70">
                      {bus.amenities.slice(0, 3).map((amenity, i) => (
                        <li key={amenity} className="flex gap-2">
                          {i > 0 ? <span aria-hidden>·</span> : null}
                          {amenity}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/quote"
                      className="font-label inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-orange uppercase after:absolute after:inset-0 focus-visible:outline-none rtl:tracking-normal"
                    >
                      {t("requestBus")}
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-20">
            <p className="font-label text-xs font-semibold tracking-[0.2em] text-orange uppercase rtl:tracking-normal">
              {t("specsEyebrow")}
            </p>
            <h2 className="font-display mt-3 text-3xl font-light md:text-4xl">
              {t("specsTitle")}
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-black/60 p-6 md:p-8">
                <h3 className="font-label text-xs font-semibold tracking-[0.18em] text-white/60 uppercase rtl:tracking-normal">
                  {t("capacityTitle")}
                </h3>
                <dl className="mt-4 divide-y divide-white/10">
                  {fleet.map((bus) => (
                    <div
                      key={bus.id}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <dt className="text-sm text-white/85">
                        {bus.name}
                        <span className="ms-2 text-white/40">{bus.yearLabel}</span>
                      </dt>
                      <dd className="font-label text-sm font-semibold text-orange tabular-nums">
                        {bus.seatsLabel}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-2xl border border-white/15 bg-black/60 p-6 md:p-8">
                <h3 className="font-label text-xs font-semibold tracking-[0.18em] text-white/60 uppercase rtl:tracking-normal">
                  {page.highlightsTitle}
                </h3>
                <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-white/80">
                  {page.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-orange"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/15 bg-black/60 p-6 sm:flex-row sm:items-center md:p-8">
            <div>
              <p className="font-display text-xl md:text-2xl">{t("ctaTitle")}</p>
              <p className="mt-2 text-sm text-white/70">{t("ctaText")}</p>
            </div>
            <Link
              href="/contact"
              className="font-label inline-flex shrink-0 items-center justify-center rounded-full bg-orange px-8 py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none"
            >
              {tNav("contact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const tNav = await getTranslations({ locale: (await params).locale, namespace: "nav" })
  return { title: tNav("fleet"), robots: { index: false, follow: false } }
}

export default HiddenFleetPage
