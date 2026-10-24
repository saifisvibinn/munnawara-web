import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

type Tag = "div" | "ul" | "li" | "article"

type Props = { as?: Tag; className?: string; children: ReactNode }

export const Stagger = ({ as: Component = "div", className, children }: Props) => (
  <Component className={className}>{children}</Component>
)

/** Each item fades up as it scrolls into view (`.reveal` in globals.css), so a grid reveals row by row. */
export const StaggerItem = ({ as: Component = "div", className, children }: Props) => (
  <Component className={cn("reveal", className)}>{children}</Component>
)
