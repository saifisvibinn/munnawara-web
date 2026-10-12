"use client"

import { getStatIcon } from "@/components/sections/statIcons"
import { LogoMark } from "@/components/landing/LogoMark"
import type { AboutStat } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { toLocaleDigits } from "@/lib/localeDigits"
import { parseStatValue } from "@/lib/parseStatValue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type AboutOpenerProps = {
  locale: string
  brandName: string
  headline: string
  support: string
  ctaLabel: string
  ctaHref: string
  statsTitle: string
  stats: readonly AboutStat[]
  visionTitle: string
  vision: string
  missionTitle: string
  mission: string
}

export const AboutOpener = ({
  locale,
  brandName,
  headline,
  support,
  ctaLabel,
  ctaHref,
  statsTitle,
  stats,
  visionTitle,
  vision,
  missionTitle,
  mission,
}: AboutOpenerProps) => {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const formatCount = (prefix: string, value: number, suffix: string) =>
      `${prefix}${toLocaleDigits(Math.round(value), locale)}${suffix}`

    const counters = root.querySelectorAll<HTMLElement>("[data-af-count]")

    if (reduced) {
      counters.forEach((el) => {
        const target = Number(el.dataset.afCountTo ?? 0)
        const prefix = el.dataset.afCountPrefix ?? ""
        const suffix = el.dataset.afCountSuffix ?? ""
        el.textContent = formatCount(prefix, target, suffix)
      })
      return
    }

    const ctx = gsap.context(() => {
      const sky = root.querySelector<HTMLElement>("[data-af-opener-sky]")
      const fleet = root.querySelector<HTMLElement>("[data-af-opener-fleet]")
      const hero = root.querySelector<HTMLElement>("[data-af-opener-hero]")
      const story = root.querySelector<HTMLElement>("[data-af-opener-story]")
      const veil = root.querySelector<HTMLElement>("[data-af-opener-veil]")

      gsap.set(sky, { scale: 1.18, yPercent: -6 })
      gsap.set(fleet, { scale: 1.12, opacity: 0, yPercent: 8 })
      gsap.set(story, { opacity: 0, y: 36 })
      if (veil) gsap.set(veil, { opacity: 0.55 })

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      })

      scrubTl
        .to(sky, { scale: 1.04, yPercent: 4, duration: 1 }, 0)
        .to(fleet, { opacity: 0.55, scale: 1.02, yPercent: -2, duration: 0.7 }, 0.15)
        .to(veil, { opacity: 0.72, duration: 0.55 }, 0.25)
        .to(hero, { y: -28, opacity: 0.35, duration: 0.45 }, 0.35)
        .to(story, { opacity: 1, y: 0, duration: 0.35 }, 0.48)

      counters.forEach((el) => {
        const target = Number(el.dataset.afCountTo ?? 0)
        const prefix = el.dataset.afCountPrefix ?? ""
        const suffix = el.dataset.afCountSuffix ?? ""
        const state = { n: 0 }

        el.textContent = formatCount(prefix, 0, suffix)

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(state, {
              n: target,
              duration: 1.35,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = formatCount(prefix, state.n, suffix)
              },
            })
          },
        })
      })
    }, root)

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refreshFrame)
      ctx.revert()
    }
  }, [locale, reduced, stats])

  return (
    <section
      ref={rootRef}
      className="about-film__scene about-film__pin about-film__pin--opener"
      data-af-opener
      aria-labelledby="about-opener-heading"
    >
      <div className="about-film__sticky about-film__opener-sticky">
        <div className="about-film__opener-bg" aria-hidden>
          <Image
            data-af-opener-sky
            src="/hero/landing-sky.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="about-film__opener-layer object-cover"
          />
          <Image
            data-af-opener-fleet
            src="/photos/exterior/7725.webp"
            alt=""
            fill
            sizes="100vw"
            className="about-film__opener-layer about-film__opener-layer--fleet object-cover"
          />
        </div>

        <div
          data-af-opener-veil
          className="about-film__opener-veil"
          aria-hidden
        />

        <div className="about-film__opener-stack">
          <div data-af-opener-hero className="about-film__opener-hero">
            <LogoMark
              title={brandName}
              idPrefix="about-opener"
              className="about-film__logo about-film__opener-logo"
            />
            <h1
              id="about-opener-heading"
              className="about-film__display about-film__display--xl"
            >
              {brandName.replace(/-/g, "‑")}
            </h1>
            <p className="about-film__lead">{headline}</p>
            <p className="about-film__body about-film__opener-support">{support}</p>

            <Link href={ctaHref} className="about-film__cta-btn">
              {ctaLabel}
              <ArrowUpRight aria-hidden className="about-film__cta-arrow" size={18} />
            </Link>

            <dl className="about-film__opener-stats" aria-label={statsTitle}>
              {stats.map((stat) => {
                const Icon = getStatIcon(stat.id)
                const { prefix, target, suffix } = parseStatValue(stat.value)
                return (
                  <div key={stat.id} className="about-film__opener-stat">
                    <dt className="about-film__opener-stat-head">
                      <span className="about-film__opener-stat-icon">
                        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                      </span>
                      <span
                        data-af-count
                        data-af-count-to={target}
                        data-af-count-prefix={prefix}
                        data-af-count-suffix={suffix}
                        className="about-film__opener-stat-value"
                      >
                        {prefix}
                        {toLocaleDigits(reduced ? target : 0, locale)}
                        {suffix}
                      </span>
                    </dt>
                    <dd className="about-film__opener-stat-label">{stat.label}</dd>
                  </div>
                )
              })}
            </dl>
          </div>

          <div data-af-opener-story className="about-film__opener-story">
            <div className="about-film__opener-story-grid">
              <div>
                <h2 className="about-film__opener-story-title">{visionTitle}</h2>
                <p className="about-film__opener-story-body about-film__opener-story-body--strong">
                  {vision}
                </p>
              </div>
              <div>
                <h2 className="about-film__opener-story-title">{missionTitle}</h2>
                <p className="about-film__opener-story-body">{mission}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
