"use client"

import type { AboutDriveItem, AboutStat, AboutValuePillar } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { toLocaleDigits } from "@/lib/localeDigits"
import { animate, motion, useInView } from "motion/react"
import { useLayoutEffect, useRef } from "react"

const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** Long, soft landing: fast start, slow settle. All figures share it so they finish together. */
const COUNT_EASE = [0.16, 1, 0.3, 1] as const
const COUNT_DURATION = 2.6

type AboutCompanyFactsClientProps = {
  drivesEyebrow: string
  drivesHeadline: string
  driveItems: readonly AboutDriveItem[]
  valuesTitle: string
  valuePillars: readonly AboutValuePillar[]
  statsTitle: string
  stats: readonly AboutStat[]
  techTitle: string
  techBody: string
  locale: string
}

const DriveArrow = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    className={cn("size-5 shrink-0 text-orange", className)}
  >
    <path
      d="M4 5v14M9 12h11M15 7l5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const parseStatValue = (value: string) => {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  if (!match) return { prefix: "", target: 0, suffix: value }
  return {
    prefix: match[1] ?? "",
    target: Number(match[2]),
    suffix: match[3] ?? "",
  }
}

type StatCountProps = {
  value: string
  locale: string
  active: boolean
  reduced: boolean
}

/** Counts once, forward only. Writes to the DOM directly so there is no per-frame re-render. */
const StatCount = ({ value, locale, active, reduced }: StatCountProps) => {
  const { prefix, target, suffix } = parseStatValue(value)
  const digitsRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const node = digitsRef.current
    if (!node) return
    const format = (amount: number) =>
      toLocaleDigits(Math.round(amount), locale)

    if (reduced) {
      node.textContent = format(target)
      return
    }
    if (!active) {
      node.textContent = format(0)
      return
    }

    const controls = animate(0, target, {
      duration: COUNT_DURATION,
      ease: COUNT_EASE,
      onUpdate: (latest) => {
        node.textContent = format(latest)
      },
    })
    return () => controls.stop()
  }, [active, reduced, target, locale])

  return (
    <>
      <span className="sr-only">
        {toLocaleDigits(`${prefix}${target}${suffix}`, locale)}
      </span>
      <span
        aria-hidden
        className="font-display text-5xl font-semibold tracking-tight text-ink tabular-nums md:text-6xl"
      >
        <span className="text-orange">{prefix}</span>
        <span ref={digitsRef}>{toLocaleDigits(target, locale)}</span>
        {suffix ? <span className="text-orange">{suffix}</span> : null}
      </span>
    </>
  )
}

export const AboutCompanyFactsClient = ({
  drivesEyebrow,
  drivesHeadline,
  driveItems,
  valuesTitle,
  valuePillars,
  statsTitle,
  stats,
  techTitle,
  techBody,
  locale,
}: AboutCompanyFactsClientProps) => {
  const reduced = useReducedMotion()
  const statsRef = useRef<HTMLDListElement>(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 })
  const isRtl = locale.startsWith("ar")

  const reveal = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, transform: "translateY(16px)" },
          whileInView: { opacity: 1, transform: "translateY(0px)" },
          transition: { duration: 0.9, delay, ease: EASE_OUT },
          // "some" so tall blocks still trigger on short viewports.
          viewport: { once: true, amount: "some" as const, margin: "0px 0px -6% 0px" },
        }

  return (
    <div className="bg-surface text-ink">
      <section
        aria-labelledby="about-drives-heading"
        className="px-4 py-20 sm:px-6 lg:py-28"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-start lg:gap-24">
          <motion.div {...reveal(0)} className="lg:sticky lg:top-28">
            <p
              className={cn(
                "font-label text-[11px] font-semibold text-ink-muted sm:text-xs",
                isRtl ? "tracking-normal" : "tracking-[0.18em] uppercase",
              )}
            >
              {drivesEyebrow}
            </p>
            <h2
              id="about-drives-heading"
              className="font-display mt-4 text-[clamp(2.2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold tracking-tight text-balance text-ink"
            >
              {drivesHeadline}
            </h2>
          </motion.div>

          <ul className="grid">
            {driveItems.map((item, index) => (
              <motion.li
                key={item.id}
                {...reveal(index * 0.08)}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-t border-ink/10 py-8 first:border-t-0 first:pt-0 md:gap-x-5"
              >
                <DriveArrow className={cn("mt-1.5", isRtl && "scale-x-[-1]")} />
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
                    {item.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="about-values-heading"
        className="border-t border-ink/10 px-4 py-20 sm:px-6 lg:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            id="about-values-heading"
            {...reveal(0)}
            className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl md:leading-[1.1]"
          >
            {valuesTitle}
          </motion.h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
            {valuePillars.map((pillar, index) => (
              <motion.li
                key={pillar.id}
                {...reveal(index * 0.06)}
                className="border-t border-ink/10 pt-6"
              >
                <p className="font-display text-4xl font-semibold tabular-nums text-orange md:text-5xl">
                  {toLocaleDigits(String(index + 1).padStart(2, "0"), locale)}
                </p>
                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted md:text-base">
                  {pillar.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="numbers-heading"
        className="px-4 pt-4 pb-20 sm:px-6 lg:pb-28"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            id="numbers-heading"
            {...reveal(0)}
            className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl md:leading-[1.1]"
          >
            {statsTitle}
          </motion.h2>

          <motion.dl
            ref={statsRef}
            {...reveal(0.1)}
            className="mt-12 grid grid-cols-2 gap-x-10 gap-y-12 md:mt-16 md:grid-cols-4 md:gap-x-12"
          >
            {stats.map((stat) => (
              <div key={stat.id} className="min-w-0 border-t border-ink/10 pt-6">
                <dt>
                  <StatCount
                    value={stat.value}
                    locale={locale}
                    active={statsInView}
                    reduced={reduced}
                  />
                </dt>
                <dd className="mt-3 text-sm leading-snug text-ink-muted md:text-base">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      <section
        aria-labelledby="about-tech-heading"
        className="border-t border-ink/10 px-4 py-20 sm:px-6 lg:py-28"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-24">
          <motion.h2
            id="about-tech-heading"
            {...reveal(0)}
            className="font-display max-w-[14ch] text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl md:leading-[1.1]"
          >
            {techTitle}
          </motion.h2>
          <motion.p
            {...reveal(0.08)}
            className="max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg"
          >
            {techBody}
          </motion.p>
        </div>
      </section>
    </div>
  )
}
