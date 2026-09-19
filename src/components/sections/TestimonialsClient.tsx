"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useLayoutEffect, useMemo, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type TestimonialItem = {
  id: string
  quote: string
  name: string
  role: string
  avatar: string | null
}

type ClientItem = {
  id: string
  label: string
  description: string
}

type TestimonialsClientProps = {
  title: string
  subtitle: string
  ctaLabel: string
  emptyMessage: string
  items: readonly TestimonialItem[]
  clients: readonly ClientItem[]
}

const splitColumns = <T,>(items: readonly T[]): [T[], T[]] => {
  const left: T[] = []
  const right: T[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) left.push(item)
    else right.push(item)
  })
  return [left, right]
}

export const TestimonialsClient = ({
  title,
  subtitle,
  ctaLabel,
  emptyMessage,
  items,
  clients,
}: TestimonialsClientProps) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const hasTestimonials = items.length > 0
  const hasClients = clients.length > 0

  const [testimonialLeft, testimonialRight] = useMemo(
    () => splitColumns(items),
    [items],
  )
  const [clientLeft, clientRight] = useMemo(
    () => splitColumns(clients),
    [clients],
  )

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const copy = section.querySelector<HTMLElement>("[data-partners-copy]")
    const cols = gsap.utils.toArray<HTMLElement>("[data-partners-col]")

    if (reduced) {
      gsap.set([copy, ...cols].filter(Boolean), { clearProps: "all", opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      if (copy) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 45%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      // Column parallax only from sm up — on phones a single stack + opposing Y causes overlap
      ScrollTrigger.matchMedia({
        "(min-width: 640px)": () => {
          cols.forEach((col, index) => {
            const direction = index % 2 === 0 ? -1 : 1
            gsap.fromTo(
              col,
              { y: 48 * direction },
              {
                y: -48 * direction,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                },
              },
            )
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduced, hasTestimonials, hasClients])

  return (
    <section
      ref={sectionRef}
      data-partners
      className="relative overflow-x-clip bg-surface-muted px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto grid max-w-[80rem] gap-12 md:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-14 lg:gap-20">
        <div
          data-partners-copy
          className="md:sticky md:top-[22vh]"
        >
          <h2
            id="partners-heading"
            className="font-display max-w-[12ch] text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink/55 sm:text-lg">
            {subtitle}
          </p>
          <Link
            href="/contact"
            className="font-label mt-8 inline-flex items-center justify-center rounded-full border border-ink/15 bg-transparent px-6 py-3 text-sm font-semibold text-ink transition hover:border-orange hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            {ctaLabel}
          </Link>
        </div>

        <div className="min-w-0">
          {hasTestimonials ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div data-partners-col className="flex flex-col gap-4 sm:gap-5">
                {testimonialLeft.map((item) => (
                  <TestimonialCard key={item.id} item={item} />
                ))}
              </div>
              <div
                data-partners-col
                className="flex flex-col gap-4 sm:mt-10 sm:gap-5"
              >
                {testimonialRight.map((item) => (
                  <TestimonialCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : hasClients ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div data-partners-col className="flex flex-col gap-4 sm:gap-5">
                {clientLeft.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
              <div
                data-partners-col
                className="flex flex-col gap-4 sm:mt-10 sm:gap-5"
              >
                {clientRight.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-base text-ink/45">{emptyMessage}</p>
          )}
        </div>
      </div>
    </section>
  )
}

const TestimonialCard = ({ item }: { item: TestimonialItem }) => (
  <figure className="rounded-2xl bg-white px-6 py-7 sm:px-7 sm:py-8">
    <blockquote>
      <p className="text-base leading-relaxed text-ink sm:text-lg">
        “{item.quote}”
      </p>
    </blockquote>
    <figcaption className="mt-6 flex items-center gap-3">
      {item.avatar ? (
        <Image
          src={item.avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-10 items-center justify-center rounded-full bg-orange/10 text-sm font-semibold text-orange"
        >
          {item.name.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0 text-start">
        <p className="font-label text-sm font-semibold text-ink">{item.name}</p>
        <p className="text-xs text-ink/50">{item.role}</p>
      </div>
    </figcaption>
  </figure>
)

const ClientCard = ({ client }: { client: ClientItem }) => (
  <article className="rounded-2xl bg-white px-6 py-7 sm:px-7 sm:py-8">
    <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
      {client.label}
    </h3>
    <p className="mt-3 text-sm leading-relaxed text-ink/55 sm:text-base">
      {client.description}
    </p>
  </article>
)
