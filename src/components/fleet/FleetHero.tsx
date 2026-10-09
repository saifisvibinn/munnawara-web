"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef } from "react"
import "./fleet.css"

gsap.registerPlugin(ScrollTrigger)

type FleetHeroProps = {
  title: string
  subtitle: string
  alt: string
  /** Names above each bus in the photo, left-to-right. */
  busLabels: readonly [string, string, string]
}

// Horizontal centre of each bus in the photo, as a fraction of image width.
const BUS_X = ["23%", "53%", "80%"] as const

export const FleetHero = ({
  title,
  subtitle,
  alt,
  busLabels,
}: FleetHeroProps) => {
  const reduced = useReducedMotion()
  const runway = useRef<HTMLElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const labels = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (reduced || !runway.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: runway.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      })
      // Headline lifts away; bus names fade in above each coach.
      tl.to(copy.current, { yPercent: -12, autoAlpha: 0, duration: 0.4 }, 0)
      tl.fromTo(
        labels.current?.children ?? [],
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.05 },
        0.28,
      )
      tl.to(labels.current, { autoAlpha: 0, duration: 0.2 }, 0.82)
    }, runway)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={runway}
      data-fleet-hero
      className="relative h-[180svh] motion-reduce:h-svh"
      aria-label={title}
    >
      <div className="fleet-hero sticky top-0 flex h-svh flex-col overflow-hidden">
        <div
          ref={copy}
          className="relative z-20 mx-auto w-full max-w-3xl shrink-0 px-4 pt-28 pb-4 text-center sm:pt-32 sm:pb-6 md:pt-36"
        >
          <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.02] font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[var(--fleet-hero-ink-muted)] sm:mt-5 sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="relative min-h-0 w-full flex-1">
          <div className="fleet-hero__image absolute inset-0">
            <Image
              src="/fleet/preview.webp"
              alt={alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_62%]"
            />
          </div>

          <ul
            ref={labels}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 hidden md:block"
          >
            {busLabels.map((name, i) => (
              <li
                key={name}
                className="absolute top-[8%] -translate-x-1/2 rounded-full bg-[var(--fleet-hero-ink)] px-4 py-1.5 text-sm font-medium whitespace-nowrap text-white opacity-0 motion-reduce:opacity-100"
                style={{ left: BUS_X[i] }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
