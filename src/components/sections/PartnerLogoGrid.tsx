"use client"

import { partners } from "@/content/partners"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { motion } from "motion/react"

const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Full client logo wall for /clients — quiet cells, color on hover. */
export const PartnerLogoGrid = ({ className }: { className?: string }) => {
  const reduced = useReducedMotion()

  if (partners.length === 0) return null

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5",
        className,
      )}
    >
      {partners.map((partner, index) => {
        const logo = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            decoding="async"
            className="max-h-12 w-full object-contain opacity-65 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-14"
          />
        )

        const cellClass =
          "group flex aspect-[5/3] items-center justify-center rounded-2xl bg-surface-elevated px-5 py-6 ring-1 ring-ink/6 transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[0_12px_32px_-12px_rgb(26_18_16/0.12)] focus-within:ring-2 focus-within:ring-orange motion-reduce:transition-none"

        const inner = partner.url ? (
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cellClass}
          >
            {logo}
          </a>
        ) : (
          <div className={cellClass}>{logo}</div>
        )

        if (reduced) {
          return <li key={partner.logo}>{inner}</li>
        }

        return (
          <motion.li
            key={partner.logo}
            initial={{ opacity: 0, transform: "translateY(12px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: Math.min(index * 0.02, 0.35),
              ease: EASE_OUT,
            }}
          >
            {inner}
          </motion.li>
        )
      })}
    </ul>
  )
}
