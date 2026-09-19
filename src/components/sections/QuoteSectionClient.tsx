"use client"

import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type QuoteSectionClientProps = {
  eyebrow: string
  headline: string
  body: string
  ariaLabel: string
  whatsappNumber: string
  whatsappPrefill: string
}

export const QuoteSectionClient = ({
  eyebrow,
  headline,
  body,
  ariaLabel,
  whatsappNumber,
  whatsappPrefill,
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
      id="quote-section"
      data-quote-section
      className="relative isolate overflow-hidden bg-surface px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36"
      aria-label={ariaLabel}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
      >
        <Image
          src="/hero/landing-sky.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/70 via-surface/85 to-surface" />
      </div>

      <div className="mx-auto grid max-w-[80rem] gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start md:gap-16 lg:gap-20">
        <div data-quote-copy className="md:sticky md:top-[22vh]">
          <p className="font-label text-xs font-semibold tracking-[0.18em] text-orange uppercase">
            {eyebrow}
          </p>
          <h2
            id="quote-heading"
            className="font-display mt-4 max-w-[18ch] text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            {headline}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/55 sm:text-lg">
            {body}
          </p>
        </div>

        <div data-quote-form>
          <QuoteRequestForm
            whatsappNumber={whatsappNumber}
            whatsappPrefill={whatsappPrefill}
            className="border-ink/8 bg-white/90 shadow-sm backdrop-blur-sm"
          />
        </div>
      </div>
    </section>
  )
}
