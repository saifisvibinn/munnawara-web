import { cn } from "@/lib/cn"
import type { ReactNode } from "react"

type BadgeTone = "neutral" | "gold" | "green"

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-muted border-border",
  gold: "bg-secondary-container text-gold-deep border-gold/40",
  green: "bg-surface-container text-primary border-primary/20",
}

export const Badge = ({
  children,
  tone = "neutral",
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "font-label inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
