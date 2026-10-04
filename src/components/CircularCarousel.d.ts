import type { CSSProperties, ReactElement, ReactNode } from "react"

export type CircularCarouselItem = {
  src: string
  alt?: string
  title?: string
  subtitle?: string
}

export type CircularCarouselProps = {
  items?: CircularCarouselItem[]
  preset?: "cylinder" | "orbit" | "wheel" | "panorama" | string
  intro?: "assemble" | "rise" | "spin" | "none" | string
  cardWidth?: number
  aspectRatio?: number
  gap?: number
  curve?: number
  tilt?: number
  perspective?: number
  autoplay?: "drift" | "step" | "off" | string
  speed?: number
  interval?: number
  direction?: "left" | "right" | string
  draggable?: boolean
  momentum?: number
  snap?: boolean
  pauseOnHover?: boolean
  focusOnClick?: boolean
  parallax?: number
  stretch?: number
  depthFade?: number
  fadeColor?: string
  innerShade?: number
  cornerRadius?: number
  captions?: boolean
  renderCard?: (
    item: CircularCarouselItem,
    index: number,
    meta: { active: boolean; width: number; height: number },
  ) => ReactNode
  onChange?: (index: number) => void
  onItemClick?: (item: CircularCarouselItem, index: number) => void
  className?: string
  style?: CSSProperties
}

declare const CircularCarousel: (props: CircularCarouselProps) => ReactElement

export default CircularCarousel
