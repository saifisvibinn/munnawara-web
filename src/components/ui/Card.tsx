import { cn } from "@/lib/cn"
import type { ReactNode } from "react"

type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-elevated p-6 shadow-sm ring-1 ring-ink/5",
        className,
      )}
    >
      {children}
    </div>
  )
}
