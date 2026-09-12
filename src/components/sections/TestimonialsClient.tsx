"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

type TestimonialItem = {
  id: string
  quote: string
  name: string
  role: string
  avatar: string | null
}

type TestimonialsClientProps = {
  title: string
  emptyMessage: string
  items: readonly TestimonialItem[]
  previousLabel: string
  nextLabel: string
}

export const TestimonialsClient = ({
  title,
  emptyMessage,
  items,
  previousLabel,
  nextLabel,
}: TestimonialsClientProps) => {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || items.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [items.length, reduced])

  const handlePrevious = () => {
    setIndex((current) => (current - 1 + items.length) % items.length)
  }

  const handleNext = () => {
    setIndex((current) => (current + 1) % items.length)
  }

  return (
    <section className="bg-white px-4 py-16 sm:py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight break-words text-ink sm:text-4xl md:text-5xl">
          {title}
        </h2>

        {items.length === 0 ? (
          <p className="mt-10 text-base text-ink/45">{emptyMessage}</p>
        ) : (
          <div className="relative mt-14">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={items[index]?.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-2xl leading-relaxed font-medium text-ink md:text-3xl">
                  “{items[index]?.quote}”
                </p>
                <footer className="mt-10 flex items-center justify-center gap-3">
                  {items[index]?.avatar ? (
                    <Image
                      src={items[index]!.avatar!}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex size-11 items-center justify-center rounded-full bg-orange/10 text-sm font-semibold text-orange"
                    >
                      {items[index]?.name.slice(0, 1)}
                    </span>
                  )}
                  <div className="text-start">
                    <p className="font-label text-sm font-semibold text-ink">
                      {items[index]?.name}
                    </p>
                    <p className="text-xs text-ink/50">{items[index]?.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            {items.length > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink transition hover:border-orange hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  aria-label={previousLabel}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink transition hover:border-orange hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  aria-label={nextLabel}
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
