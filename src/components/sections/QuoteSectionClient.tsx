"use client"

import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type QuoteSectionClientProps = {
  eyebrow: string
  headline: string
  body: string
  ariaLabel: string
}

export const QuoteSectionClient = ({
  eyebrow,
  headline,
  body,
  ariaLabel,
}: QuoteSectionClientProps) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const copy = section.querySelector<HTMLElement>("[data-quote-copy]")
    const form = section.querySelector<HTMLElement>("[data-quote-form]")

    if (reduced) {
      gsap.set([copy, form].filter(Boolean), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const targets = [copy, form].filter(Boolean) as HTMLElement[]

      gsap.fromTo(
        targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "top 42%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-quote-section
      className="relative isolate overflow-x-clip bg-surface-muted px-4 py-16 sm:px-6 sm:py-24 md:px-10 md:py-32"
      aria-label={ariaLabel}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,rgba(247,91,18,0.08),transparent_60%)]"
      />

      <div className="mx-auto grid max-w-[72rem] gap-8 sm:gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-14 lg:gap-16">
        <div
          data-quote-copy
          className="mx-auto max-w-md text-center md:mx-0 md:text-start"
        >
          <p className="font-label text-[0.7rem] font-semibold tracking-[0.18em] text-orange uppercase">
            {eyebrow}
          </p>
          <h2
            id="quote-heading"
            className="font-display mt-3 text-[1.85rem] leading-[1.15] font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl"
          >
            {headline}
          </h2>
          <p className="mx-auto mt-3 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink/50 sm:mt-4 sm:max-w-none sm:text-[1.05rem] md:mx-0">
            {body}
          </p>
        </div>

        <div data-quote-form className="min-w-0 w-full">
          <QuoteRequestForm />
        </div>
      </div>
    </section>
  )
}
