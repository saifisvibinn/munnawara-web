"use client"

import { HeroLoopVideo } from "@/components/sections/HeroLoopVideo"
import { TextLink } from "@/components/ui/TextLink"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLocale } from "next-intl"
import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

type BrandAboutHeroClientProps = {
  eyebrow: string
  title: string
  mission: string
  intro: string
  ctaLabel: string
}

const MARK_RATIO = 491 / 605

const resolveHeaderSlot = (siteLogo: HTMLElement) => {
  const mark = siteLogo.querySelector("svg, img") as HTMLElement | null
  const rect = (mark ?? siteLogo).getBoundingClientRect()
  if (rect.width >= 4 && rect.height >= 4) {
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }
  }

  const styles = getComputedStyle(document.documentElement)
  const size =
    Number.parseFloat(styles.getPropertyValue("--corner-logo-size")) || 54
  const pad =
    Number.parseFloat(styles.getPropertyValue("--page-pad")) || 18
  const rtl = document.documentElement.dir === "rtl"
  return {
    left: rtl ? window.innerWidth - pad - size : pad,
    top: 14,
    width: size,
    height: size,
  }
}

/**
 * Scroll morph: one-shot FLIP from landing logo → header mark.
 * Triggers while the logo is still on-screen; end rect is fixed (never chases a sliding header).
 */
export const BrandAboutHeroClient = ({
  eyebrow,
  title,
  mission,
  intro,
  ctaLabel,
}: BrandAboutHeroClientProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const seatRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const reduced = useReducedMotion()
  const locale = useLocale()
  const isRtl = locale === "ar"

  useLayoutEffect(() => {
    const section = sectionRef.current
    const brandSeat = seatRef.current
    const brandLockup = logoRef.current
    const siteHeader = document.querySelector<HTMLElement>("[data-site-header]")
    const siteLogo = document.querySelector<HTMLElement>("[data-site-logo]")
    if (!section || !brandSeat || !brandLockup || !siteHeader || !siteLogo) return

    let killed = false
    let flying: HTMLImageElement | null = null
    let morphTl: gsap.core.Timeline | null = null
    let parked = false

    const showLanding = () => {
      gsap.set(brandLockup, { opacity: 1, clearProps: "transform,clipPath" })
      const copy = section.querySelector<HTMLElement>("[data-brand-copy]")
      if (copy) gsap.set(copy, { opacity: 1, y: 0 })
    }

    const killFlyer = () => {
      flying?.remove()
      flying = null
    }

    const parkHeaderInstant = () => {
      parked = true
      brandSeat.style.minHeight = ""
      gsap.set(siteLogo, { opacity: 1, visibility: "visible" })
      gsap.set(brandLockup, {
        opacity: 0,
        clearProps: "position,left,top,width,zIndex,margin,maxWidth,transform,clipPath",
      })
      killFlyer()
    }

    const playToHeader = () => {
      if (killed || parked) return
      if (morphTl?.isActive()) morphTl.kill()

      const seat = brandLockup.getBoundingClientRect()
      // Fast-scroll catch-up only — never invent a mid-air flight from off-screen
      if (seat.bottom < 24) {
        parkHeaderInstant()
        return
      }

      parked = true
      brandSeat.style.minHeight = ""
      const end = resolveHeaderSlot(siteLogo)
      const markW = Math.min(seat.width * 0.78, seat.width)
      const markH = markW * MARK_RATIO
      const markLeft = seat.left + (seat.width - markW) / 2
      const markTop = Math.max(seat.top + seat.height * 0.02, 8)

      killFlyer()
      const fly = document.createElement("img")
      fly.src = "/logo.png"
      fly.alt = ""
      fly.setAttribute("data-logo-flyer", "")
      fly.setAttribute("aria-hidden", "true")
      document.body.appendChild(fly)
      flying = fly

      // Keep chrome nav visible — only swap the corner mark
      gsap.set(siteLogo, { opacity: 0 })

      gsap.set(fly, {
        position: "fixed",
        left: 0,
        top: 0,
        x: markLeft,
        y: markTop,
        width: markW,
        height: markH,
        opacity: 1,
        zIndex: 60,
        pointerEvents: "none",
        margin: 0,
        transformOrigin: "50% 50%",
      })

      // Drop the in-page lockup the same frame the flyer appears
      gsap.set(brandLockup, {
        opacity: 0,
        clearProps: "position,left,top,width,zIndex,margin,maxWidth,transform,clipPath",
      })

      morphTl?.kill()
      morphTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(siteLogo, { opacity: 1, visibility: "visible" })
          gsap.set(brandLockup, { opacity: 0, clearProps: "transform,clipPath" })
          killFlyer()
        },
      })

      // Fixed end rect — never re-measure a moving header logo
      morphTl.to(
        fly,
        {
          x: end.left,
          y: end.top,
          width: end.width,
          height: end.height,
          duration: 0.7,
          ease: "power3.inOut",
        },
        0,
      )

      morphTl.to(
        siteLogo,
        {
          opacity: 1,
          duration: 0.28,
          ease: "power2.out",
        },
        0.42,
      )

      morphTl.to(fly, { opacity: 0, duration: 0.14 }, 0.58)
      morphTl.set(siteLogo, { opacity: 1 }, 0.56)
    }

    const playToLanding = () => {
      if (killed) return
      if (!parked) return
      if (morphTl?.isActive()) morphTl.kill()

      parked = false
      const start = resolveHeaderSlot(siteLogo)
      const seat = brandLockup.getBoundingClientRect()
      const seatW = seat.width > 4 ? seat.width : Math.min(window.innerWidth * 0.38, 26 * 16)
      const seatH = seat.height > 4 ? seat.height : seatW * (1000 / 800)
      const seatLeft = seat.width > 4 ? seat.left : (window.innerWidth - seatW) / 2

      // leaveBack often fires while the seat is still under the header (~12px).
      // Aim for the resting composition band (~80px) so the mark flies into place
      // instead of ballooning at the top edge.
      const restTop = Math.round(Math.min(Math.max(window.innerHeight * 0.09, 72), 120))
      const destTop = seat.top < restTop + 36 ? restTop : Math.round(seat.top)
      const destLeft = Math.round(seatLeft)
      const destW = seatW

      const markW = Math.min(Math.max(destW * 0.78, 48), destW)
      const markH = markW * MARK_RATIO
      const markLeft = destLeft + (destW - markW) / 2
      const markTop = destTop + seatH * 0.02

      killFlyer()
      const fly = document.createElement("img")
      fly.src = "/logo.png"
      fly.alt = ""
      fly.setAttribute("data-logo-flyer", "")
      fly.setAttribute("aria-hidden", "true")
      document.body.appendChild(fly)
      flying = fly

      gsap.set(fly, {
        position: "fixed",
        left: 0,
        top: 0,
        x: start.left,
        y: start.top,
        width: start.width,
        height: start.height,
        opacity: 1,
        zIndex: 60,
        pointerEvents: "none",
        margin: 0,
        transformOrigin: "50% 50%",
      })

      // Hold seat height in flow, pin lockup at the flight destination for a clean handoff
      brandSeat.style.minHeight = `${Math.round(seatH)}px`
      gsap.set(siteLogo, { opacity: 0 })
      gsap.set(brandLockup, {
        position: "fixed",
        left: destLeft,
        top: destTop,
        width: destW,
        zIndex: 50,
        opacity: 0,
        clipPath: "inset(0% 0% 52% 0%)",
        margin: 0,
        maxWidth: "none",
        clearProps: "transform",
      })

      const releasePinnedLockup = () => {
        if (killed || parked) return
        const flowTop = brandSeat.getBoundingClientRect().top
        if (flowTop >= destTop - 16) {
          gsap.set(brandLockup, {
            opacity: 1,
            clearProps: "position,left,top,width,zIndex,margin,maxWidth,transform,clipPath",
          })
          brandSeat.style.minHeight = ""
          return
        }
        requestAnimationFrame(releasePinnedLockup)
      }

      morphTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(brandLockup, { opacity: 1, clearProps: "clipPath" })
          gsap.set(siteLogo, { opacity: 0 })
          killFlyer()
          requestAnimationFrame(releasePinnedLockup)
        },
      })

      morphTl.to(
        fly,
        {
          x: markLeft,
          y: markTop,
          width: markW,
          height: markH,
          duration: 0.72,
          ease: "power3.inOut",
        },
        0,
      )

      morphTl.to(
        siteLogo,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0.4,
      )

      // When flyer covers the seat, show petal-clipped lockup under it, then unclip text
      morphTl.set(brandLockup, { opacity: 1 }, 0.34)
      morphTl.to(
        brandLockup,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.36, ease: "power2.out" },
        0.4,
      )
      morphTl.to(fly, { opacity: 0, duration: 0.18 }, 0.58)
    }

    // Chrome stays visible; only the corner mark starts hidden until parked
    gsap.set(siteLogo, { opacity: 0 })
    if (!parked) showLanding()

    // Two triggers so down-morph stays late (near header) while up-morph
    // can start as soon as the seat returns — playToLanding aims at rest Y.
    const stPark = ScrollTrigger.create({
      trigger: brandSeat,
      start: "top 12px",
      onEnter: () => {
        if (reduced) {
          parkHeaderInstant()
          return
        }
        playToHeader()
      },
      onLeaveBack: () => {
        if (reduced) {
          parked = false
          brandSeat.style.minHeight = ""
          gsap.set(siteLogo, { opacity: 0 })
          gsap.set(brandLockup, {
            opacity: 1,
            clearProps: "position,left,top,width,zIndex,margin,maxWidth,transform,clipPath",
          })
          return
        }
        playToLanding()
      },
    })

    const t = window.setTimeout(() => {
      if (!parked) showLanding()
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      killed = true
      window.clearTimeout(t)
      stPark.kill()
      morphTl?.kill()
      killFlyer()
      brandSeat.style.minHeight = ""
      gsap.set(siteLogo, { clearProps: "opacity" })
      gsap.set(brandLockup, { clearProps: "all" })
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="brand"
      data-brand-section
      className="relative isolate overflow-x-clip bg-ink text-white"
    >
      {/* Full-bleed landing media — mirrored in Arabic so the coach clears the copy side */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          isRtl && "-scale-x-100",
        )}
        aria-hidden
      >
        <Image
          src="/hero/cover.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_32%]"
          sizes="100vw"
        />
        <HeroLoopVideo enabled={!reduced} framing="wide" />
      </div>

      {/* Readability scrim from the copy edge */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          isRtl
            ? "bg-gradient-to-l from-black/75 via-black/40 to-transparent"
            : "bg-gradient-to-r from-black/75 via-black/40 to-transparent",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgb(0 0 0 / 0.2) 40%, var(--brand-surface) 100%)",
        }}
      />

      {/* Landing composition: logo + copy on the start edge */}
      <div className="relative z-10 flex min-h-[100dvh] items-center px-4 pt-16 pb-24 sm:pt-20 sm:pb-28 md:px-10">
        <div className="mx-auto flex w-full max-w-[80rem] justify-start">
          <div className="w-full max-w-xl text-start md:max-w-[32rem] lg:max-w-[36rem]">
            <div
              ref={seatRef}
              data-brand-logo
              className="relative w-[min(42vw,11rem)] sm:w-[min(28vw,12.5rem)] md:w-[min(18vw,13.5rem)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[-18%] z-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse 55% 58% at 50% 46%, rgb(255 255 255 / 0.55) 0%, rgb(255 252 248 / 0.22) 45%, transparent 72%)",
                  filter: "blur(10px)",
                }}
              />
              <img
                ref={logoRef}
                data-brand-lockup
                src="/logo-full.png"
                alt="DMTC — Durrah Al-Munawwara"
                width={800}
                height={1000}
                className="relative z-10 h-auto w-full object-contain opacity-0 drop-shadow-[0_0_18px_rgb(0_0_0_/_0.45)]"
                draggable={false}
              />
            </div>

            <div
              data-brand-copy
              className="relative mt-6 opacity-0 sm:mt-7 md:mt-8"
            >
              <p
                className={cn(
                  "font-label text-[11px] font-semibold text-orange sm:text-xs",
                  isRtl ? "tracking-normal" : "tracking-[0.22em] uppercase",
                )}
              >
                {eyebrow}
              </p>
              <h1 className="font-display mt-3 text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.15] font-bold tracking-tight text-white">
                {title}
              </h1>
              {mission ? (
                <p className="mt-3 text-sm leading-[1.7] text-white/75 sm:mt-4 sm:text-[0.95rem] md:leading-[1.75]">
                  {mission}
                </p>
              ) : null}
              <p
                className={cn(
                  "max-w-[40ch] text-sm leading-[1.75] text-white/80 sm:text-[0.95rem] md:text-base md:leading-[1.8]",
                  mission ? "mt-2" : "mt-4 sm:mt-5",
                )}
              >
                {intro}
              </p>
              <div className="mt-5 flex justify-start sm:mt-6">
                <TextLink
                  href="/about"
                  tone="light"
                  className="text-orange hover:text-orange-soft"
                >
                  {ctaLabel}
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
