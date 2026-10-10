import type { ComponentType, CSSProperties, ReactNode } from "react"

export type LiquidGlassButtonProps = {
  label?: string
  link?: string
  newTab?: boolean
  material?: "clear" | "frosted" | "tinted"
  surface?: "light" | "dark"
  tint?: string
  /** Solid fill strength for tinted/frosted materials (0–1). */
  tintAlpha?: number
  textColor?: string
  font?: Record<string, unknown>
  icon?: "chevron" | "custom" | "none" | "arrow" | "diagonal" | "plus"
  iconLayer?: ReactNode
  /** Extra mark rendered before the label (e.g. bus icon). */
  leadingIcon?: ReactNode
  iconPosition?: "left" | "right"
  radius?: string | number
  padding?: string
  gap?: string
  glass?: {
    blur?: number
    shoulder?: number
    refraction?: number
  }
  interaction?: boolean
  hoverTransition?: Record<string, unknown>
  lightFollow?: number
  disabled?: boolean
  onTap?: () => void
  focusColor?: string
  style?: CSSProperties
}

declare const LiquidGlassButtons: ComponentType<LiquidGlassButtonProps>
export default LiquidGlassButtons
