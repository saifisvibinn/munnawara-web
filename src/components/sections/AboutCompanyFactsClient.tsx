"use client"

import type { AboutContent, AppLocale } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { toLocaleDigits } from "@/lib/localeDigits"
import { animate, motion, useInView } from "motion/react"
import { useLayoutEffect, useRef, type ReactNode } from "react"

const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** Long, soft landing: fast start, slow settle. All figures share it so they finish together. */
const COUNT_EASE = [0.16, 1, 0.3, 1] as const
const COUNT_DURATION = 2.6

/** Soft brand washes — keeps About facts off flat white without inventing hex. */
const ATMOSPHERE = {
  warm: "bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,color-mix(in_srgb,var(--brand-orange)_16%,transparent),transparent_58%),radial-gradient(ellipse_65%_50%_at_100%_100%,color-mix(in_srgb,var(--brand-blue)_11%,transparent),transparent_55%)]",
  cool: "bg-[radial-gradient(ellipse_70%_55%_at_100%_0%,color-mix(in_srgb,var(--brand-blue)_14%,transparent),transparent_58%),radial-gradient(ellipse_60%_50%_at_0%_100%,color-mix(in_srgb,var(--brand-wordmark)_10%,transparent),transparent_55%)]",
  ember: "bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,color-mix(in_srgb,var(--brand-orange)_18%,transparent),transparent_55%),radial-gradient(ellipse_55%_45%_at_90%_90%,color-mix(in_srgb,var(--brand-blue)_8%,transparent),transparent_50%)]",
  steel: "bg-[radial-gradient(ellipse_70%_55%_at_0%_40%,color-mix(in_srgb,var(--brand-blue)_13%,transparent),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_0%,color-mix(in_srgb,var(--brand-orange)_9%,transparent),transparent_50%)]",
} as const

type AtmosphereTone = keyof typeof ATMOSPHERE

const SectionShell = ({
  tone,
  base,
  labelledBy,
  children,
}: {
  tone: AtmosphereTone
  base: string
  labelledBy: string
  children: ReactNode
}) => (
  <section
    aria-labelledby={labelledBy}
    className={cn(
      "relative overflow-x-clip px-4 py-20 sm:px-6 lg:py-28",
      base,
    )}
  >
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", ATMOSPHERE[tone])}
    />
    <div className="relative z-[1]">{children}</div>
  </section>
)

type AboutCompanyFactsClientProps = {
  about: AboutContent
  locale: AppLocale
}

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
  about,
  locale,
}: AboutCompanyFactsClientProps) => {
  const {
    overviewTitle,
    overviewParagraphs,
    drivesEyebrow,
    drivesHeadline,
    driveItems,
    strategicObjectivesTitle,
    strategicObjectives,
    statsTitle,
    stats,
    techTitle,
    techBody,
  } = about
  const reduced = useReducedMotion()
  const statsRef = useRef<HTMLDListElement>(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 })
  const isRtl = locale === "ar"

  const reveal = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, transform: "translateY(16px)" },
          whileInView: { opacity: 1, transform: "translateY(0px)" },
          transition: { duration: 0.9, delay, ease: EASE_OUT },
          viewport: {
            once: true,
            amount: "some" as const,
            margin: "0px 0px -6% 0px",
          },
        }

  return (
    <div className="text-ink">
      <SectionShell
        tone="warm"
        base="bg-surface-mint"
        labelledBy="about-overview-heading"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:items-start lg:gap-20">
          <motion.h2
            id="about-overview-heading"
            {...reveal(0)}
            className="font-display max-w-[12ch] text-[clamp(2.2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold tracking-tight text-balance text-ink lg:sticky lg:top-28"
          >
            {overviewTitle}
          </motion.h2>
          <div className="space-y-5 text-base leading-[1.75] text-ink-muted md:text-lg md:leading-[1.8]">
            {overviewParagraphs.map((paragraph, index) => (
              <motion.p key={paragraph.slice(0, 40)} {...reveal(index * 0.06)}>
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        tone="cool"
        base="bg-surface-muted"
        labelledBy="about-drives-heading"
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
                className="border-t border-ink/10 py-8 first:border-t-0 first:pt-0"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
                  {item.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell
        tone="warm"
        base="bg-surface-mint"
        labelledBy="about-objectives-heading"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            id="about-objectives-heading"
            {...reveal(0)}
            className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl md:leading-[1.1]"
          >
            {strategicObjectivesTitle}
          </motion.h2>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
            {strategicObjectives.map((objective, index) => (
              <motion.li
                key={objective.id}
                {...reveal(index * 0.05)}
                className="border-t border-ink/15 pt-6"
              >
                <p className="font-display text-3xl font-semibold tabular-nums text-orange md:text-4xl">
                  {toLocaleDigits(String(index + 1).padStart(2, "0"), locale)}
                </p>
                <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-ink md:text-xl">
                  {objective.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted md:text-base">
                  {objective.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell
        tone="ember"
        base="bg-surface-muted"
        labelledBy="numbers-heading"
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
              <div key={stat.id} className="min-w-0 border-t border-ink/15 pt-6">
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
      </SectionShell>

      <SectionShell
        tone="steel"
        base="bg-surface-mint"
        labelledBy="about-tech-heading"
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
      </SectionShell>
    </div>
  )
}
