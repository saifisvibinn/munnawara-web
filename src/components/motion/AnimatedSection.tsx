import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
}

/** Section that fades up as it scrolls into view (`.reveal` in globals.css). Never hidden at load. */
export const AnimatedSection = ({ children, className }: AnimatedSectionProps) => (
  <section className={cn("reveal", className)}>{children}</section>
)
