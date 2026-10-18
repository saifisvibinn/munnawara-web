"use client"

import type { Partner } from "@/content/partners"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { useMemo } from "react"

type LogoCloudProps = {
  partners: readonly Partner[]
  className?: string
  /** How many horizontal rows (logo-cloud-06 style). */
  rows?: 2 | 3 | 4
  /** Edge fade base — match the section surface so the mask blends. */
  fadeFrom?: "surface-muted" | "surface-mint" | "surface"
}

const chunkRows = (items: readonly Partner[], rowCount: number) => {
  if (items.length === 0) return []
  const rows: Partner[][] = Array.from({ length: rowCount }, () => [])
  items.forEach((item, index) => {
    rows[index % rowCount].push(item)
  })
  // Keep rows dense enough to marquee smoothly.
  return rows.map((row) => {
    if (row.length === 0) return row
    let next = [...row]
    while (next.length < 6) next = [...next, ...row]
    return next
  })
}

const LogoCell = ({ partner }: { partner: Partner }) => (
  <div className="flex h-16 w-36 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-surface-elevated px-4 sm:h-20 sm:w-44">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={partner.logo}
      alt={partner.name}
      loading="lazy"
      decoding="async"
      className="max-h-10 w-full object-contain opacity-90 transition duration-300 sm:max-h-12 hover:opacity-100"
    />
  </div>
)

const FADE_FROM = {
  "surface-muted": "from-surface-muted",
  "surface-mint": "from-surface-mint",
  surface: "from-surface",
} as const

export const LogoCloud = ({
  partners,
  className,
  rows = 3,
  fadeFrom = "surface-muted",
}: LogoCloudProps) => {
  const reduced = useReducedMotion()
  const rowItems = useMemo(
    () => chunkRows(partners, rows),
    [partners, rows],
  )
  const fade = FADE_FROM[fadeFrom]

  if (partners.length === 0) return null

  if (reduced) {
    return (
      <ul
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3",
          className,
        )}
      >
        {partners.slice(0, 12).map((partner) => (
          <li key={partner.logo}>
            <LogoCell partner={partner} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    // Force LTR: RTL flex + translateX(-50%) parks the whole track off-screen,
    // so lazy images never load on Arabic pages.
    <div
      dir="ltr"
      className={cn("relative flex flex-col gap-3 overflow-hidden", className)}
      aria-label="Client logos"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent sm:w-16",
          fade,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent sm:w-16",
          fade,
        )}
      />

      {rowItems.map((row, rowIndex) => {
        const loop = [...row, ...row]
        const reverse = rowIndex % 2 === 1
        return (
          <div key={rowIndex} className="overflow-hidden">
            <div
              className={cn(
                "logo-marquee-track flex w-max gap-3",
                reverse && "logo-marquee-track--reverse",
              )}
              style={{ animationDuration: `${36 + rowIndex * 8}s` }}
            >
              {loop.map((partner, index) => (
                <LogoCell
                  key={`${partner.logo}-${index}`}
                  partner={partner}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
