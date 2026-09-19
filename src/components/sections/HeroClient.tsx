"use client"

import { HeroLoopVideo } from "@/components/sections/HeroLoopVideo"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

type HeroClientProps = {
  siteName: string
  headline: string
  subhead: string
}

export const HeroClient = ({ siteName, headline, subhead }: HeroClientProps) => {
  const reduced = useReducedMotion()
  const [allowMotionMedia, setAllowMotionMedia] = useState(false)
  const poster = "/hero/cover.png"

  useEffect(() => {
    setAllowMotionMedia(!reduced)
  }, [reduced])

  return (
    <section id="hero" className="relative isolate -mt-8 overflow-x-clip sm:-mt-10 md:-mt-12">
      <div className="relative min-h-[70dvh] sm:min-h-[75dvh] md:min-h-[85dvh]">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={poster}
            alt=""
            fill
            className="object-cover object-[center_40%] md:object-[center_35%]"
            sizes="100vw"
          />
          <HeroLoopVideo enabled={allowMotionMedia} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-32 md:h-36"
            style={{
              background:
                "linear-gradient(to bottom, rgb(245 170 100 / 0.22) 0%, rgb(245 170 100 / 0.06) 45%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] sm:h-[24%] md:h-[26%]"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgb(250 247 244 / 0.45) 55%, var(--brand-surface) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/28 via-white/8 to-transparent rtl:bg-gradient-to-l md:from-white/22 md:via-white/6" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[68dvh] max-w-[80rem] flex-col justify-end px-4 pb-16 pt-20 sm:min-h-[75dvh] sm:pb-20 sm:pt-24 md:min-h-[85dvh] md:px-10 md:pb-24 md:pt-32">
          <div className="max-w-2xl">
            <motion.h1
              className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-ink break-words sm:text-5xl md:text-7xl lg:text-[5.25rem]"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              {headline}
            </motion.h1>
            <motion.p
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70 sm:mt-5 sm:text-base md:text-xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {subhead}
            </motion.p>
            <motion.p
              className="mt-2 text-sm text-ink/45 sm:mt-3"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.14 }}
            >
              {siteName}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
