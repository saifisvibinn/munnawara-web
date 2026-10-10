"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import type { LiquidGlassButtonProps } from "./liquid-glass-button"

const LiquidGlassButtonInner = dynamic(
  () =>
    import("./liquid-glass-button").then(
      (mod) => mod.default as ComponentType<LiquidGlassButtonProps>,
    ),
  { ssr: false },
)

export type { LiquidGlassButtonProps }

export const LiquidGlassButton = (props: LiquidGlassButtonProps) => (
  <LiquidGlassButtonInner {...props} />
)
