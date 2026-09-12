"use client"

import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm"
import { HeroLoopVideo } from "@/components/sections/HeroLoopVideo"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

type HeroClientProps = {
  siteName: string
  headline: string
  subhead: string
  whatsappNumber: string
  whatsappPrefill: string
}

export const HeroClient = ({
  siteName,
  headline,
  subhead,
  whatsappNumber,
  whatsappPrefill,
}: HeroClientProps) => {
  const reduced = useReducedMotion()
  const [allowMotionMedia, setAllowMotionMedia] = useState(false)
  const poster = "/hero/cover.png"

  useEffect(() => {
    setAllowMotionMedia(!reduced)
  }, [reduced])

  return (
    <section id="hero" className="relative isolate overflow-x-clip bg-white">
      <div className="relative min-h-[70dvh] sm:min-h-[75dvh] md:min-h-[85dvh]">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={poster}
            alt=""
            fill
            priority
            className="object-cover object-[center_40%] md:object-[center_35%]"
            sizes="100vw"
          />
          <HeroLoopVideo enabled={allowMotionMedia} />
          {/* Soft wash so copy stays readable while the loop stays visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/18 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/72 via-white/28 to-white/10 rtl:bg-gradient-to-l md:from-white/58 md:via-white/22 md:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[68dvh] max-w-[80rem] flex-col justify-end px-4 pb-36 pt-20 sm:min-h-[75dvh] sm:pb-40 sm:pt-24 md:min-h-[85dvh] md:px-10 md:pb-44 md:pt-32">
          <div className="max-w-2xl">
            <motion.h1
              className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-ink break-words sm:text-5xl md:text-7xl lg:text-[5.25rem]"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {headline}
            </motion.h1>
            <motion.p
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70 sm:mt-5 sm:text-base md:text-xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {subhead}
            </motion.p>
            <motion.p
              className="mt-2 text-sm text-ink/45 sm:mt-3"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              {siteName}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-20 max-w-[80rem] px-4 sm:-mt-28 md:-mt-32 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <QuoteRequestForm
            whatsappNumber={whatsappNumber}
            whatsappPrefill={whatsappPrefill}
          />
        </motion.div>
      </div>
    </section>
  )
}
