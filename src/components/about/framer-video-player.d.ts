import type { ComponentType, CSSProperties } from "react"

type FramerVideoPlayerProps = {
  sourceType?: "upload" | "link"
  videoFile?: string
  videoUrl?: string
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:3" | "4:5" | "custom"
  customWidth?: number
  customHeight?: number
  fit?: "contain" | "cover"
  cropX?: number
  cropY?: number
  cornerRadius?: number
  progressColor?: string
  autoplay?: boolean
  autoMute?: boolean
  loop?: boolean
  startTime?: number
  hideUI?: boolean
  posterUrl?: string
  style?: CSSProperties
}

declare const VideoPlayerV8: ComponentType<FramerVideoPlayerProps>
export default VideoPlayerV8
