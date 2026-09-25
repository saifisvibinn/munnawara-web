"use client"

import { SocialFollowButton } from "@/components/ui/SocialFollowButton"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLocale } from "next-intl"
import Image from "next/image"
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
  body: string
  primaryCta: string
  secondaryCta: string
  socialCta: string
  social: SocialLinks
  imageAlt: string
}

export const AboutPreviewClient = ({
  eyebrow,
  headlineLines,
  body,
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
      className="relative isolate min-h-[100dvh] overflow-hidden bg-ink text-white"
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
          className="object-cover object-center"
          sizes="130vw"
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
            "linear-gradient(to bottom, transparent 0%, rgb(250 247 244 / 0.35) 55%, var(--brand-surface) 100%)",
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

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
          {body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Link
            href="/about"
            className="font-label inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-orange hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
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
