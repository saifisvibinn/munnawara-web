"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
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
  steps: readonly HowStep[]
}

gsap.registerPlugin(ScrollTrigger)

export const HowItWorksClient = ({
  title,
  subtitle,
  steps,
}: HowItWorksClientProps) => {
  const reduced = useReducedMotion()
  const locale = useLocale()
  const rootRef = useRef<HTMLElement>(null)
  const direction = locale === "ar" ? 1 : -1

  useEffect(() => {
    if (reduced || !rootRef.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      const animateStep = (item: HTMLElement, index: number, withX: boolean) => {
        const numberEl = item.querySelector<HTMLElement>("[data-how-number]")
        const contentEls = item.querySelectorAll<HTMLElement>("[data-how-content]")

        if (numberEl) {
          gsap.set(numberEl, { yPercent: 110 })
          gsap.to(numberEl, {
            yPercent: 0,
            duration: 0.95,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          })
        }

        gsap.fromTo(
          contentEls,
          { opacity: 0, y: withX ? 36 : 24, x: withX ? 20 * direction : 0 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.85,
            delay: index * 0.05 + 0.06,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        )
      }

      mm.add("(min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-how-step]")
        items.forEach((item, index) => animateStep(item, index, true))
      })

      mm.add("(max-width: 767px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-how-step]")
        items.forEach((item, index) => animateStep(item, index, false))
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced, direction])

  return (
    <section
      ref={rootRef}
      className="overflow-x-clip bg-white px-4 py-16 sm:py-20 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl">
          <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-orange uppercase sm:text-xs sm:tracking-[0.24em]">
            {subtitle}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight break-words text-ink sm:mt-4 sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </div>

        <ol className="mt-10 divide-y divide-ink/8 border-y border-ink/8 sm:mt-16">
          {steps.map((step) => (
            <li
              key={step.id}
              data-how-step
              className="grid gap-4 py-8 sm:gap-6 sm:py-10 md:grid-cols-[9rem_1fr_auto] md:items-center md:gap-10 md:py-12"
            >
              <div className="h-12 overflow-hidden sm:h-14 md:h-[4.5rem]">
                <span
                  data-how-number
                  className="inline-block text-5xl font-semibold tracking-tight text-ink/15 sm:text-6xl md:text-7xl"
                >
                  {step.number}
                </span>
              </div>
              <div data-how-content className={`min-w-0 ${reduced ? "" : "opacity-0"}`}>
                <h3 className="text-xl font-semibold tracking-tight break-words text-ink sm:text-2xl md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60 sm:mt-3 sm:text-base">
                  {step.description}
                </p>
              </div>
              {step.ctaLabel && step.ctaHref ? (
                step.ctaHref.startsWith("#") ? (
                  <a
                    data-how-content
                    href={step.ctaHref}
                    className={`font-label inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:w-fit ${reduced ? "" : "opacity-0"}`}
                  >
                    {step.ctaLabel}
                  </a>
                ) : (
                  <Link
                    data-how-content
                    href={step.ctaHref}
                    className={`font-label inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:w-fit ${reduced ? "" : "opacity-0"}`}
                  >
                    {step.ctaLabel}
                  </Link>
                )
              ) : (
                <span className="hidden md:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
