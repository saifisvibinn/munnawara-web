"use client"

import { trackQuoteRequest, type QuoteTracking, type TrackResult } from "@/app/actions/track"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import { Check, X } from "lucide-react"
import { useLocale } from "next-intl"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { loadSavedQuote } from "./quoteEditStore"
import { pick, type L10n } from "./quoteWizardConfig"
import { Field, btnPrimary, fieldClass } from "./quoteWizardUi"

const COPY = {
  leadId: { en: "Request number", ar: "رقم الطلب" },
  phone: { en: "Phone used in the request", ar: "رقم الجوال المستخدم في الطلب" },
  submit: { en: "Check status", ar: "عرض الحالة" },
  checking: { en: "Checking…", ar: "جارٍ التحقق…" },
  errors: {
    invalid: {
      en: "Enter the request number (like DM-1A2B3C4D) and your phone number.",
      ar: "أدخل رقم الطلب (مثل DM-1A2B3C4D) ورقم جوالك.",
    },
    not_found: {
      en: "We couldn't find a request with that number and phone. Check both and try again.",
      ar: "لم نجد طلباً بهذا الرقم والجوال. تحقق منهما وحاول مرة أخرى.",
    },
    rate_limited: {
      en: "Too many tries for this request. Please wait a few minutes and try again.",
      ar: "محاولات كثيرة لهذا الطلب. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
    },
    error: {
      en: "Something went wrong. Please try again or contact us on WhatsApp.",
      ar: "حدث خطأ ما. حاول مرة أخرى أو تواصل معنا عبر واتساب.",
    },
  },
  steps: {
    received: { en: "Request received", ar: "تم استلام الطلب" },
    priced: { en: "Price sent", ar: "تم إرسال السعر" },
    confirmed: { en: "Booking confirmed", ar: "تم تأكيد الحجز" },
    closed: { en: "Request closed", ar: "تم إغلاق الطلب" },
  },
  status: {
    new: {
      en: "Our team is reviewing your request and preparing a price.",
      ar: "يراجع فريقنا طلبك ويجهز عرض السعر.",
    },
    quoted: {
      en: "Your price is ready. Our team will contact you to confirm the booking.",
      ar: "عرض السعر جاهز. سيتواصل معك فريقنا لتأكيد الحجز.",
    },
    won: {
      en: "Your booking is confirmed. Thank you for choosing us.",
      ar: "تم تأكيد حجزك. شكراً لاختيارك لنا.",
    },
    lost: {
      en: "This request is closed. Contact us if you would like to reopen it or plan a new trip.",
      ar: "هذا الطلب مغلق. تواصل معنا إذا رغبت في إعادة فتحه أو التخطيط لرحلة جديدة.",
    },
  },
  price: { en: "Quoted price", ar: "السعر المعروض" },
  route: { en: "Route", ar: "المسار" },
  date: { en: "Trip date", ar: "تاريخ الرحلة" },
  group: { en: "Group", ar: "المجموعة" },
  passengers: (n: number): L10n => ({ en: `${n} passengers`, ar: `${n} راكب` }),
  buses: (n: number): L10n => ({ en: `${n} bus${n === 1 ? "" : "es"}`, ar: `${n} حافلة` }),
  updated: { en: "Last updated", ar: "آخر تحديث" },
  edit: { en: "Edit my request", ar: "تعديل طلبي" },
  editHint: {
    en: "You can still change this request until our team starts working on it.",
    ar: "يمكنك تعديل هذا الطلب حتى يبدأ فريقنا العمل عليه.",
  },
}

type StepState = "done" | "current" | "todo" | "closed"

function timeline(status: QuoteTracking["status"]): { label: L10n; state: StepState }[] {
  // The step after the last one reached is "current": it is what we are waiting on.
  const reached = { new: 0, quoted: 1, won: 2, lost: 0 }[status]
  const stateOf = (i: number): StepState =>
    i <= reached ? "done" : i === reached + 1 ? "current" : "todo"
  return [
    { label: COPY.steps.received, state: stateOf(0) },
    { label: COPY.steps.priced, state: status === "lost" ? "todo" : stateOf(1) },
    status === "lost"
      ? { label: COPY.steps.closed, state: "closed" }
      : { label: COPY.steps.confirmed, state: stateOf(2) },
  ]
}

export const TrackRequest = ({ initialLeadId = "" }: { initialLeadId?: string }) => {
  const locale = useLocale()
  const isAr = locale === "ar"
  const tx = (text: L10n) => pick(text, locale)
  const [leadId, setLeadId] = useState(initialLeadId.toUpperCase())
  const [phone, setPhone] = useState("")
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [canEdit, setCanEdit] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const lookup = async (id: string, tel: string) => {
    setPending(true)
    const next = await trackQuoteRequest(id, tel)
    setResult(next)
    setPending(false)
    const saved = loadSavedQuote()
    setCanEdit(Boolean(next.ok && next.tracking.editable && saved?.leadId === next.tracking.leadId))
    requestAnimationFrame(() =>
      resultRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    )
  }

  // A request sent from this browser fills itself in (and is looked up straight away).
  useEffect(() => {
    const saved = loadSavedQuote()
    if (!saved?.leadId) return
    const matches = !initialLeadId || initialLeadId.toUpperCase() === saved.leadId
    if (!matches) return
    setLeadId(saved.leadId)
    setPhone(saved.state.phone)
    void lookup(saved.leadId, saved.state.phone)
  }, [initialLeadId])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    void lookup(leadId, phone)
  }

  const money = (amount: number, currency: string) =>
    `${new Intl.NumberFormat(isAr ? "ar-SA" : "en-US", { maximumFractionDigits: 2 }).format(amount)} ${
      currency === "SAR" ? (isAr ? "ريال سعودي" : "SAR") : currency
    }`
  const day = (iso: string) => {
    const d = new Date(iso)
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString(isAr ? "ar-SA-u-ca-gregory" : "en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
  }

  const tracking = result?.ok ? result.tracking : null

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-4 rounded-2xl bg-surface-elevated/90 p-5 ring-1 ring-border sm:p-6"
      >
        <Field label={tx(COPY.leadId)} htmlFor="track-id">
          <input
            id="track-id"
            name="leadId"
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
            placeholder="DM-1A2B3C4D"
            className={cn(fieldClass, "font-mono uppercase rtl:text-right")}
            value={leadId}
            onChange={(e) => setLeadId(e.target.value.toUpperCase())}
          />
        </Field>
        <Field label={tx(COPY.phone)} htmlFor="track-phone">
          <input
            id="track-phone"
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+966 5X XXX XXXX"
            className={cn(fieldClass, "rtl:text-right")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <button type="submit" className={cn(btnPrimary, "w-full")} disabled={pending}>
          {pending ? tx(COPY.checking) : tx(COPY.submit)}
        </button>
      </form>

      <div ref={resultRef} aria-live="polite">
        {result && !result.ok ? (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 px-4 py-3.5 text-sm text-red-800 ring-1 ring-red-200/80 dark:bg-red-950/60 dark:text-red-200 dark:ring-red-400/30"
          >
            {tx(COPY.errors[result.reason])}
          </p>
        ) : null}

        {tracking ? (
          <section className="qw-step qw-step--fwd rounded-2xl bg-surface-elevated/90 p-5 ring-1 ring-border sm:p-6">
            <p className="font-mono text-sm font-semibold text-ink-muted" dir="ltr">
              {tracking.leadId}
            </p>
            <ol className="mt-4 grid grid-cols-3 gap-2">
              {timeline(tracking.status).map((step, i) => (
                <li key={i} className="flex flex-col gap-2">
                  <span
                    className={cn(
                      "h-1.5 rounded-full",
                      step.state === "done" && "bg-orange",
                      step.state === "current" && "track-pulse bg-orange/60",
                      step.state === "todo" && "bg-border",
                      step.state === "closed" && "bg-ink-muted/50",
                    )}
                  />
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium sm:text-sm",
                      step.state === "todo" ? "text-ink-muted" : "text-ink",
                    )}
                  >
                    {step.state === "done" ? <Check className="size-3.5 shrink-0 text-orange" aria-hidden /> : null}
                    {step.state === "closed" ? <X className="size-3.5 shrink-0" aria-hidden /> : null}
                    {tx(step.label)}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-base leading-relaxed text-ink">{tx(COPY.status[tracking.status])}</p>

            {tracking.quotedPrice != null ? (
              <div className="mt-4 rounded-xl bg-orange/10 px-4 py-3 ring-1 ring-orange/25">
                <p className="text-xs text-ink-muted">{tx(COPY.price)}</p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ink">
                  {money(tracking.quotedPrice, tracking.currency)}
                </p>
              </div>
            ) : null}

            <dl className="mt-4 space-y-1.5 rounded-xl bg-surface-muted/60 px-4 py-3 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-ink-muted">{tx(COPY.route)}:</dt>
                <dd className="text-ink/80">
                  <bdi>{tracking.pickup}</bdi> {isAr ? "←" : "→"} <bdi>{tracking.dropoff}</bdi>
                </dd>
              </div>
              {tracking.date ? (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-ink-muted">{tx(COPY.date)}:</dt>
                  <dd className="text-ink/80">{day(tracking.date)}</dd>
                </div>
              ) : null}
              {tracking.passengers || tracking.busCount ? (
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-ink-muted">{tx(COPY.group)}:</dt>
                  <dd className="text-ink/80">
                    {[
                      tracking.passengers ? tx(COPY.passengers(tracking.passengers)) : "",
                      tracking.busCount ? tx(COPY.buses(tracking.busCount)) : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </dd>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-ink-muted">{tx(COPY.updated)}:</dt>
                <dd className="text-ink/80">{day(tracking.updatedAt)}</dd>
              </div>
            </dl>

            {canEdit ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/70">
                <span>{tx(COPY.editHint)}</span>
                <Link href={{ pathname: "/quote", query: { edit: "1" } }} className="font-semibold text-orange underline-offset-4 hover:underline">
                  {tx(COPY.edit)}
                </Link>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  )
}
