"use client"

import { cn } from "@/lib/cn"
import { useEffect, useRef, useState } from "react"

const DEFAULT_VIDEO_SRC = "/hero/hero-loop.mp4"
const DEFAULT_POSTER = "/hero/cover.png"
/** Crossfade length in seconds — hides the hard loop cut */
const CROSSFADE_SEC = 1.25

type HeroLoopVideoProps = {
  enabled: boolean
  /** Wider scene framing (less tight crop on the coach) */
  framing?: "default" | "wide" | "center"
  src?: string
  poster?: string
}

export const HeroLoopVideo = ({
  enabled,
  framing = "default",
  src = DEFAULT_VIDEO_SRC,
  poster = DEFAULT_POSTER,
}: HeroLoopVideoProps) => {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const [front, setFront] = useState<0 | 1>(0)
  const [ready, setReady] = useState(false)
  const activeRef = useRef<0 | 1>(0)
  const fadingRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setReady(false)
      aRef.current?.pause()
      bRef.current?.pause()
      return
    }

    const a = aRef.current
    const b = bRef.current
    if (!a || !b) return

    const videos = [a, b] as const
    fadingRef.current = false
    activeRef.current = 0
    setFront(0)

    const handleTimeUpdate = (event: Event) => {
      const current = event.currentTarget as HTMLVideoElement
      const activeIdx = activeRef.current
      if (current !== videos[activeIdx]) return
      if (fadingRef.current) return
      if (!Number.isFinite(current.duration) || current.duration <= CROSSFADE_SEC * 2) {
        return
      }

      const remaining = current.duration - current.currentTime
      if (remaining > CROSSFADE_SEC) return

      fadingRef.current = true
      const nextIdx = (activeIdx === 0 ? 1 : 0) as 0 | 1
      const next = videos[nextIdx]

      try {
        next.currentTime = 0
      } catch {
        // ignore seek errors mid-load
      }
      void next.play().catch(() => undefined)
      setFront(nextIdx)

      window.setTimeout(() => {
        current.pause()
        try {
          current.currentTime = 0
        } catch {
          // ignore
        }
        activeRef.current = nextIdx
        fadingRef.current = false
      }, CROSSFADE_SEC * 1000)
    }

    const handleCanPlay = () => {
      setReady(true)
      void videos[activeRef.current].play().catch(() => setReady(false))
    }

    for (const video of videos) {
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("canplay", handleCanPlay)
      video.load()
    }

    if (a.readyState >= 3) handleCanPlay()

    return () => {
      for (const video of videos) {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("canplay", handleCanPlay)
        video.pause()
      }
    }
  }, [enabled, src])

  if (!enabled) return null

  const sharedClass = cn(
    "absolute inset-0 size-full object-cover transition-opacity ease-in-out",
    framing === "wide"
      ? "object-[center_32%]"
      : framing === "center"
        ? "object-center"
        : "object-[center_40%] md:object-[center_35%]",
  )

  return (
    <>
      <video
        ref={aRef}
        className={cn(sharedClass, ready && front === 0 ? "opacity-100" : "opacity-0")}
        style={{ transitionDuration: `${CROSSFADE_SEC * 1000}ms` }}
        muted
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        ref={bRef}
        className={cn(sharedClass, ready && front === 1 ? "opacity-100" : "opacity-0")}
        style={{ transitionDuration: `${CROSSFADE_SEC * 1000}ms` }}
        muted
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
    </>
  )
}
