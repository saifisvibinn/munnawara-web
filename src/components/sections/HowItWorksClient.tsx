"use client"

import { LogoMark } from "@/components/landing/LogoMark"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
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
  const markRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const digit = digitRef.current
    const mark = markRef.current
    if (!root) return

    const busSection = root.previousElementSibling as HTMLElement | null
    const markBox = mark?.parentElement ?? null
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

    /**
     * Petal path, measured against the bus section's bottom edge (B):
     *  - B ≥ 85% vh  → petal sits fully behind the bus (hidden)
     *  - B → 35% vh  → it slides out from behind that edge down to its rest spot,
     *                  vertically centred on step 1
     *  - after that  → it holds still through steps 01-03 until About covers it.
     * Returns the desired top edge of the petal in viewport px.
     */
    const getMarkViewportTop = () => {
      const size = mark?.offsetHeight ?? 0
      const vh = window.innerHeight
      const restTop = vh * 0.5 - size / 2
      const edge = busSection ? busSection.getBoundingClientRect().bottom : 0
      const progress = easeOutCubic(clamp01((vh * 0.85 - edge) / (vh * 0.5)))
      const hiddenTop = edge - size
      return hiddenTop + (restTop - hiddenTop) * progress
    }

    const updateMark = () => {
      if (!mark || !markBox) return
      gsap.set(mark, { y: getMarkViewportTop() - markBox.getBoundingClientRect().top })
    }

    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll<HTMLElement>("[data-how-progress]").forEach((bar) => {
        bar.style.transform = "scaleX(0)"
      })
      if (mark && markBox) {
        gsap.set(mark, {
          y: window.innerHeight * 0.5 - mark.offsetHeight / 2 - markBox.getBoundingClientRect().top,
        })
      }
      return
    }

    const ctx = gsap.context(() => {
      if (mark) {
        updateMark()
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: updateMark,
          onRefresh: updateMark,
        })
      }

      const panels = gsap.utils.toArray<HTMLElement>("[data-how-step]")
      if (!panels.length) return

      // Digit changes only as the next step arrives (its top crosses 62% → 42% of the
      // viewport), then holds — no slow drift while the current step is still in view.
      if (digit) {
        const stepH = () => digit.querySelector("span")?.offsetHeight ?? 0
        gsap.set(digit, { y: 0 })
        panels.slice(1).forEach((panel, index) => {
          const stepIndex = index + 1
          gsap.fromTo(
            digit,
            { y: () => -stepH() * (stepIndex - 1) },
            {
              y: () => -stepH() * stepIndex,
              ease: "power2.inOut",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                start: "top 62%",
                end: "top 42%",
                scrub: 0.3,
                invalidateOnRefresh: true,
              },
            },
          )
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
      id="how-it-works"
      data-how-it-works
      className="relative z-10 -mt-[30vh] overflow-x-clip bg-surface-mint px-4 pt-[calc(30vh+4rem)] pb-16 sm:px-6 sm:pb-20 md:px-10 md:pb-24 lg:pb-28"
      aria-labelledby="how-it-works-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,color-mix(in_srgb,var(--brand-orange)_14%,transparent),transparent_60%),radial-gradient(ellipse_55%_45%_at_100%_100%,color-mix(in_srgb,var(--brand-blue)_10%,transparent),transparent_55%)]"
      />

      {/*
        Layer sandwich (not position:fixed):
        BusPassby z-20 → this section z-10 (petal sticky) → About z-20.
        Petal starts at the top (under the bus), slides down with the scroll
        while 01→03 scrub, and ends low so About covers it.
        h-0 sticky keeps page scroll normal.
      */}
      <div aria-hidden className="pointer-events-none sticky top-0 z-0 h-0">
        <div className="relative h-dvh w-full">
          <div
            ref={markRef}
            className={cn(
              "absolute top-0 size-[min(78vw,38rem)] opacity-[0.12] mix-blend-multiply will-change-transform dark:opacity-[0.18] dark:mix-blend-screen",
              isRtl ? "-start-[6%]" : "-end-[6%]",
            )}
          >
            <LogoMark className="size-full" idPrefix="how-works" />
          </div>
        </div>
      </div>

      <div className="relative z-[1] mx-auto max-w-[80rem]">
        <header className="sr-only">
          <p>{subtitle}</p>
          <h2 id="how-it-works-heading">{title}</h2>
        </header>

        <div
          className={
            isRtl
              ? "grid grid-cols-[auto_1fr] gap-4 md:gap-10 lg:gap-14"
              : "grid grid-cols-[auto_1fr] gap-4 md:grid-cols-[minmax(8rem,0.28fr)_1fr] md:gap-10 lg:grid-cols-[minmax(10rem,0.3fr)_1fr] lg:gap-16"
          }
        >
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
                        className="font-label mt-7 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-[transform,background-color] duration-100 ease-out hover:bg-orange active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 dark:ring-1 dark:ring-white/25 sm:mt-8"
                      >
                        {step.ctaLabel}
                      </a>
                    ) : (
                      <Link
                        href={step.ctaHref}
                        className="font-label mt-7 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-[transform,background-color] duration-100 ease-out hover:bg-orange active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100 dark:ring-1 dark:ring-white/25 sm:mt-8"
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
