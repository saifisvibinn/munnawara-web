"use client"

import type { AboutFilmContent } from "@/content/types"
import { LogoMark } from "@/components/landing/LogoMark"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import "@/styles/about-film.css"

gsap.registerPlugin(ScrollTrigger)

type AboutFilmProps = {
  film: AboutFilmContent
  pageTitle: string
}

const FLEET_FRAMES = [
  "/fleet/premium-vip-2026/exterior/pv-col.webp",
  "/fleet/coach-2025-2026/cover.webp",
  "/fleet/city-2025.png",
  "/fleet/premium-vip-2026/interior/pv-in-1.webp",
] as const

const DETAIL_FRAMES = [
  "/fleet/premium-vip-2026/exterior/pv-out-1.webp",
  "/fleet/premium-vip-2026/exterior/pv-out-3.webp",
  "/hero/quote-ticket-bus.jpg",
  "/fleet/coach-2025-2026/cover.webp",
] as const

export const AboutFilm = ({ film, pageTitle }: AboutFilmProps) => {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions ?? {}
          if (reduceMotion) return

          const scrub = isDesktop ? 0.28 : 0.18
          const depth = isDesktop ? 1 : 0.45

          /* —— Scene 01: Journey —— */
          const journey = root.querySelector<HTMLElement>("[data-af-journey]")
          if (journey) {
            const logo = journey.querySelector("[data-af-journey-logo]")
            const headline = journey.querySelector("[data-af-journey-headline]")
            const support = journey.querySelector("[data-af-journey-support]")
            const sky = journey.querySelector("[data-af-journey-sky]")

            // First viewport stays readable — motion only evolves on scroll.
            gsap.set(logo, { opacity: 1, y: 0, scale: 1 })
            gsap.set(headline, { opacity: 1, y: 0 })
            gsap.set(support, { opacity: 0.9, y: 0 })
            gsap.set(sky, { scale: 1.08, yPercent: -2 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: journey,
                start: "top top",
                end: "bottom bottom",
                scrub,
                invalidateOnRefresh: true,
              },
            })

            tl.to(sky, { scale: 1, yPercent: 4, duration: 1 }, 0)
              .to(logo, { opacity: 0.55, scale: 0.94, y: -8, duration: 0.35 }, 0.4)
              .to(headline, { y: -28 * depth, opacity: 0.55, duration: 0.4 }, 0.45)
              .to(support, { opacity: 0.2, y: -16, duration: 0.25 }, 0.5)
          }

          /* —— Scene 02: World —— */
          const world = root.querySelector<HTMLElement>("[data-af-world]")
          if (world) {
            const media = world.querySelector("[data-af-world-media]")
            const copy = world.querySelector("[data-af-world-copy]")
            const title = world.querySelector("[data-af-world-title]")
            const body = world.querySelector("[data-af-world-body]")

            gsap.set(media, { scale: 1.18, filter: "blur(8px)", opacity: 0.55 })
            gsap.set([title, body].filter(Boolean), { opacity: 0, y: 36 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: world,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to(media, { scale: 1, filter: "blur(0px)", opacity: 1, duration: 0.45 }, 0)
              .to(title, { opacity: 1, y: 0, duration: 0.2 }, 0.18)
              .to(body, { opacity: 1, y: 0, duration: 0.18 }, 0.28)
              .to(copy, { y: -18 * depth, duration: 0.35 }, 0.55)
              .to(media, { scale: 1.04, opacity: 0.55, duration: 0.3 }, 0.72)
          }

          /* —— Scene 03: Problem —— */
          const problem = root.querySelector<HTMLElement>("[data-af-problem]")
          if (problem) {
            const head = problem.querySelector("[data-af-problem-head]")
            const lines = gsap.utils.toArray<HTMLElement>("[data-af-problem-line]", problem)

            gsap.set(head, { opacity: 0, y: 24 })
            gsap.set(lines, { opacity: 0, y: 48, filter: "blur(6px)" })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: problem,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to(head, { opacity: 1, y: 0, duration: 0.12 }, 0)
              .to(head, { opacity: 0.2, y: -28, duration: 0.12 }, 0.18)

            lines.forEach((line, index) => {
              const start = 0.2 + index * 0.17
              tl.to(
                line,
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.12 },
                start,
              )
              if (index < lines.length - 1) {
                tl.to(
                  line,
                  { opacity: 0, y: -28 * depth, filter: "blur(3px)", duration: 0.1 },
                  start + 0.14,
                )
              } else {
                tl.to(line, { opacity: 1, scale: 1, duration: 0.1 }, start + 0.12)
              }
            })
          }

          /* —— Scene 04: Connection —— */
          const connection = root.querySelector<HTMLElement>("[data-af-connection]")
          if (connection) {
            const nodes = gsap.utils.toArray<HTMLElement>("[data-af-node]", connection)
            const lines = gsap.utils.toArray<HTMLElement>("[data-af-node-line]", connection)
            const title = connection.querySelector("[data-af-connection-title]")
            const body = connection.querySelector("[data-af-connection-body]")
            const companies = gsap.utils.toArray<HTMLElement>(
              "[data-af-company]",
              connection,
            )

            gsap.set(nodes, { opacity: 0, scale: 0.5 })
            gsap.set(lines, { scaleX: 0, opacity: 0 })
            gsap.set([title, body].filter(Boolean), { opacity: 0, y: 28 })
            gsap.set(companies, { opacity: 0, y: 24 })

            // Keep dots inside the stage — never stranded in page corners.
            const positions = isDesktop
              ? [
                  { x: "-18%", y: "-22%" },
                  { x: "20%", y: "-18%" },
                  { x: "-22%", y: "20%" },
                  { x: "18%", y: "22%" },
                  { x: "0%", y: "-26%" },
                  { x: "0%", y: "24%" },
                ]
              : [
                  { x: "-16%", y: "-18%" },
                  { x: "16%", y: "-16%" },
                  { x: "-14%", y: "18%" },
                  { x: "14%", y: "16%" },
                  { x: "0%", y: "-20%" },
                  { x: "0%", y: "20%" },
                ]

            nodes.forEach((node, index) => {
              const pos = positions[index % positions.length]
              gsap.set(node, { x: pos.x, y: pos.y })
            })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: connection,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to(nodes, { opacity: 0.75, scale: 1, duration: 0.12, stagger: 0.02 }, 0)
              .to(
                nodes,
                { x: 0, y: 0, duration: 0.32, stagger: 0.02, ease: "none" },
                0.12,
              )
              .to(lines, { scaleX: 1, opacity: 0.45, duration: 0.18, stagger: 0.03 }, 0.28)
              .to(title, { opacity: 1, y: 0, duration: 0.14 }, 0.38)
              .to(body, { opacity: 1, y: 0, duration: 0.14 }, 0.44)
              .to(lines, { opacity: 0, duration: 0.12 }, 0.46)
              .to(nodes, { opacity: 0, scale: 0.4, duration: 0.14 }, 0.48)
              .to(companies, { opacity: 1, y: 0, duration: 0.16, stagger: 0.03 }, 0.52)
          }

          /* —— Scene 05: Fleet —— */
          const fleet = root.querySelector<HTMLElement>("[data-af-fleet]")
          if (fleet) {
            const frame = fleet.querySelector("[data-af-fleet-frame]")
            const images = gsap.utils.toArray<HTMLElement>("[data-af-fleet-img]", fleet)
            const captions = gsap.utils.toArray<HTMLElement>(
              "[data-af-fleet-caption]",
              fleet,
            )
            const title = fleet.querySelector("[data-af-fleet-title]")
            const body = fleet.querySelector("[data-af-fleet-body]")

            gsap.set(frame, {
              rotateY: -8 * depth,
              rotateX: 4 * depth,
              y: 40,
              opacity: 0.4,
            })
            gsap.set(images, { opacity: 0 })
            gsap.set(images[0], { opacity: 1 })
            gsap.set(captions, { opacity: 0, y: 12 })
            gsap.set(captions[0], { opacity: 1, y: 0 })
            gsap.set([title, body].filter(Boolean), { opacity: 0, y: 24 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: fleet,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to(title, { opacity: 1, y: 0, duration: 0.12 }, 0)
              .to(body, { opacity: 1, y: 0, duration: 0.12 }, 0.08)
              .to(
                frame,
                {
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                  rotateX: 0,
                  duration: 0.35,
                },
                0.1,
              )

            images.forEach((img, index) => {
              if (index === 0) return
              const at = 0.28 + (index - 1) * 0.16
              tl.to(images[index - 1], { opacity: 0, duration: 0.1 }, at)
                .to(img, { opacity: 1, duration: 0.1 }, at)
                .to(captions[index - 1], { opacity: 0, y: -10, duration: 0.08 }, at)
                .to(captions[index], { opacity: 1, y: 0, duration: 0.08 }, at + 0.02)
            })

            tl.to(
              frame,
              { rotateY: 8 * depth, rotateX: -3 * depth, scale: 0.96, duration: 0.25 },
              0.82,
            )
          }

          /* —— Scene 06: Two sides —— */
          const sides = root.querySelector<HTMLElement>("[data-af-sides]")
          if (sides) {
            const left = sides.querySelector("[data-af-side-left]")
            const right = sides.querySelector("[data-af-side-right]")
            const merge = sides.querySelector("[data-af-sides-merge]")

            gsap.set(left, { xPercent: isDesktop ? -28 : 0, y: isDesktop ? 0 : -40, opacity: 0.35 })
            gsap.set(right, { xPercent: isDesktop ? 28 : 0, y: isDesktop ? 0 : 40, opacity: 0.35 })
            gsap.set(merge, { opacity: 0, scale: 0.94 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sides,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to([left, right], { opacity: 1, duration: 0.15 }, 0)
              .to(
                left,
                { xPercent: 0, y: 0, duration: 0.4 },
                0.2,
              )
              .to(
                right,
                { xPercent: 0, y: 0, duration: 0.4 },
                0.2,
              )
              .to([left, right], { opacity: 0.25, scale: 0.94, duration: 0.2 }, 0.58)
              .to(merge, { opacity: 1, scale: 1, duration: 0.22 }, 0.62)
          }

          /* —— Scene 07: Details —— */
          const details = root.querySelector<HTMLElement>("[data-af-details]")
          if (details) {
            const frame = details.querySelector("[data-af-details-frame]")
            const images = gsap.utils.toArray<HTMLElement>("[data-af-details-img]", details)
            const lines = gsap.utils.toArray<HTMLElement>("[data-af-details-line]", details)
            const head = details.querySelector("[data-af-details-head]")

            gsap.set(head, { opacity: 0, y: 20 })
            gsap.set(frame, { scale: 1.08, opacity: 0.5 })
            gsap.set(images, { opacity: 0 })
            gsap.set(images[0], { opacity: 1 })
            gsap.set(lines, { opacity: 0, y: 30, filter: "blur(5px)" })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: details,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to(head, { opacity: 1, y: 0, duration: 0.1 }, 0)
              .to(frame, { scale: 1, opacity: 1, duration: 0.25 }, 0.05)
              .to(head, { opacity: 0.25, duration: 0.12 }, 0.18)

            lines.forEach((line, index) => {
              const at = 0.18 + index * 0.18
              if (index > 0) {
                tl.to(images[index - 1], { opacity: 0, duration: 0.1 }, at)
                  .to(images[index], { opacity: 1, duration: 0.1 }, at)
              }
              tl.to(
                line,
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.12 },
                at,
              )
              if (index < lines.length - 1) {
                tl.to(
                  line,
                  { opacity: 0, y: -18, filter: "blur(3px)", duration: 0.1 },
                  at + 0.15,
                )
              }
            })
          }

          /* —— Scene 08: Human —— */
          const human = root.querySelector<HTMLElement>("[data-af-human]")
          if (human) {
            const line1 = human.querySelector("[data-af-human-1]")
            const line2 = human.querySelector("[data-af-human-2]")
            gsap.set([line1, line2].filter(Boolean), { opacity: 0, y: 20 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: human,
                start: "top 70%",
                end: "center center",
                scrub: scrub * 0.8,
              },
            })

            tl.to(line1, { opacity: 1, y: 0, duration: 0.4 }, 0).to(
              line2,
              { opacity: 1, y: 0, duration: 0.35 },
              0.35,
            )
          }

          /* —— Scene 09: Brand —— */
          const brand = root.querySelector<HTMLElement>("[data-af-brand]")
          if (brand) {
            const mark = brand.querySelector("[data-af-brand-mark]")
            const line = brand.querySelector("[data-af-brand-line]")

            gsap.set(mark, { scale: 0.45, opacity: 0.3, filter: "blur(4px)" })
            gsap.set(line, { opacity: 0, y: 24 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: brand,
                start: "top top",
                end: "bottom bottom",
                scrub,
              },
            })

            tl.to(
              mark,
              { scale: 1.05, opacity: 1, filter: "blur(0px)", duration: 0.55 },
              0,
            )
              .to(line, { opacity: 1, y: 0, duration: 0.2 }, 0.32)
              .to(mark, { scale: 1.12, duration: 0.25 }, 0.7)
          }

          /* —— Scene 10 + CTA —— */
          const future = root.querySelector<HTMLElement>("[data-af-future]")
          if (future) {
            const title = future.querySelector("[data-af-future-title]")
            const body = future.querySelector("[data-af-future-body]")
            gsap.set([title, body].filter(Boolean), { opacity: 0, y: 28 })

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: future,
                  start: "top 75%",
                  end: "center center",
                  scrub: scrub * 0.7,
                },
              })
              .to(title, { opacity: 1, y: 0, duration: 0.4 }, 0)
              .to(body, { opacity: 1, y: 0, duration: 0.35 }, 0.25)
          }

          const cta = root.querySelector<HTMLElement>("[data-af-cta]")
          if (cta) {
            const parts = cta.querySelectorAll("[data-af-cta-reveal]")
            gsap.set(parts, { opacity: 0, y: 24 })
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: cta,
                  start: "top 70%",
                  end: "center center",
                  scrub: scrub * 0.7,
                },
              })
              .to(parts, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, 0)
          }
        },
      )

      // Lenis / late layout: refresh so pin distances match the real page.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }, root)

    return () => ctx.revert()
  }, [reduced, film])

  return (
    <article
      ref={rootRef}
      className="about-film"
      aria-label={pageTitle}
      data-about-film
    >
      {/* 01 — Journey */}
      <section className="about-film__scene about-film__pin" data-af-journey>
        <div className="about-film__sticky">
          <div className="about-film__sky" aria-hidden>
            <Image
              data-af-journey-sky
              src="/hero/landing-sky.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="about-film__veil" aria-hidden />
          <div className="about-film__content">
            <LogoMark
              data-af-journey-logo
              title={film.brandName}
              idPrefix="about-journey"
              className="about-film__logo"
            />
            <h1
              data-af-journey-headline
              className="about-film__display about-film__display--xl"
            >
              {film.journeyHeadline}
            </h1>
            <p data-af-journey-support className="about-film__body">
              {film.journeySupport}
            </p>
          </div>
        </div>
      </section>

      {/* 02 — World */}
      <section className="about-film__scene about-film__pin" data-af-world>
        <div className="about-film__sticky">
          <div className="about-film__sky" aria-hidden>
            <Image
              data-af-world-media
              src="/fleet/coach-2025-2026/cover.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="about-film__veil" aria-hidden />
          <div className="about-film__content" data-af-world-copy>
            <h2
              data-af-world-title
              className="about-film__display about-film__display--lg"
            >
              {film.worldHeadline}
            </h2>
            <p data-af-world-body className="about-film__body">
              {film.worldBody}
            </p>
          </div>
        </div>
      </section>

      {/* 03 — Problem */}
      <section
        className="about-film__scene about-film__pin about-film__pin--tall"
        data-af-problem
      >
        <div className="about-film__sticky bg-surface">
          <div className="about-film__stage">
            <h2
              data-af-problem-head
              className="about-film__display about-film__display--lg"
            >
              {film.problemHeadline}
            </h2>
            <div className="about-film__problem-stack absolute inset-0">
              {film.problemLines.map((line) => (
                <p
                  key={line}
                  data-af-problem-line
                  className="about-film__problem-line about-film__display"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Connection */}
      <section
        className="about-film__scene about-film__pin about-film__pin--tall"
        data-af-connection
      >
        <div className="about-film__sticky bg-surface-muted">
          <div className="about-film__stage">
            <div className="about-film__nodes" aria-hidden>
              {Array.from({ length: 6 }, (_, index) => (
                <span key={index} data-af-node className="about-film__node" />
              ))}
              {Array.from({ length: 4 }, (_, index) => (
                <span
                  key={`line-${index}`}
                  data-af-node-line
                  className="about-film__node-line"
                  style={{
                    top: `${42 + index * 4}%`,
                    insetInlineStart: "28%",
                    width: "44%",
                    rotate: `${(index - 1.5) * 8}deg`,
                  }}
                />
              ))}
            </div>
            <div className="about-film__content">
              <h2
                data-af-connection-title
                className="about-film__display about-film__display--lg"
              >
                {film.connectionHeadline}
              </h2>
              <p data-af-connection-body className="about-film__body">
                {film.connectionBody}
              </p>
              <div className="about-film__company-row">
                {film.companies.map((company) => (
                  <div
                    key={company.id}
                    data-af-company
                    className="about-film__company"
                  >
                    <Image
                      src={company.logo}
                      alt=""
                      width={120}
                      height={120}
                      className="rounded-xl"
                    />
                    <span>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Fleet */}
      <section
        className="about-film__scene about-film__pin about-film__pin--tall"
        data-af-fleet
      >
        <div className="about-film__sticky bg-surface">
          <div className="about-film__stage gap-8">
            <div className="about-film__content mb-2">
              <h2
                data-af-fleet-title
                className="about-film__display about-film__display--md"
              >
                {film.fleetHeadline}
              </h2>
              <p data-af-fleet-body className="about-film__body">
                {film.fleetBody}
              </p>
            </div>
            <div data-af-fleet-frame className="about-film__fleet-frame">
              {FLEET_FRAMES.map((src, index) => (
                <Image
                  key={src}
                  data-af-fleet-img
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 36rem"
                  className="object-cover"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                />
              ))}
              {film.fleetBeats.map((beat, index) => (
                <p
                  key={beat.id}
                  data-af-fleet-caption
                  className="about-film__fleet-caption"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                >
                  {beat.line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Two sides */}
      <section className="about-film__scene about-film__pin" data-af-sides>
        <div className="about-film__sticky bg-surface-muted">
          <div className="about-film__stage">
            <div className="about-film__split">
              <div data-af-side-left className="about-film__side">
                <Image
                  src="/brand/company-umrah.png"
                  alt=""
                  width={140}
                  height={140}
                  className="about-film__side-mark"
                />
                <p className="about-film__side-title">{film.sidesLeft}</p>
              </div>
              <div data-af-side-right className="about-film__side">
                <Image
                  src="/brand/company-group.png"
                  alt=""
                  width={140}
                  height={140}
                  className="about-film__side-mark"
                />
                <p className="about-film__side-title">{film.sidesRight}</p>
              </div>
            </div>
            <p data-af-sides-merge className="about-film__merge about-film__display">
              {film.sidesMerge}
            </p>
          </div>
        </div>
      </section>

      {/* 07 — Details */}
      <section
        className="about-film__scene about-film__pin about-film__pin--tall"
        data-af-details
      >
        <div className="about-film__sticky bg-surface">
          <div className="about-film__stage">
            <h2
              data-af-details-head
              className="about-film__display about-film__display--md absolute top-[18%] text-center"
            >
              {film.detailsHeadline}
            </h2>
            <div data-af-details-frame className="about-film__fleet-frame">
              {DETAIL_FRAMES.map((src, index) => (
                <Image
                  key={src}
                  data-af-details-img
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 36rem"
                  className="object-cover"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                />
              ))}
            </div>
            <div className="about-film__detail-stack absolute inset-x-0 top-0 bottom-0">
              {film.details.map((detail) => (
                <p
                  key={detail.id}
                  data-af-details-line
                  className="about-film__detail-line about-film__display"
                >
                  {detail.line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 08 — Human */}
      <section className="about-film__breath" data-af-human>
        <div className="mx-auto grid max-w-xl gap-6">
          <p
            data-af-human-1
            className="about-film__display about-film__display--md text-ink-muted"
          >
            {film.humanLine1}
          </p>
          <p data-af-human-2 className="about-film__display about-film__display--lg">
            {film.humanLine2}
          </p>
        </div>
      </section>

      {/* 09 — Brand */}
      <section className="about-film__scene about-film__pin about-film__pin--short" data-af-brand>
        <div className="about-film__sticky bg-surface">
          <div className="about-film__stage">
            <LogoMark
              data-af-brand-mark
              title={film.brandName}
              idPrefix="about-brand"
              className="about-film__brand-mark"
            />
            <p
              data-af-brand-line
              className="about-film__display about-film__display--md mt-8 text-wordmark"
            >
              {film.brandLine}
            </p>
          </div>
        </div>
      </section>

      {/* 10 — Future */}
      <section className="about-film__breath bg-surface" data-af-future>
        <div className="mx-auto grid max-w-2xl gap-4">
          <h2
            data-af-future-title
            className="about-film__display about-film__display--lg"
          >
            {film.futureHeadline}
          </h2>
          <p data-af-future-body className="about-film__body mx-auto">
            {film.futureBody}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="about-film__cta" data-af-cta>
        <div className="mx-auto grid max-w-2xl justify-items-center gap-3">
          <LogoMark
            data-af-cta-reveal
            title={film.brandName}
            idPrefix="about-cta"
            className="about-film__logo mb-4"
          />
          <h2
            data-af-cta-reveal
            className="about-film__display about-film__display--lg whitespace-pre-line"
          >
            {film.ctaHeadline}
          </h2>
          <p data-af-cta-reveal className="about-film__body">
            {film.ctaBody}
          </p>
          <Link
            data-af-cta-reveal
            href={film.ctaHref}
            className="about-film__cta-btn"
          >
            {film.ctaLabel}
          </Link>
        </div>
      </section>
    </article>
  )
}
