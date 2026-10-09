"use client"

import Script from "next/script"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

type Twttr = {
  widgets: {
    createTimeline: (
      source: { sourceType: "profile"; screenName: string },
      el: HTMLElement,
      options: Record<string, unknown>,
    ) => Promise<unknown>
  }
}

type SocialFeedsProps = {
  title: string
  twitterUrl?: string
  facebookUrl?: string
  twitterLabel: string
  facebookLabel: string
  openLabel: string
  locale: string
}

const FEED_HEIGHT = 600

export const SocialFeeds = ({
  title,
  twitterUrl,
  facebookUrl,
  twitterLabel,
  facebookLabel,
  openLabel,
  locale,
}: SocialFeedsProps) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [xReady, setXReady] = useState(false)
  const xRef = useRef<HTMLDivElement>(null)
  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light"
  const screenName = twitterUrl
    ? new URL(twitterUrl).pathname.split("/").filter(Boolean)[0]
    : undefined

  useEffect(() => {
    setMounted(true)
    if ((window as Window & { twttr?: Twttr }).twttr?.widgets) setXReady(true)
  }, [])

  useEffect(() => {
    const el = xRef.current
    const twttr = (window as Window & { twttr?: Twttr }).twttr
    if (!mounted || !xReady || !el || !screenName || !twttr?.widgets) return
    el.innerHTML = ""
    void twttr.widgets.createTimeline({ sourceType: "profile", screenName }, el, {
      height: FEED_HEIGHT,
      theme,
      dnt: true,
      lang: locale,
    })
    return () => {
      el.innerHTML = ""
    }
  }, [mounted, xReady, theme, screenName, locale])

  const facebookSrc = facebookUrl
    ? `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
        href: facebookUrl,
        tabs: "timeline",
        width: "500",
        height: String(FEED_HEIGHT),
        small_header: "true",
        adapt_container_width: "true",
        hide_cover: "false",
        show_facepile: "false",
        locale: locale === "ar" ? "ar_AR" : "en_US",
      })}`
    : undefined

  if (!twitterUrl && !facebookUrl) return null

  return (
    <section className="mx-auto mt-20 max-w-5xl px-6" aria-labelledby="social-feeds-heading">
      <h2
        id="social-feeds-heading"
        className="text-2xl font-semibold tracking-tight text-ink"
      >
        {title}
      </h2>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {twitterUrl ? (
          <div>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-flex text-sm font-semibold text-orange-text underline-offset-4 hover:underline"
            >
              {twitterLabel} · {openLabel}
            </a>
            <div
              ref={xRef}
              className="overflow-hidden rounded-2xl empty:hidden [&:has(iframe)]:border [&:has(iframe)]:border-border"
              dir="ltr"
            />
            <Script
              src="https://platform.twitter.com/widgets.js"
              strategy="lazyOnload"
              onReady={() => setXReady(true)}
            />
          </div>
        ) : null}
        {facebookUrl && facebookSrc ? (
          <div>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-flex text-sm font-semibold text-orange-text underline-offset-4 hover:underline"
            >
              {facebookLabel} · {openLabel}
            </a>
            <iframe
              title={facebookLabel}
              src={facebookSrc}
              height={FEED_HEIGHT}
              loading="lazy"
              className="block w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated"
              allow="encrypted-media"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
