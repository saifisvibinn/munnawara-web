"use client"

import type { LandingHeroContent } from "@/content/types"
import gsap from "gsap"
import { useLocale, useTranslations } from "next-intl"
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react"
import { AiChatButton } from "./AiChatButton"
import { animationConfig as motion } from "./animations/config"
import {
  createIntroTimeline,
  playFabEntrance,
  setIntroFinalState,
  type IntroElements,
} from "./animations/introTimeline"
import { ExploreButton } from "./ExploreButton"
import { HeroVideo, type HeroVideoHandle } from "./HeroVideo"
import { LandingLanguageSwitcher } from "./LandingLanguageSwitcher"
import { LandingSiteNav } from "./LandingSiteNav"
import { LogoMark } from "./LogoMark"
import { WhatsAppButton } from "@/components/layout/WhatsAppButton"
import { LOGO_INTRO_SEEN_KEY } from "./LogoRouteTransition"

type LenisLike = {
  stop: () => void
  start: () => void
  scrollTo: (
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void
}

const getLenis = () =>
  (window as Window & { __lenis?: LenisLike }).__lenis

const ASSET_FAILSAFE_MS = 9000

/** First-scroll assets that sit outside the intro root but cause jank if cold. */
const CRITICAL_PRELOAD_URLS = [
  "/motion/bus-top.png",
  "/hero/landing-sky.jpg",
  "/hero/cover.png",
] as const

const waitForEvent = (
  target: EventTarget,
  success: string,
  failure?: string,
) =>
  new Promise<void>((resolve) => {
    const done = () => {
      target.removeEventListener(success, done)
      if (failure) target.removeEventListener(failure, done)
      resolve()
    }
    target.addEventListener(success, done, { once: true })
    if (failure) target.addEventListener(failure, done, { once: true })
  })

const waitForVideoReady = (video: HTMLVideoElement) => {
  // HAVE_ENOUGH_DATA — browser believes it can play through without stalling
  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    return Promise.resolve()
  }

  try {
    video.preload = "auto"
    if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load()
  } catch {
    // ignore
  }

  return new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      video.removeEventListener("canplaythrough", onReady)
      video.removeEventListener("loadeddata", onSoftReady)
      video.removeEventListener("error", onReady)
      window.clearTimeout(softTimer)
      window.clearTimeout(hardTimer)
      resolve()
    }

    const onReady = () => finish()
    let softTimer = 0
    const onSoftReady = () => {
      // First frame is in — give a short buffer window, then proceed
      softTimer = window.setTimeout(finish, 500)
    }

    video.addEventListener("canplaythrough", onReady)
    video.addEventListener("loadeddata", onSoftReady)
    video.addEventListener("error", onReady)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onSoftReady()

    // Per-video cap so a stalled stream never owns the whole intro
    const hardTimer = window.setTimeout(finish, 6000)
  })
}

const waitForImageReady = (image: HTMLImageElement) => {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve()
  }
  return waitForEvent(image, "load", "error").then(
    () => image.decode?.().catch(() => undefined) ?? Promise.resolve(),
  )
}

const preloadUrl = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image()
    image.decoding = "async"
    const finish = () => resolve()
    image.addEventListener("load", finish, { once: true })
    image.addEventListener("error", finish, { once: true })
    image.src = src
    if (image.complete) finish()
  })

/**
 * Real warm-up for the home experience: fonts, hero media in the intro,
 * plus the next critical images users hit on first scroll.
 * Caps with a failsafe so a stalled asset never traps the loader.
 */
const waitForPageAssets = (root: HTMLElement) => {
  const fonts = document.fonts?.ready ?? Promise.resolve()
  const images = Array.from(root.querySelectorAll("img")).map(waitForImageReady)
  const videos = Array.from(root.querySelectorAll("video")).map(waitForVideoReady)
  const preloads = CRITICAL_PRELOAD_URLS.map(preloadUrl)

  const assets = Promise.allSettled([
    fonts,
    ...images,
    ...videos,
    ...preloads,
  ]).then(() => undefined)

  const failsafe = new Promise<void>((resolve) => {
    window.setTimeout(resolve, ASSET_FAILSAFE_MS)
  })

  // Wait for real readiness — only the hard failsafe can cut it short
  return Promise.race([assets, failsafe])
}

const scrollToTarget = (
  target: string,
  options?: { offset?: number },
) => {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options?.offset ?? -88,
      duration: 1.15,
    })
    return
  }
  document.querySelector(target)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

type DamLandingProps = {
  copy: LandingHeroContent
}

export const DamLanding = ({ copy }: DamLandingProps) => {
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const loadingLabel = tCommon("loading")
  const loadingChars =
    locale === "ar" ? [loadingLabel] : loadingLabel.toUpperCase().split("")
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const [loaded, setLoaded] = useState(prefersReducedMotion)
  const [skipIntroMorph, setSkipIntroMorph] = useState(false)

  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const petalFlightRefs = useRef<SVGSVGElement[]>([])
  const targetRef = useRef<HTMLDivElement>(null)
  const cornerLogoRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const loaderStatusRef = useRef<HTMLDivElement>(null)
  const loaderLettersRef = useRef<HTMLSpanElement[]>([])
  const brandNameRef = useRef<HTMLDivElement>(null)
  const brandWordsRef = useRef<HTMLSpanElement[]>([])
  const navRef = useRef<HTMLElement>(null)
  const navBarRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLElement[]>([])
  const langSwitchRef = useRef<HTMLAnchorElement>(null)
  const heroLinesRef = useRef<HTMLElement[]>([])
  const heroVideoRef = useRef<HeroVideoHandle>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const videoStageRef = useRef<HTMLDivElement>(null)
  const aiChatRef = useRef<HTMLButtonElement>(null)
  const whatsappRef = useRef<HTMLDivElement>(null)

  const collectNavItem = (element: HTMLElement | null) => {
    if (element && !navItemsRef.current.includes(element))
      navItemsRef.current.push(element)
  }
  const collectHeroLine = (element: HTMLElement | null) => {
    if (element && !heroLinesRef.current.includes(element))
      heroLinesRef.current.push(element)
  }

  const getElements = (): IntroElements | null => {
    if (
      !rootRef.current ||
      !stageRef.current ||
      !logoRef.current ||
      petalFlightRefs.current.length !== 5 ||
      !targetRef.current ||
      !cornerLogoRef.current ||
      !overlayRef.current ||
      !brandNameRef.current ||
      !navRef.current ||
      !navBarRef.current ||
      !langSwitchRef.current ||
      !heroVideoRef.current?.container ||
      !heroCardRef.current ||
      !videoStageRef.current ||
      !aiChatRef.current ||
      !whatsappRef.current
    ) {
      return null
    }

    return {
      root: rootRef.current,
      stage: stageRef.current,
      logo: logoRef.current,
      petalFlights: petalFlightRefs.current,
      target: targetRef.current,
      cornerLogo: cornerLogoRef.current,
      overlay: overlayRef.current,
      brandName: brandNameRef.current,
      nav: navRef.current,
      navBar: navBarRef.current,
      navItems: navItemsRef.current,
      langSwitch: langSwitchRef.current,
      heroLines: heroLinesRef.current,
      videoLayer: heroVideoRef.current.container,
      videoStage: videoStageRef.current,
      heroCard: heroCardRef.current,
      aiChat: aiChatRef.current,
      whatsapp: whatsappRef.current,
      playVideo: () => heroVideoRef.current?.playOnce(),
    }
  }

  useLayoutEffect(() => {
    const lenis = getLenis()
    if (!loaded) lenis?.stop()
    else lenis?.start()
  }, [loaded])

  useLayoutEffect(() => {
    const elements = getElements()
    if (!elements) return

    if (prefersReducedMotion) {
      setIntroFinalState(elements)
      heroVideoRef.current?.showFinalFrame()
      setLoaded(true)
      try {
        sessionStorage.setItem(LOGO_INTRO_SEEN_KEY, "1")
      } catch {
        // ignore
      }
      return
    }

    // Return visits / soft navigations: skip the long first-load bloom
    let alreadySeen = false
    try {
      alreadySeen = sessionStorage.getItem(LOGO_INTRO_SEEN_KEY) === "1"
    } catch {
      alreadySeen = false
    }
    if (alreadySeen) {
      setIntroFinalState(elements, { animateFabs: true })
      // Intro skip also skips playOnce — jump straight to the settled end frame
      heroVideoRef.current?.showFinalFrame()
      setSkipIntroMorph(true)
      setLoaded(true)
      document.body.classList.remove("is-loading")
      const fabEntrance = playFabEntrance(elements)
      return () => {
        fabEntrance.kill()
      }
    }

    let cancelled = false
    const startedAt = performance.now()
    const petalOrder = ["petal-4", "petal-2", "petal-1", "petal-3", "petal-5"]
      .map((id) => elements.logo.querySelector<SVGGElement>(`#${id}`))
      .filter((petal): petal is SVGGElement => petal !== null)
    const loaderStatus = loaderStatusRef.current
    const loaderLetters = loaderLettersRef.current
    const brandWords = brandWordsRef.current
    let reveal: gsap.core.Timeline | undefined
    document.body.classList.add("is-loading")
    getLenis()?.stop()

    gsap.set(petalOrder, {
      opacity: 0,
      scale: 0.12,
      rotation: (index) => (index % 2 ? -1 : 1) * motion.loader.bloomRotation,
      transformOrigin: "427.5px 427.5px",
    })
    gsap.set(elements.logo, {
      rotation: -150,
      scale: 0.7,
      transformOrigin: "center center",
    })
    gsap.set(loaderStatus, { opacity: 1, visibility: "visible" })
    gsap.set(loaderLetters, { opacity: 1, y: 0 })
    gsap.set(elements.brandName, { opacity: 0, visibility: "visible" })
    gsap.set(brandWords, { opacity: 0, y: 18 })

    const bloom = gsap
      .timeline()
      .to(elements.logo, {
        rotation: 0,
        scale: 1,
        duration: motion.loader.spinDuration,
        ease: "expo.out",
      })
      .to(
        petalOrder,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: motion.loader.bloomDuration,
          stagger: motion.loader.bloomStagger,
          ease: motion.ease.soft,
        },
        0.12,
      )

    const breathing = gsap.to(elements.logo, {
      scale: motion.loader.breatheScale,
      duration: motion.loader.breatheDuration,
      delay: motion.loader.spinDuration,
      repeat: -1,
      yoyo: true,
      ease: motion.ease.inOut,
    })

    const loadingPulse = gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(loaderLetters, {
        opacity: 0.28,
        y: -2,
        duration: motion.loader.loadingPulseDuration,
        stagger: 0.07,
        ease: "sine.inOut",
      })

    const finishLoading = async () => {
      await waitForPageAssets(elements.root)
      const remaining = Math.max(
        0,
        motion.loader.minimumMs - (performance.now() - startedAt),
      )
      await new Promise((resolve) => window.setTimeout(resolve, remaining))
      if (cancelled) return

      bloom.kill()
      breathing.kill()
      loadingPulse.kill()
      gsap.set(elements.logo, { scale: 1 })
      reveal = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("is-loading")
          try {
            sessionStorage.setItem(LOGO_INTRO_SEEN_KEY, "1")
          } catch {
            // ignore
          }
          setLoaded(true)
        },
      })
        .to(loaderLetters, {
          opacity: 0,
          y: -8,
          duration: 0.22,
          stagger: 0.025,
          ease: motion.ease.soft,
        })
        .set(loaderStatus, { visibility: "hidden" })
        .to(elements.brandName, { opacity: 1, duration: 0.2 }, "-=0.05")
        .to(
          brandWords,
          {
            opacity: 1,
            y: 0,
            duration: motion.loader.companyRevealDuration,
            stagger: motion.loader.companyWordStagger,
            ease: motion.ease.soft,
          },
          "<",
        )
    }

    void finishLoading()

    // Hard failsafe: never leave mobile stuck behind is-loading
    const failsafeId = window.setTimeout(() => {
      if (cancelled) return
      document.body.classList.remove("is-loading")
      setLoaded(true)
      try {
        sessionStorage.setItem(LOGO_INTRO_SEEN_KEY, "1")
      } catch {
        // ignore
      }
    }, ASSET_FAILSAFE_MS + motion.loader.minimumMs + 4000)

    return () => {
      cancelled = true
      window.clearTimeout(failsafeId)
      bloom.kill()
      breathing.kill()
      loadingPulse.kill()
      reveal?.kill()
      document.body.classList.remove("is-loading")
    }
  }, [prefersReducedMotion])

  useLayoutEffect(() => {
    if (!loaded || prefersReducedMotion || skipIntroMorph) return
    const elements = getElements()
    if (!elements) return
    return createIntroTimeline(elements)
  }, [loaded, prefersReducedMotion, skipIntroMorph])

  const handleExplore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToTarget("#how-it-works", { offset: -88 })
  }

  const handleGoTop = () => {
    scrollToTarget("#home", { offset: 0 })
  }

  return (
    <div className="dam-landing">
      <section className="intro" ref={rootRef}>
        <div
          className="intro__stage"
          ref={stageRef}
          style={
            {
              "--blob-duration": `${motion.ambient.blobDurationSeconds}s`,
            } as CSSProperties
          }
        >
          <div className="hero" id="home" aria-labelledby="hero-title">
            <div className="hero__ambient" aria-hidden="true">
              <span className="hero__blob hero__blob--one" />
              <span className="hero__blob hero__blob--two" />
            </div>

            <div className="hero__layout">
              <div className="hero__blend">
                <div className="hero__glass" ref={heroCardRef}>
                  <div className="hero__content">
                    <p className="hero__eyebrow line-mask">
                      <span ref={collectHeroLine}>{copy.eyebrow}</span>
                    </p>
                    <h1 id="hero-title">
                      {copy.lines.map((line) => (
                        <span className="line-mask" key={line}>
                          <span ref={collectHeroLine}>{line}</span>
                        </span>
                      ))}
                    </h1>
                    <p className="hero__sub line-mask">
                      <span ref={collectHeroLine}>{copy.sub}</span>
                    </p>
                    <div className="line-mask line-mask--cta">
                      <ExploreButton
                        className="hero__cta"
                        href="#how-it-works"
                        ref={collectHeroLine}
                        onClick={handleExplore}
                      >
                        {copy.cta}
                      </ExploreButton>
                    </div>
                  </div>
                </div>

                <div className="hero__stage-wrap" ref={videoStageRef}>
                  <div className="hero__stage">
                    <HeroVideo
                      ref={heroVideoRef}
                      reducedMotion={prefersReducedMotion}
                    />
                    <div className="hero__stage-fade" aria-hidden="true" />
                    <div className="hero__stage-seam" aria-hidden="true" />
                  </div>
                </div>

                <div className="hero__blend-edge" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="loader-surface" ref={overlayRef} aria-hidden="true" />
        </div>

        <div className="logo-flight" aria-hidden="true">
          <LogoMark
            className="logo-flight__mark logo-flight__mark--main"
            ref={logoRef}
          />
          {([4, 2, 1, 3, 5] as const).map((petal, index) => (
            <LogoMark
              className="logo-flight__mark logo-flight__petal-mark"
              idPrefix={`flight-${petal}`}
              key={petal}
              visiblePetal={petal}
              ref={(element) => {
                if (element) petalFlightRefs.current[index] = element
              }}
            />
          ))}
        </div>
        <div
          className={`loader-status${locale === "ar" ? " loader-status--ar" : ""}`}
          ref={loaderStatusRef}
          aria-label={loadingLabel}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {loadingChars.map((letter, index) => (
            <span
              aria-hidden="true"
              key={`${letter}-${index}`}
              ref={(element) => {
                if (element) loaderLettersRef.current[index] = element
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="loader-brand" ref={brandNameRef} aria-hidden="true">
          {copy.brandWords.map((word) => (
            <span
              key={word}
              ref={(element) => {
                if (element) brandWordsRef.current.push(element)
              }}
            >
              {word}
            </span>
          ))}
        </div>
        <div className="corner-target" ref={targetRef} aria-hidden="true" />
        <button
          className="corner-logo"
          ref={cornerLogoRef}
          type="button"
          aria-label={copy.backTop}
          onClick={handleGoTop}
        >
          <LogoMark className="logo-mark logo-mark--live" idPrefix="corner" />
        </button>

        <LandingSiteNav
          navRef={navRef}
          navBarRef={navBarRef}
          collectNavItem={collectNavItem}
          scrollTo={scrollToTarget}
        />
        <LandingLanguageSwitcher ref={langSwitchRef} />

        <div className="landing-fab-row">
          <AiChatButton
            ref={aiChatRef}
            chatAria={copy.chatAria}
          />
          <div className="landing-whatsapp-btn" ref={whatsappRef}>
            <WhatsAppButton />
          </div>
        </div>
      </section>
    </div>
  )
}
