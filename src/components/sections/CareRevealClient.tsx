"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import type {
  CareRevealBenefitIcon,
  CareRevealContent,
} from "@/content/types"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, useMemo, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type CareRevealClientProps = {
  content: CareRevealContent
}

const splitWords = (text: string) =>
  text.split(/(\s+)/).filter((part) => part.length > 0)

const BenefitIcon = ({ name }: { name: CareRevealBenefitIcon }) => {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-5 text-ink sm:size-6",
    "aria-hidden": true as const,
  }

  if (name === "group") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3 3 0 0 1 0 5.74" />
      </svg>
    )
  }

  if (name === "signal") {
    return (
      <svg {...common}>
        <path d="M2 20h.01" />
        <path d="M7 20v-4" />
        <path d="M12 20v-8" />
        <path d="M17 20V8" />
        <path d="M22 4v16" />
      </svg>
    )
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H12" />
    </svg>
  )
}

export const CareRevealClient = ({ content }: CareRevealClientProps) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const bodyWords = useMemo(() => splitWords(content.body), [content.body])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const eyebrow = section.querySelector<HTMLElement>("[data-care-eyebrow]")
    const heading = section.querySelector<HTMLElement>("[data-care-heading]")
    const words = gsap.utils.toArray<HTMLElement>("[data-care-word]")
    const benefits = gsap.utils.toArray<HTMLElement>("[data-care-benefit]")

    if (reduced) {
      gsap.set([eyebrow, heading, ...words, ...benefits].filter(Boolean), {
        opacity: 1,
        y: 0,
        clearProps: "filter,transform",
      })
      return
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([eyebrow, heading, ...words, ...benefits].filter(Boolean), {
          opacity: 1,
          y: 0,
        })
      })

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isTablet, reduceMotion } = context.conditions ?? {}
          if (reduceMotion) return

          gsap.set(eyebrow, { opacity: 0.45, y: 8 })
          gsap.set(heading, { opacity: 0.45, y: isDesktop ? 22 : 14 })
          gsap.set(words, { opacity: 0.18 })
          gsap.set(benefits, { opacity: 0, y: 14 })

          const start = isDesktop ? "top 80%" : isTablet ? "top 82%" : "top 88%"
          const end = isDesktop ? "top 32%" : isTablet ? "top 38%" : "top 48%"

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: heading ?? section,
              start,
              end,
              scrub: isDesktop ? 0.5 : 0.35,
              invalidateOnRefresh: true,
            },
          })

          tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.2 }, 0)
          tl.to(heading, { opacity: 1, y: 0, duration: 0.35 }, 0)
          tl.to(
            words,
            {
              opacity: 1,
              duration: 0.3,
              stagger: isDesktop ? 0.024 : 0.016,
            },
            0.08,
          )
          tl.to(
            benefits,
            {
              opacity: 1,
              y: 0,
              duration: 0.28,
              stagger: 0.05,
            },
            0.55,
          )
        },
      )
    }, section)

    return () => ctx.revert()
  }, [reduced, bodyWords])

  return (
    <section
      ref={sectionRef}
      data-care-reveal
      className="relative overflow-x-clip bg-surface px-4 pt-14 pb-20 sm:px-6 sm:pt-16 sm:pb-28 md:px-10 md:pt-20 md:pb-36 lg:pb-44"
      aria-labelledby="care-reveal-heading"
    >
      <div className="mx-auto max-w-[80rem]">
        <p
          data-care-eyebrow
          className="font-label text-[11px] font-semibold tracking-[0.22em] text-orange uppercase sm:text-xs sm:tracking-[0.26em]"
        >
          {content.eyebrow}
        </p>

        <h2
          id="care-reveal-heading"
          data-care-heading
          className="font-display mt-5 max-w-[16ch] text-[clamp(1.85rem,6.5vw,4.25rem)] leading-[1.12] font-bold tracking-tight text-ink sm:mt-6 sm:max-w-[18ch] sm:leading-[1.1]"
        >
          <span className="block">{content.headingLines[0]}</span>
          <span className="block">{content.headingLines[1]}</span>
        </h2>

        <p
          data-care-body
          className="mt-7 max-w-3xl text-[clamp(1.05rem,2.6vw,1.65rem)] leading-[1.7] font-medium text-ink sm:mt-9 sm:leading-[1.65] md:mt-11 md:max-w-4xl"
        >
          {bodyWords.map((part, index) =>
            /^\s+$/.test(part) ? (
              <span key={`s-${index}`}>{part}</span>
            ) : (
              <span key={`w-${index}`} data-care-word className="inline">
                {part}
              </span>
            ),
          )}
        </p>

        {content.benefits.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 border-t border-ink/10 sm:mt-14 sm:grid-cols-2 md:mt-16">
            {content.benefits.map((benefit, index) => (
              <li
                key={benefit.id}
                data-care-benefit
                className={[
                  "border-b border-ink/10 py-7 sm:py-8",
                  index % 2 === 0 ? "sm:border-e sm:pe-8 md:pe-12" : "sm:ps-8 md:ps-12",
                ].join(" ")}
              >
                <div className="flex flex-col items-start gap-3 sm:gap-3.5">
                  <BenefitIcon name={benefit.icon} />
                  <p className="max-w-[28ch] text-[0.95rem] leading-[1.45] font-medium tracking-tight text-ink sm:text-base md:max-w-[32ch]">
                    {benefit.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
