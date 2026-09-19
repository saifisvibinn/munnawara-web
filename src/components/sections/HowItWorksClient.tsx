"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { toLocaleDigits } from "@/lib/localeDigits"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLocale } from "next-intl"
import { useEffect, useRef } from "react"

type HowStep = {
  id: string
  number: string
  title: string
  description: string
  ctaLabel: string | null
  ctaHref: string | null
}

type HowItWorksClientProps = {
  title: string
  subtitle: string
  stepPrefix: string
  steps: readonly HowStep[]
}

gsap.registerPlugin(ScrollTrigger)

export const HowItWorksClient = ({
  title,
  subtitle,
  stepPrefix,
  steps,
}: HowItWorksClientProps) => {
  const reduced = useReducedMotion()
  const locale = useLocale()
  const isRtl = locale === "ar"
  const rootRef = useRef<HTMLElement>(null)
  const digitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const digit = digitRef.current
    if (!root) return

    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll<HTMLElement>("[data-how-progress]").forEach((bar) => {
        bar.style.transform = "scaleX(0)"
      })
      return
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-how-step]")
      if (!panels.length) return

      const list = root.querySelector("ol")
      const first = panels[0]
      const last = panels[panels.length - 1]

      if (digit && first && last) {
        const stepH = () => digit.querySelector("span")?.offsetHeight ?? 0
        gsap.set(digit, { y: 0 })
        gsap.to(digit, {
          y: () => -stepH() * (steps.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: list ?? root,
            start: () => `top ${window.innerHeight * 0.35}`,
            end: () => {
              const lastBottom = last.getBoundingClientRect().bottom + window.scrollY
              const listTop = (list ?? root).getBoundingClientRect().top + window.scrollY
              return `+=${Math.max(lastBottom - listTop - window.innerHeight * 0.35, 400)}`
            },
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        })
      }

      panels.forEach((panel) => {
        const bar = panel.querySelector<HTMLElement>("[data-how-progress]")
        if (!bar) return
        gsap.set(bar, {
          scaleX: 1,
          transformOrigin: isRtl ? "100% 50%" : "0% 50%",
        })
        gsap.to(bar, {
          scaleX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top 42%",
            end: "bottom 42%",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [reduced, steps.length, isRtl])

  return (
    <section
      ref={rootRef}
      data-how-it-works
      className="relative overflow-x-clip bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:py-28"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-[80rem]">
        <header className="sr-only">
          <p>{subtitle}</p>
          <h2 id="how-it-works-heading">{title}</h2>
        </header>

        <div className="grid grid-cols-[auto_1fr] gap-4 md:grid-cols-[minmax(8rem,0.28fr)_1fr] md:gap-10 lg:grid-cols-[minmax(10rem,0.3fr)_1fr] lg:gap-16">
          {/* Sticky digit column — numerals stay LTR (including Arabic-Indic) */}
          <div className="pointer-events-none relative" aria-hidden>
            <div
              dir="ltr"
              className="sticky top-[18vh] flex items-start justify-start text-ink md:top-[22vh]"
            >
              {!isRtl ? (
                <span className="font-numeral text-[clamp(3.5rem,14vw,9rem)] leading-none font-bold tracking-tight">
                  0
                </span>
              ) : null}
              <div className="h-[clamp(3.5rem,14vw,9rem)] w-[0.65em] overflow-hidden text-[clamp(3.5rem,14vw,9rem)]">
                <div ref={digitRef} className="flex flex-col will-change-transform">
                  {steps.map((step) => (
                    <span
                      key={step.id}
                      className="font-numeral flex h-[1em] items-start text-[1em] leading-none font-bold tracking-tight"
                    >
                      {toLocaleDigits(step.number.slice(-1), locale)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling step panels */}
          <ol className="min-w-0">
            {steps.map((step, index) => {
              const stepIndex = Number.parseInt(step.number, 10) || index + 1
              const stepLabel = `${stepPrefix} ${toLocaleDigits(stepIndex, locale)}`

              return (
                <li
                  key={step.id}
                  data-how-step
                  className="min-h-[65vh] border-b border-ink/10 py-12 first:border-t first:border-ink/10 sm:min-h-[70vh] sm:py-14 md:py-16 lg:py-20"
                >
                  <div className="relative h-0.5 w-full overflow-hidden bg-ink/10">
                    <div
                      data-how-progress
                      className="absolute inset-y-0 start-0 w-full bg-orange"
                    />
                  </div>

                  <p className="font-label mt-5 text-[13px] font-semibold tracking-tight text-ink sm:mt-6">
                    {stepLabel}
                  </p>

                  <h3 className="mt-3 max-w-[18ch] text-[clamp(1.75rem,3.8vw,2.75rem)] leading-[1.15] font-semibold tracking-tight text-ink sm:mt-4">
                    {step.title}
                  </h3>

                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed font-medium text-ink/65 sm:mt-5 sm:text-base md:leading-[1.7]">
                    {step.description}
                  </p>

                  {step.ctaLabel && step.ctaHref ? (
                    step.ctaHref.startsWith("#") ? (
                      <a
                        href={step.ctaHref}
                        className="font-label mt-7 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:mt-8"
                      >
                        {step.ctaLabel}
                      </a>
                    ) : (
                      <Link
                        href={step.ctaHref}
                        className="font-label mt-7 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:mt-8"
                      >
                        {step.ctaLabel}
                      </Link>
                    )
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
