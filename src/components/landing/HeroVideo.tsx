"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { animationConfig as motion } from "./animations/config"

export type HeroVideoHandle = {
  container: HTMLDivElement | null
  playOnce: () => void
  /** Skip playback and hold the settled end frame (return visits). */
  showFinalFrame: () => void
}

type HeroVideoProps = {
  reducedMotion: boolean
}

const VIDEO_SRC = "/hero/backvid.mp4"

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number
}

const markFirstFrame = (
  video: HTMLVideoElement,
  onFrame: () => void,
) => {
  const painted =
    !video.paused &&
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.currentTime > 0
  if (painted) {
    onFrame()
    return () => undefined
  }

  let done = false
  const finish = () => {
    if (done) return
    done = true
    video.removeEventListener("playing", onTick)
    video.removeEventListener("timeupdate", onTick)
    onFrame()
  }
  const onTick = () => {
    if (
      !video.paused &&
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      video.currentTime > 0
    ) {
      finish()
    }
  }

  const rvfc = (video as VideoWithFrameCallback).requestVideoFrameCallback
  if (typeof rvfc === "function") {
    rvfc.call(video, finish)
  }
  video.addEventListener("playing", onTick)
  video.addEventListener("timeupdate", onTick)
  return () => {
    done = true
    video.removeEventListener("playing", onTick)
    video.removeEventListener("timeupdate", onTick)
  }
}

export const HeroVideo = forwardRef<HeroVideoHandle, HeroVideoProps>(
  function HeroVideo({ reducedMotion }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const startedRef = useRef(false)
    const finishedRef = useRef(false)
    const preferFinalFrameRef = useRef(false)
    const [ready, setReady] = useState(false)
    const [mobile, setMobile] = useState(false)
    const [rtl, setRtl] = useState(false)

    const freezeAtLastSecond = useCallback(() => {
      const video = videoRef.current
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
        return false
      }

      const holdAt = Math.max(
        0,
        video.duration - motion.video.endFrameOffsetSeconds,
      )
      finishedRef.current = true
      video.pause()

      if (Math.abs(video.currentTime - holdAt) > 0.04) {
        video.currentTime = holdAt
      }
      return true
    }, [])

    const showFinalFrame = useCallback(() => {
      preferFinalFrameRef.current = true
      startedRef.current = true
      finishedRef.current = true

      const video = videoRef.current
      if (!video) return

      const hold = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return

        const holdAt = Math.max(
          0,
          video.duration - motion.video.endFrameOffsetSeconds,
        )
        finishedRef.current = true
        video.pause()

        const reveal = () => setReady(true)
        if (Math.abs(video.currentTime - holdAt) <= 0.04) {
          reveal()
          return
        }

        video.addEventListener("seeked", reveal, { once: true })
        video.currentTime = holdAt
      }

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        hold()
        return
      }

      video.addEventListener("loadedmetadata", hold, { once: true })
      try {
        video.load()
      } catch {
        // ignore
      }
    }, [])

    const playForward = useCallback(() => {
      const video = videoRef.current
      if (!video || reducedMotion || document.hidden) return
      if (finishedRef.current || preferFinalFrameRef.current) return

      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.currentTime >=
          video.duration - motion.video.endFrameOffsetSeconds
      ) {
        freezeAtLastSecond()
        return
      }

      if (!video.paused) {
        markFirstFrame(video, () => setReady(true))
        return
      }

      void video.play().then(
        () => {
          markFirstFrame(video, () => setReady(true))
        },
        () => undefined,
      )
    }, [freezeAtLastSecond, reducedMotion])

    useImperativeHandle(
      ref,
      () => ({
        container: containerRef.current,
        playOnce: () => {
          if (finishedRef.current || preferFinalFrameRef.current) return
          startedRef.current = true
          playForward()
        },
        showFinalFrame,
      }),
      [playForward, showFinalFrame],
    )

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      try {
        video.muted = true
        video.defaultMuted = true
        video.playsInline = true
        video.preload = "auto"
        video.load()
      } catch {
        // ignore
      }

      const revealWhenPainted = () => {
        if (reducedMotion || preferFinalFrameRef.current) {
          freezeAtLastSecond()
          setReady(true)
          return
        }
        markFirstFrame(video, () => setReady(true))
      }

      const onTimeUpdate = () => {
        if (!startedRef.current || finishedRef.current || reducedMotion) return
        if (!Number.isFinite(video.duration) || video.duration <= 0) return

        if (
          video.currentTime >=
          video.duration - motion.video.endFrameOffsetSeconds
        ) {
          freezeAtLastSecond()
        }
      }

      const onEnded = () => {
        freezeAtLastSecond()
      }

      const onVisibilityChange = () => {
        if (document.hidden) {
          video.pause()
          return
        }
        if (finishedRef.current) return
        playForward()
      }

      video.addEventListener("playing", revealWhenPainted)
      video.addEventListener("timeupdate", onTimeUpdate)
      video.addEventListener("ended", onEnded)
      document.addEventListener("visibilitychange", onVisibilityChange)

      if (!video.paused) revealWhenPainted()
      else void video.play().then(revealWhenPainted, () => undefined)

      return () => {
        video.removeEventListener("playing", revealWhenPainted)
        video.removeEventListener("timeupdate", onTimeUpdate)
        video.removeEventListener("ended", onEnded)
        document.removeEventListener("visibilitychange", onVisibilityChange)
      }
    }, [freezeAtLastSecond, playForward, reducedMotion])

    useEffect(() => {
      const query = window.matchMedia(
        `(max-width: ${motion.video.mobileBreakpoint}px)`,
      )
      const update = () => setMobile(query.matches)
      update()
      query.addEventListener("change", update)
      return () => query.removeEventListener("change", update)
    }, [])

    useEffect(() => {
      const sync = () => setRtl(document.documentElement.dir === "rtl")
      sync()
      const observer = new MutationObserver(sync)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      })
      return () => observer.disconnect()
    }, [])

    const objectPosition = mobile
      ? motion.video.objectPositionMobile
      : rtl
        ? "30% center"
        : motion.video.objectPositionDesktop

    return (
      <div
        className={`hero-video${ready ? " hero-video--ready" : ""}`}
        ref={containerRef}
        aria-hidden="true"
      >
        <video
          className="hero-video__media"
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          defaultMuted
          autoPlay
          playsInline
          preload="auto"
          loop={false}
          style={{
            objectPosition,
          }}
        />
      </div>
    )
  },
)
