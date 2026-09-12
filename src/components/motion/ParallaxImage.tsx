"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef } from "react"

type ParallaxImageProps = {
  src: string
  alt?: string
  className?: string
}

gsap.registerPlugin(ScrollTrigger)

export const ParallaxImage = ({
  src,
  alt = "",
  className,
}: ParallaxImageProps) => {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !rootRef.current || !imageRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
