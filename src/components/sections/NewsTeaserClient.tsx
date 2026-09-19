"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type NewsItem = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  coverImage: string | null
}

type NewsTeaserClientProps = {
  title: string
  subtitle: string
  emptyMessage: string
  viewAllLabel: string
  readMoreLabel: string
  posts: readonly NewsItem[]
}

export const NewsTeaserClient = ({
  title,
  subtitle,
  emptyMessage,
  viewAllLabel,
  readMoreLabel,
  posts,
}: NewsTeaserClientProps) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const header = section.querySelector<HTMLElement>("[data-news-header]")
    const cards = gsap.utils.toArray<HTMLElement>("[data-news-card]")
    const footer = section.querySelector<HTMLElement>("[data-news-footer]")

    if (reduced) {
      gsap.set([header, footer, ...cards].filter(Boolean), {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      const reveal = (targets: HTMLElement | HTMLElement[], start = "top 78%") => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: Array.isArray(targets) ? 0.06 : 0,
            scrollTrigger: {
              trigger: section,
              start,
              end: "top 48%",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      if (header) reveal(header)
      if (cards.length) reveal(cards, "top 72%")
      if (footer) reveal(footer, "top 68%")
    }, section)

    return () => ctx.revert()
  }, [reduced, posts.length])

  return (
    <section
      ref={sectionRef}
      data-news-teaser
      className="relative overflow-x-clip bg-white px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36"
      aria-labelledby="news-teaser-heading"
    >
      <div className="mx-auto max-w-[80rem]">
        <header
          data-news-header
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="news-teaser-heading"
            className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/55 sm:text-lg">
            {subtitle}
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mx-auto mt-14 max-w-md text-center text-base text-ink/45">
            {emptyMessage}
          </p>
        ) : (
          <div className="mt-14 grid gap-8 sm:mt-16 md:grid-cols-3 md:gap-6 lg:gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                data-news-card
                className="group flex min-w-0 flex-col"
              >
                <Link
                  href={`/news/${post.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  aria-label={post.title}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-br from-ink/10 via-surface to-orange/15"
                    />
                  )}
                </Link>

                <div className="mt-5 flex flex-1 flex-col">
                  <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-ink transition group-hover:text-orange sm:text-2xl">
                    <Link
                      href={`/news/${post.slug}`}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/55 sm:text-base">
                    {post.excerpt}
                  </p>
                  <p className="font-label mt-4 text-xs tracking-wide text-ink/40">
                    {post.publishedAt}
                  </p>
                  <Link
                    href={`/news/${post.slug}`}
                    className="font-label mt-4 inline-flex text-sm font-semibold text-ink transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    {readMoreLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div data-news-footer className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/news"
            className="font-label inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3 text-sm font-semibold text-ink transition hover:border-orange hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
