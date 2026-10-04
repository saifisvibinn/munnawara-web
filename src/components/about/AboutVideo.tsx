"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type AboutVideoProps = {
  headline: string
  label: string
}

/**
 * Company film in a fixed 16:9 frame (no layout shift). The poster is a lazy
 * next/image with a play button; the video file is only fetched after play.
 * Native controls give play/pause, mute, scrub and fullscreen, localised by
 * the browser. Playback pauses when the player leaves the viewport.
 */
export const AboutVideo = ({ headline, label }: AboutVideoProps) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video || !started) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause()
      },
      { threshold: 0.15 },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [started])

  const handlePlay = () => {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    void video.play().catch(() => setStarted(false))
  }

  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:py-28" data-about-video>
      <div className="mx-auto max-w-5xl">
        <h2 className="about-film__display about-film__display--md mx-auto mb-8 text-center">
          {headline}
        </h2>
        <div
          ref={frameRef}
          className="about-film-player"
          data-started={started}
        >
          <video
            ref={videoRef}
            controls={started}
            playsInline
            preload="none"
            aria-label={label}
            className="about-film-player__video"
            onEnded={() => setStarted(false)}
          >
            <source src="/about/film.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={handlePlay}
            aria-label={label}
            tabIndex={started ? -1 : 0}
            className="about-film-player__poster"
          >
            <Image
              src="/about/film-poster.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-cover"
            />
            <span className="about-film-player__play" aria-hidden>
              <Play />
            </span>
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-ink-muted">{label}</p>
      </div>
    </section>
  )
}
