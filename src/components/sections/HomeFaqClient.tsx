"use client"

import { Accordion } from "@/components/ui/Accordion"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type FaqItem = {
  id: string
  question: string
  answer: string
}

type HomeFaqClientProps = {
  title: string
  subtitle: string
  ctaLabel: string
  items: readonly FaqItem[]
}

export const HomeFaqClient = ({
  title,
  subtitle,
  ctaLabel,
  items,
}: HomeFaqClientProps) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const copy = section.querySelector<HTMLElement>("[data-faq-copy]")
    const list = section.querySelector<HTMLElement>("[data-faq-list]")

    if (reduced) {
      gsap.set([copy, list].filter(Boolean), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const targets = [copy, list].filter(Boolean) as HTMLElement[]
      gsap.fromTo(
        targets,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "top 45%",
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
      data-home-faq
      className="relative overflow-x-clip bg-white px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36"
      aria-labelledby="home-faq-heading"
    >
      <div className="mx-auto grid max-w-[80rem] gap-12 md:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-14 lg:gap-20">
        <div data-faq-copy className="md:sticky md:top-[22vh]">
          <h2
            id="home-faq-heading"
            className="font-display max-w-[10ch] text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink/55 sm:text-lg">
            {subtitle}
          </p>
          <Link
            href="/contact"
            className="font-label mt-8 inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-orange hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            {ctaLabel}
          </Link>
        </div>

        <div data-faq-list className="min-w-0">
          <Accordion
            items={items.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>
      </div>
    </section>
  )
}
