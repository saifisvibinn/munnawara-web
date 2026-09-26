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
  video: HTMLVideoElement | null
  playOnce: () => void
  /** Skip playback and hold the settled end frame (reduced motion). */
  showFinalFrame: () => void
}

type HeroVideoProps = {
  reducedMotion: boolean
}

const VIDEO_SRC = "/hero/backvid.mp4"

/** Tiny offset so iOS never parks at t=0 (that snaps back to the poster). */
export const HERO_VIDEO_START_HOLD = 0.05
const START_WINDOW_SECONDS = 0.4

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number
}

export const waitForHeroVideoFirstFrame = (video: HTMLVideoElement) =>
  new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      video.removeEventListener("playing", onTick)
      video.removeEventListener("timeupdate", onTick)
      resolve()
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

    onTick()
    if (settled) return

    const rvfc = (video as VideoWithFrameCallback).requestVideoFrameCallback
    if (typeof rvfc === "function") {
      rvfc.call(video, finish)
    }
    video.addEventListener("playing", onTick)
    video.addEventListener("timeupdate", onTick)
  })

export const holdHeroVideoAtStart = (video: HTMLVideoElement) =>
  new Promise<void>((resolve) => {
    video.pause()

    if (
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      video.currentTime > 0 &&
      video.currentTime <= START_WINDOW_SECONDS
    ) {
      resolve()
      return
    }

    const onSeeked = () => resolve()
    video.addEventListener("seeked", onSeeked, { once: true })
    try {
      video.currentTime = HERO_VIDEO_START_HOLD
    } catch {
      video.removeEventListener("seeked", onSeeked)
      resolve()
    }
  })

export const isHeroVideoHeldAtStart = (video: HTMLVideoElement) =>
  video.paused &&
  video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
  video.currentTime > 0 &&
  video.currentTime <= START_WINDOW_SECONDS

const isNearEnd = (video: HTMLVideoElement) =>
  Number.isFinite(video.duration) &&
  video.duration > 0 &&
  video.currentTime >= video.duration - motion.video.endFrameOffsetSeconds

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
      if (preferFinalFrameRef.current) return
      if (finishedRef.current && startedRef.current) return

      const startFromHold = () => {
        void video.play().then(
          () => setReady(true),
          () => undefined,
        )
      }

      if (isNearEnd(video)) {
        finishedRef.current = false
        video.pause()
        video.addEventListener("seeked", startFromHold, { once: true })
        video.currentTime = HERO_VIDEO_START_HOLD
        return
      }

      if (!video.paused) {
        setReady(true)
        return
      }

      startFromHold()
    }, [reducedMotion])

    useImperativeHandle(
      ref,
      () => ({
        container: containerRef.current,
        video: videoRef.current,
        playOnce: () => {
          if (preferFinalFrameRef.current) return
          if (finishedRef.current && startedRef.current) return
          startedRef.current = true
          finishedRef.current = false
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
        video.setAttribute("webkit-playsinline", "true")
        video.preload = "auto"
      } catch {
        // ignore
      }

      let cancelled = false

      const primeAtStart = async () => {
        if (cancelled || preferFinalFrameRef.current || reducedMotion) {
          if (!cancelled && (preferFinalFrameRef.current || reducedMotion)) {
            freezeAtLastSecond()
            setReady(true)
          }
          return
        }

        if (isHeroVideoHeldAtStart(video)) {
          setReady(true)
          return
        }

        try {
          await video.play()
          await waitForHeroVideoFirstFrame(video)
          if (cancelled || startedRef.current || preferFinalFrameRef.current) {
            return
          }
          await holdHeroVideoAtStart(video)
          if (!cancelled) setReady(true)
        } catch {
          // Low Power Mode / autoplay block — DamLanding retries on tap.
        }
      }

      const onTimeUpdate = () => {
        if (!startedRef.current || finishedRef.current || reducedMotion) return
        if (isNearEnd(video)) freezeAtLastSecond()
      }

      const onEnded = () => {
        if (!startedRef.current) {
          void holdHeroVideoAtStart(video).then(() => {
            if (!cancelled) setReady(true)
          })
          return
        }
        freezeAtLastSecond()
      }

      const onVisibilityChange = () => {
        if (document.hidden) {
          video.pause()
          return
        }
        if (!startedRef.current || finishedRef.current) return
        playForward()
      }

      video.addEventListener("timeupdate", onTimeUpdate)
      video.addEventListener("ended", onEnded)
      document.addEventListener("visibilitychange", onVisibilityChange)
      void primeAtStart()

      return () => {
        cancelled = true
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
          {...{ "webkit-playsinline": "true" }}
          style={{
            objectPosition,
          }}
        />
      </div>
    )
  },
)
