"use client"

import { getStatIcon } from "@/components/sections/statIcons"
import { SocialFollowButton } from "@/components/ui/SocialFollowButton"
import type { AboutStat } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import { toLocaleDigits } from "@/lib/localeDigits"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLocale } from "next-intl"
import { SiteImage as Image } from "@/components/ui/SiteImage"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type SocialLinks = {
  handle: string
  twitter?: string
  facebook?: string
  instagram?: string
  snapchat?: string
}

type AboutPreviewClientProps = {
  eyebrow: string
  headlineLines: readonly [string, string]
  stats: readonly AboutStat[]
  primaryCta: string
  secondaryCta: string
  socialCta: string
  social: SocialLinks
  imageAlt: string
}

export const AboutPreviewClient = ({
  eyebrow,
  headlineLines,
  stats,
  primaryCta,
  secondaryCta,
  socialCta,
  social,
  imageAlt,
}: AboutPreviewClientProps) => {
  const reduced = useReducedMotion()
  const locale = useLocale()
  const isRtl = locale === "ar"
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    if (!section || !media) return

    if (reduced) {
      gsap.set(media, { x: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const getPan = () => {
        const overflow = Math.max(0, media.offsetWidth - window.innerWidth)
        return isRtl ? overflow * 0.35 : -overflow * 0.35
      }

      gsap.fromTo(
        media,
        { x: isRtl ? getPan() : 0 },
        {
          x: () => (isRtl ? 0 : getPan()),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [reduced, isRtl])

  return (
    <section
      ref={sectionRef}
      data-about-preview
      className="relative z-20 isolate min-h-[100dvh] overflow-hidden bg-black text-white"
      aria-labelledby="about-preview-heading"
    >
      <div
        ref={mediaRef}
        className="absolute inset-y-0 start-0 w-[130vw] max-w-none will-change-transform"
        aria-hidden
      >
        <Image
          src="/hero/landing-sky.jpg"
          alt=""
          fill
          sizes="130vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: [
            "linear-gradient(to bottom, rgb(0 0 0 / 0.45) 0%, rgb(0 0 0 / 0.28) 45%, rgb(0 0 0 / 0.55) 100%)",
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgb(0 0 0 / 0.35) 100%)",
          ].join(", "),
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--brand-surface) 55%, transparent) 55%, var(--brand-surface) 100%)",
        }}
      />

      <div
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 py-24 text-center md:px-10 md:py-28"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <p
          className={cn(
            "font-label text-[11px] font-semibold text-orange sm:text-xs",
            isRtl ? "tracking-normal" : "tracking-[0.22em] uppercase",
          )}
        >
          {eyebrow}
        </p>

        <h2
          id="about-preview-heading"
          className="font-display mt-5 max-w-[16ch] text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] font-bold tracking-tight text-white sm:mt-6"
        >
          <span className="block">{headlineLines[0]}</span>
          <span className="block">{headlineLines[1]}</span>
        </h2>

        <dl className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-x-4 gap-y-8 sm:mt-12 sm:gap-x-8 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = getStatIcon(stat.id)
            return (
              <div key={stat.id} className="min-w-0">
                <dt className="flex flex-col items-center gap-2">
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-orange">
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">
                    {toLocaleDigits(stat.value, locale)}
                  </span>
                </dt>
                <dd className="mt-1.5 text-xs leading-snug text-white/70 sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            )
          })}
        </dl>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Link
            href="/about"
            className="font-label inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-[transform,background-color,color] duration-100 ease-out hover:bg-orange hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            {primaryCta}
          </Link>
          <Link
            href="/contact"
            className="font-label inline-flex cursor-pointer items-center justify-center rounded-full border border-white/40 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {secondaryCta}
          </Link>
          <SocialFollowButton label={socialCta} links={social} tone="light" />
        </div>

        <span className="sr-only">{imageAlt}</span>
      </div>
    </section>
  )
}
