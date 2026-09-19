"use client"

import { OPEN_QUOTE_EVENT } from "@/components/layout/FloatingQuoteCta"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type CTABandClientProps = {
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
}

export const CTABandClient = ({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
}: CTABandClientProps) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const copy = section.querySelector<HTMLElement>("[data-cta-copy]")
    const action = section.querySelector<HTMLElement>("[data-cta-action]")

    if (reduced) {
      gsap.set([copy, action].filter(Boolean), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const targets = [copy, action].filter(Boolean) as HTMLElement[]
      gsap.fromTo(
        targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 48%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  const handleOpenQuote = () => {
    window.dispatchEvent(new Event(OPEN_QUOTE_EVENT))
  }

  return (
    <section
      ref={sectionRef}
      data-cta-band
      className="relative isolate overflow-hidden px-4 py-24 text-center sm:px-6 sm:py-32 md:px-10 md:py-40"
      aria-labelledby="cta-band-heading"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/hero/landing-sky.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/70 to-white/90" />
      </div>

      <div className="mx-auto max-w-3xl">
        <div data-cta-copy>
          <p className="font-label text-sm font-medium tracking-wide text-ink/50 sm:text-base">
            {eyebrow}
          </p>
          <h2
            id="cta-band-heading"
            className="font-display mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/55 sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div data-cta-action className="mt-10 sm:mt-12">
          <button
            type="button"
            onClick={handleOpenQuote}
            className="font-label inline-flex cursor-pointer items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  )
}
