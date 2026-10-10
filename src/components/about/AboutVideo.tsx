"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FramerVideoPlayer } from "@/components/about/FramerVideoPlayer"

type AboutVideoProps = {
  headline: string
  label: string
}

/**
 * Company film via the vendored Framer Video Player (VideoPlayerV8).
 * A still preview covers the frame until playback starts (native poster
 * is replaced by the often-black first decoded frame).
 */
export const AboutVideo = ({ headline, label }: AboutVideoProps) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const [previewVisible, setPreviewVisible] = useState(true)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    let video: HTMLVideoElement | null = null
    let mo: MutationObserver | null = null

    const hidePreview = () => setPreviewVisible(false)
    const showPreviewIfIdle = () => {
      if (!video) return
      if (video.paused && video.currentTime < 0.2) setPreviewVisible(true)
    }

    const bind = (el: HTMLVideoElement) => {
      if (video === el) return
      video?.removeEventListener("play", hidePreview)
      video?.removeEventListener("playing", hidePreview)
      video?.removeEventListener("pause", showPreviewIfIdle)
      video?.removeEventListener("ended", showPreviewIfIdle)
      video = el
      video.addEventListener("play", hidePreview)
      video.addEventListener("playing", hidePreview)
      video.addEventListener("pause", showPreviewIfIdle)
      video.addEventListener("ended", showPreviewIfIdle)
      if (!video.paused && video.currentTime > 0) hidePreview()
    }

    const existing = frame.querySelector<HTMLVideoElement>(".video-el, video")
    if (existing) bind(existing)

    mo = new MutationObserver(() => {
      const next = frame.querySelector<HTMLVideoElement>(".video-el, video")
      if (next) bind(next)
    })
    mo.observe(frame, { childList: true, subtree: true })

    return () => {
      mo?.disconnect()
      video?.removeEventListener("play", hidePreview)
      video?.removeEventListener("playing", hidePreview)
      video?.removeEventListener("pause", showPreviewIfIdle)
      video?.removeEventListener("ended", showPreviewIfIdle)
    }
  }, [])

  const handlePreviewActivate = () => {
    const video = frameRef.current?.querySelector<HTMLVideoElement>(
      ".video-el, video",
    )
    if (!video) return
    setPreviewVisible(false)
    void video.play().catch(() => setPreviewVisible(true))
  }

  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:py-28" data-about-video>
      <div className="mx-auto max-w-5xl">
        <h2 className="about-film__display about-film__display--md mx-auto mb-8 text-center">
          {headline}
        </h2>
        <div
          ref={frameRef}
          className="about-film-player about-film-player--framer"
          data-preview={previewVisible ? "true" : "false"}
          aria-label={label}
        >
          <FramerVideoPlayer
            sourceType="link"
            videoUrl="/about/film.mp4"
            posterUrl="/about/film-poster.jpg"
            aspectRatio="16:9"
            fit="cover"
            cropX={50}
            cropY={40}
            cornerRadius={20}
            progressColor="var(--color-orange)"
            autoplay={false}
            autoMute
            loop={false}
            hideUI={false}
          />
          {previewVisible ? (
            <button
              type="button"
              className="about-film-player__preview"
              onClick={handlePreviewActivate}
              aria-label={label}
            >
              <Image
                src="/about/film-poster.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-cover object-[center_40%]"
                priority={false}
              />
              <span className="about-film-player__preview-play" aria-hidden />
            </button>
          ) : null}
        </div>
        <p className="mt-4 text-center text-sm text-ink-muted">{label}</p>
      </div>
    </section>
  )
}
