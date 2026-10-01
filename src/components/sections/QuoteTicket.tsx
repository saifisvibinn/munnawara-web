"use client"

import TearTicket from "@/components/ui/TearTicket"
import { Link, useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { skipNextRouteTransition } from "@/components/landing/LogoRouteTransition"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

const COPY = {
  en: {
    pass: "Boarding pass",
    brand: "Durrah Al-Munawwara",
    title: "Your journey starts here",
    sub: "Umrah circuits · Transfers · Corporate · Charter",
    route: "Jeddah → Makkah → Madinah",
    tear: "Tear here",
    stubTitle: "Get a quote",
    stubSub: "Pull the stub",
    hint: "Pull the orange stub to tear it off — your quote starts right after.",
    key: "Keyboard: focus the stub and press Enter.",
    opening: "Opening your quote…",
    skip: "Prefer a plain form?",
    aria: "Tear off the stub to start your quote",
    used: "Ticket used",
  },
  ar: {
    pass: "بطاقة صعود",
    brand: "درة المنورة",
    title: "رحلتك تبدأ من هنا",
    sub: "دورات العمرة · المقاطع · الشركات · الرحلات الخاصة",
    route: "جدة ← مكة ← المدينة",
    tear: "مزّق من هنا",
    stubTitle: "اطلب عرض سعر",
    stubSub: "اسحب القسيمة",
    hint: "اسحب القسيمة البرتقالية لتمزيقها — وسيبدأ طلب العرض مباشرة.",
    key: "بلوحة المفاتيح: ركّز على القسيمة واضغط Enter.",
    opening: "جارٍ فتح طلب العرض…",
    skip: "تفضّل نموذجاً عادياً؟",
    aria: "مزّق القسيمة لبدء طلب العرض",
    used: "تم استخدام التذكرة",
  },
} as const

const query = "(max-width: 639px)"
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

/** Home "Get a quote": tear the ticket stub to open the quote page. */
export function QuoteTicket() {
  const locale = useLocale()
  const isAr = locale === "ar"
  const c = COPY[isAr ? "ar" : "en"]
  const router = useRouter()
  const [opening, setOpening] = useState(false)
  const timer = useRef<number | null>(null)

  // Warm the quote page so the hand-off is instant once the stub is gone.
  useEffect(() => {
    router.prefetch("/quote")
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [router])
  const narrow = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )

  const vertical = narrow
  const size = vertical
    ? { width: 330, height: 430, stubSize: 120 }
    : { width: 540, height: 270, stubSize: 150 }

  // Ticket glides up and fades (CSS), then we navigate without the logo bloom.
  const handleTear = () => {
    setOpening(true)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    timer.current = window.setTimeout(
      () => {
        skipNextRouteTransition()
        router.push("/quote")
      },
      reduced ? 0 : 420,
    )
  }

  return (
    <div
      className="qticket flex w-full flex-col items-center gap-5"
      data-leaving={opening ? "" : undefined}
      dir={isAr ? "rtl" : "ltr"}
    >
      <TearTicket
        key={vertical ? "v" : "h"}
        orientation={vertical ? "vertical" : "horizontal"}
        {...size}
        image="/hero/cover.png"
        imageAlt=""
        imageRadius={10}
        radius={18}
        holes={vertical ? 10 : 12}
        background="var(--brand-surface-elevated)"
        color="var(--brand-ink)"
        stubBackground="var(--brand-orange)"
        ariaLabel={c.aria}
        usedLabel={c.used}
        onTear={handleTear}
        recenter={false}
        rotate={vertical ? 0 : 2}
        stub={
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-white"
            dir={isAr ? "rtl" : "ltr"}
          >
            <svg
              viewBox="0 0 24 24"
              className={vertical ? "hidden" : "size-7"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="2.6" />
              <circle cx="6" cy="18" r="2.6" />
              <path d="M8.2 7.6 20 17M8.2 16.4 20 7" />
            </svg>
            <p className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase opacity-80">
              {c.tear}
            </p>
            <p className="text-lg leading-tight font-bold">{c.stubTitle}</p>
            <p className="text-xs opacity-85">{c.stubSub}</p>
            <div className={vertical ? "hidden" : "mt-1 flex h-6 items-stretch gap-[2px] opacity-70"} aria-hidden="true">
              {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2].map((w, i) => (
                <span key={i} className="bg-white" style={{ width: w }} />
              ))}
            </div>
          </div>
        }
      >
        <div
          className="flex h-full flex-col justify-between p-5 sm:p-6"
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="flex items-center justify-between text-[0.62rem] font-semibold tracking-[0.2em] text-white uppercase">
            <span className="rounded-full bg-black/45 px-2.5 py-1 whitespace-nowrap backdrop-blur-sm">{c.pass}</span>
            <span className="hidden rounded-full bg-black/45 px-2.5 py-1 whitespace-nowrap backdrop-blur-sm sm:inline">
              {c.brand}
            </span>
          </div>
          <div>
            <p className="font-display text-2xl leading-tight font-semibold sm:text-[1.7rem]">
              {c.title}
            </p>
            <p className="mt-1 text-sm font-semibold text-orange">{c.route}</p>
            <p className="mt-1 text-xs text-ink-muted">{c.sub}</p>
          </div>
        </div>
      </TearTicket>

      <div className="max-w-md text-center text-sm text-ink-muted" aria-live="polite">
        {opening ? (
          <p className="font-semibold text-orange">{c.opening}</p>
        ) : (
          <>
            <p>{c.hint}</p>
            <p className="mt-1 text-xs opacity-80">{c.key}</p>
          </>
        )}
        <Link
          href="/quote"
          data-no-route-transition
          onClick={() => skipNextRouteTransition()}
          className="mt-3 inline-block text-xs font-semibold text-orange underline-offset-4 hover:underline"
        >
          {c.skip}
        </Link>
      </div>
    </div>
  )
}
