"use client"

import { LogoMark } from "@/components/landing/LogoMark"
import type { AboutLeader } from "@/content/types"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { Quote } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"

const EASE_OUT = [0.23, 1, 0.32, 1] as const

type AboutLeadershipProps = {
  title: string
  leaders: readonly AboutLeader[]
  locale: string
}

export const AboutLeadership = ({
  title,
  leaders,
  locale,
}: AboutLeadershipProps) => {
  const reduced = useReducedMotion()
  const isRtl = locale.startsWith("ar")

  const reveal = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, transform: "translateY(18px)" },
          whileInView: { opacity: 1, transform: "translateY(0px)" },
          transition: { duration: 0.95, delay, ease: EASE_OUT },
          viewport: {
            once: true,
            amount: "some" as const,
            margin: "0px 0px -6% 0px",
          },
        }

  return (
    <section
      aria-labelledby="about-leadership-heading"
      className="relative overflow-x-clip bg-surface-muted px-4 py-20 sm:px-6 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_15%_20%,color-mix(in_srgb,var(--brand-wordmark)_12%,transparent),transparent_58%),radial-gradient(ellipse_70%_55%_at_95%_85%,color-mix(in_srgb,var(--brand-orange)_12%,transparent),transparent_55%),radial-gradient(ellipse_50%_40%_at_50%_100%,color-mix(in_srgb,var(--brand-blue)_8%,transparent),transparent_50%)]"
      />

      <div className="relative z-[1] mx-auto max-w-6xl">
        <motion.h2
          id="about-leadership-heading"
          {...reveal(0)}
          className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl md:leading-[1.1]"
        >
          {title}
        </motion.h2>

        <ul className="mt-14 flex flex-col gap-20 lg:mt-20 lg:gap-28">
          {leaders.map((leader, index) => {
            const portraitFirst = index % 2 === 0
            // Watermark sits behind the message column on both alternating bands.
            const markOnEnd = portraitFirst
            return (
              <motion.li
                key={leader.id}
                {...reveal(0.06)}
                className={cn(
                  "relative grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20",
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-1/2 z-0 size-[min(72vw,34rem)] -translate-y-1/2 opacity-[0.12] mix-blend-multiply dark:opacity-[0.18] dark:mix-blend-screen",
                    markOnEnd ? "-end-[8%]" : "-start-[8%]",
                  )}
                >
                  <LogoMark
                    className="size-full"
                    idPrefix={`about-leadership-${leader.id}`}
                  />
                </div>

                <div
                  className={cn(
                    "relative z-[1] aspect-[3/4] w-full max-w-md overflow-hidden bg-surface-container/50 ring-1 ring-ink/8 lg:max-w-none",
                    portraitFirst ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  {leader.portraitSrc.endsWith(".svg") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={leader.portraitSrc}
                      alt={leader.portraitAlt}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : (
                    <Image
                      src={leader.portraitSrc}
                      alt={leader.portraitAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 28rem"
                    />
                  )}
                </div>

                <article
                  className={cn(
                    "relative z-[1] min-w-0",
                    portraitFirst ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <p
                    className={cn(
                      "font-label text-[11px] font-semibold text-orange sm:text-xs",
                      isRtl ? "tracking-normal" : "tracking-[0.14em] uppercase",
                    )}
                  >
                    {leader.role}
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    {leader.name}
                  </h3>

                  <blockquote className="mt-8">
                    <Quote
                      aria-hidden
                      className={cn(
                        "mb-4 size-8 text-orange md:size-9",
                        !isRtl && "scale-x-[-1]",
                      )}
                      strokeWidth={1.5}
                    />
                    <div className="space-y-5 text-base leading-[1.75] text-ink-muted md:text-lg md:leading-[1.8]">
                      {leader.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                    <Quote
                      aria-hidden
                      className={cn(
                        "ms-auto mt-4 size-8 text-orange md:size-9",
                        isRtl && "scale-x-[-1]",
                      )}
                      strokeWidth={1.5}
                    />
                  </blockquote>
                </article>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
