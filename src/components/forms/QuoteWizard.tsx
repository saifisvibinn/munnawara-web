"use client"

import { submitQuoteRequest } from "@/app/actions/quote"
import { quoteRequestSchema, type BusClass, type TripType } from "@/components/forms/formSchemas"
import { cn } from "@/lib/cn"
import { useLocale } from "next-intl"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  airports,
  busClassOptions,
  charterService,
  corporateServices,
  customerOptions,
  dawraLengths,
  extraOptions,
  findOption,
  mazaratOptions,
  orgRequired,
  pick,
  placeLabel,
  places,
  tripDirections,
  umrahKinds,
  umrahService,
  type ExtraId,
  type L10n,
  type Option,
  type PlaceId,
} from "./quoteWizardConfig"
import { GlobeVisual, RouteVisual } from "./QuoteVisuals"

type WizardProps = {
  className?: string
  variant?: "card" | "overlay"
  formId?: string
}

type StepId =
  | "customer"
  | "service"
  | "umrahKind"
  | "dawraLength"
  | "dawraRoute"
  | "maktaaRoute"
  | "charterRoute"
  | "when"
  | "passengers"
  | "vehicle"
  | "extras"
  | "contact"
  | "review"

type WizardState = {
  customer: TripType | ""
  service: string
  umrahKind: string
  dawraLength: string
  mazarat: string[]
  direction: string
  from: PlaceId | ""
  to: PlaceId | ""
  arrival: PlaceId
  departure: PlaceId
  pickup: string
  destination: string
  stops: string
  date: string
  time: string
  returnDate: string
  waitingHours: string
  passengers: string
  luggage: string
  accessibility: string
  busCount: string
  busClass: BusClass
  extras: Record<ExtraId, boolean>
  notes: string
  name: string
  organization: string
  phone: string
  email: string
  consent: boolean
}

const initialState: WizardState = {
  customer: "",
  service: "",
  umrahKind: "",
  dawraLength: "",
  mazarat: [],
  direction: "oneway",
  from: "",
  to: "",
  arrival: "jed_airport",
  departure: "med_airport",
  pickup: "",
  destination: "",
  stops: "",
  date: "",
  time: "",
  returnDate: "",
  waitingHours: "",
  passengers: "1",
  luggage: "",
  accessibility: "",
  busCount: "1",
  busClass: "standard",
  extras: {
    needsSupervisors: false,
    needsTracking: false,
    needsBranding: false,
    needsAirportReception: false,
  },
  notes: "",
  name: "",
  organization: "",
  phone: "",
  email: "",
  consent: false,
}

const COPY = {
  stepOf: (c: number, t: number): L10n => ({
    en: `Step ${c} of ${t}`,
    ar: `الخطوة ${c} من ${t}`,
  }),
  titles: {
    customer: { en: "Who is this request for?", ar: "لمن هذا الطلب؟" },
    service: { en: "What do you need?", ar: "ماذا تحتاج؟" },
    umrahKind: { en: "Dawra or Makta3?", ar: "دورة أم مقطع؟" },
    dawraLength: { en: "How long is the Dawra?", ar: "ما مدة الدورة؟" },
    dawraRoute: { en: "Your Dawra route", ar: "مسار الدورة" },
    maktaaRoute: { en: "Where to where?", ar: "من أين إلى أين؟" },
    charterRoute: { en: "Where is the trip?", ar: "أين الرحلة؟" },
    when: { en: "When?", ar: "متى؟" },
    passengers: { en: "Who is travelling?", ar: "من المسافرون؟" },
    vehicle: { en: "Choose your buses", ar: "اختر الحافلات" },
    extras: { en: "Anything extra?", ar: "هل تحتاج إضافات؟" },
    contact: { en: "How can we reach you?", ar: "كيف نتواصل معك؟" },
    review: { en: "Review and send", ar: "راجع وأرسل" },
  } satisfies Record<StepId, L10n>,
  next: { en: "Continue", ar: "متابعة" },
  back: { en: "Back", ar: "رجوع" },
  submit: { en: "Send request", ar: "إرسال الطلب" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  edit: { en: "Edit", ar: "تعديل" },
  error: {
    en: "Something went wrong. Please try again or contact us on WhatsApp.",
    ar: "حدث خطأ ما. حاول مرة أخرى أو تواصل معنا عبر واتساب.",
  },
  fields: {
    name: { en: "Full name", ar: "الاسم الكامل" },
    organization: { en: "Organization / mission", ar: "اسم الجهة" },
    phone: { en: "Phone / WhatsApp", ar: "الجوال / واتساب" },
    email: { en: "Email (optional)", ar: "البريد الإلكتروني (اختياري)" },
    pickup: { en: "From (city / exact location)", ar: "من (المدينة / الموقع)" },
    destination: { en: "To", ar: "إلى" },
    stops: { en: "Stops (optional)", ar: "نقاط توقف (اختياري)" },
    from: { en: "From", ar: "من" },
    to: { en: "To", ar: "إلى" },
    arrival: { en: "Arrive at", ar: "الوصول إلى" },
    departure: { en: "Depart from", ar: "المغادرة من" },
    date: { en: "Date", ar: "التاريخ" },
    time: { en: "Time", ar: "الوقت" },
    returnDate: { en: "Return / end date", ar: "تاريخ العودة / النهاية" },
    returnDateOptional: {
      en: "Return / end date (optional)",
      ar: "تاريخ العودة / النهاية (اختياري)",
    },
    waiting: { en: "Waiting hours (optional)", ar: "ساعات الانتظار (اختياري)" },
    passengers: { en: "Number of passengers", ar: "عدد الركاب" },
    luggage: { en: "Luggage (optional)", ar: "الأمتعة (اختياري)" },
    accessibility: { en: "Accessibility needs (optional)", ar: "احتياجات خاصة (اختياري)" },
    busCount: { en: "Number of buses", ar: "عدد الحافلات" },
    notes: { en: "Anything else we should know?", ar: "هل هناك ملاحظات أخرى؟" },
  },
  mazaratTitle: { en: "Mazarat to include", ar: "المزارات المطلوبة" },
  consent: {
    en: "I agree to share my details with the sales team under the privacy policy. A request is not a confirmed booking until an official offer is issued.",
    ar: "أوافق على مشاركة بياناتي مع فريق المبيعات وفق سياسة الخصوصية. الطلب ليس حجزاً مؤكداً حتى يصدر عرض رسمي.",
  },
  errors: {
    choose: { en: "Please choose an option to continue.", ar: "الرجاء اختيار خيار للمتابعة." },
    name: { en: "Please enter your full name.", ar: "الرجاء إدخال الاسم الكامل." },
    organization: { en: "Please enter the organization name.", ar: "الرجاء إدخال اسم الجهة." },
    phone: { en: "Please enter a number we can reach you on.", ar: "الرجاء إدخال رقم للتواصل." },
    email: { en: "That email doesn't look right.", ar: "البريد الإلكتروني غير صحيح." },
    place: { en: "Please enter the place.", ar: "الرجاء إدخال الموقع." },
    samePlace: { en: "Start and end must be different.", ar: "نقطة البداية والنهاية يجب أن تختلفا." },
    date: { en: "Please choose a date.", ar: "الرجاء اختيار التاريخ." },
    time: { en: "Please choose a time.", ar: "الرجاء اختيار الوقت." },
    returnDate: { en: "Please choose the return date.", ar: "الرجاء اختيار تاريخ العودة." },
    returnBefore: { en: "Return can't be before departure.", ar: "تاريخ العودة قبل المغادرة." },
    passengers: { en: "Please enter the number of passengers.", ar: "الرجاء إدخال عدد الركاب." },
    buses: { en: "Please enter the number of buses.", ar: "الرجاء إدخال عدد الحافلات." },
    consent: { en: "Please tick the box to agree before sending.", ar: "الرجاء الموافقة قبل الإرسال." },
  },
  done: {
    eyebrow: { en: "Request received", ar: "تم استلام الطلب" },
    title: { en: "Thank you — your request is in.", ar: "شكراً لك — وصلنا طلبك." },
    number: { en: "Request number", ar: "رقم الطلب" },
    eta: (h: number): L10n => ({
      en: `Our team will respond within about ${h} hours via your phone or WhatsApp.`,
      ar: `سيرد عليك فريقنا خلال ${h} ساعة تقريباً عبر الجوال أو واتساب.`,
    }),
    note: {
      en: "This is not a booking confirmation. Prices and availability are confirmed only in an official offer.",
      ar: "هذا ليس تأكيد حجز. الأسعار والتوافر تؤكد فقط في العرض الرسمي.",
    },
    another: { en: "Start another request", ar: "طلب جديد" },
  },
  summary: {
    who: { en: "Customer", ar: "العميل" },
    service: { en: "Service", ar: "الخدمة" },
    route: { en: "Route", ar: "المسار" },
    when: { en: "When", ar: "الموعد" },
    passengers: { en: "Passengers", ar: "الركاب" },
    vehicle: { en: "Buses", ar: "الحافلات" },
    extras: { en: "Extras", ar: "الإضافات" },
    contact: { en: "Contact", ar: "التواصل" },
  },
}

const fieldClass =
  "w-full min-w-0 rounded-xl border border-border bg-surface-muted px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink-muted focus:border-orange/40 focus:bg-surface-elevated focus:ring-2 focus:ring-orange/25 sm:text-[0.9375rem]"
const fieldErrorRing = "ring-2 ring-red-400/50 focus:ring-red-400/60 bg-red-50/60 dark:bg-red-950/40"
const btnPrimary =
  "font-label inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-60"
const btnGhost =
  "font-label inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink"

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("block min-w-0", className)}>
      <label
        htmlFor={htmlFor}
        className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm leading-snug text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Choices({
  options,
  value,
  onPick,
  locale,
  columns = 2,
}: {
  options: readonly Option[]
  value: string
  onPick: (id: string) => void
  locale: string
  columns?: 1 | 2
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2",
        columns === 2 && "sm:grid-cols-2",
      )}
      role="radiogroup"
    >
      {options.map((o) => {
        const selected = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onPick(o.id)}
            className={cn(
              "rounded-xl px-4 py-3.5 text-start transition",
              selected
                ? "bg-black text-white shadow-sm"
                : "bg-surface-muted text-ink hover:bg-surface-container",
            )}
          >
            <span className="block text-sm font-semibold">{pick(o.label, locale)}</span>
            {o.hint ? (
              <span
                className={cn(
                  "mt-1 block text-xs leading-snug",
                  selected ? "text-white/70" : "text-ink/50",
                )}
              >
                {pick(o.hint, locale)}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function PlaceSelect({
  id,
  value,
  onChange,
  options,
  locale,
  placeholder,
  error,
}: {
  id: string
  value: string
  onChange: (v: PlaceId | "") => void
  options: readonly Option<PlaceId>[]
  locale: string
  placeholder: string
  error?: string
}) {
  return (
    <select
      id={id}
      className={cn(fieldClass, "appearance-none", error && fieldErrorRing)}
      value={value}
      onChange={(e) => onChange(e.target.value as PlaceId | "")}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {pick(o.label, locale)}
        </option>
      ))}
    </select>
  )
}

export const QuoteWizard = ({
  className,
  variant = "card",
  formId = "quote",
}: WizardProps) => {
  const locale = useLocale()
  const isAr = locale === "ar"
  const tx = (text: L10n) => pick(text, locale)
  const isOverlay = variant === "overlay"

  const [state, setState] = useState<WizardState>(initialState)
  const [stepIndex, setStepIndex] = useState(0)
  const [dir, setDir] = useState<"fwd" | "back">("fwd")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")
  const [result, setResult] = useState<{ leadId?: string; sla: number } | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const patch = (p: Partial<WizardState>) => {
    setState((s) => ({ ...s, ...p }))
    setErrors({})
  }

  const isCompany = state.customer === "company"
  const needsOrg = state.customer !== "" && orgRequired.includes(state.customer)

  const steps = useMemo<StepId[]>(() => {
    const list: StepId[] = ["customer", "service"]
    if (state.service === "umrah") {
      list.push("umrahKind")
      if (state.umrahKind === "dawra") list.push("dawraLength", "dawraRoute")
      else if (state.umrahKind === "maktaa") list.push("maktaaRoute")
    } else if (state.service) {
      list.push("charterRoute")
    }
    list.push("when", "passengers", "vehicle", "extras", "contact", "review")
    return list
  }, [state.service, state.umrahKind])

  const stepIndexSafe = Math.min(stepIndex, steps.length - 1)
  const step = steps[stepIndexSafe]

  const serviceOptions: readonly Option[] = isCompany
    ? corporateServices
    : [umrahService, charterService]

  /* ---- derived trip data ---- */

  const dawraRoute: PlaceId[] = [state.arrival, "makkah", "madinah", state.departure]
  const twoWay = state.direction === "twoway"

  const routeIds: PlaceId[] =
    state.umrahKind === "dawra" && state.service === "umrah"
      ? dawraRoute
      : state.umrahKind === "maktaa" && state.from && state.to
        ? [state.from, state.to]
        : []

  const serviceType =
    state.service === "umrah"
      ? state.umrahKind === "dawra"
        ? `umrah_dawra_${state.dawraLength || "short"}`
        : `umrah_maktaa_${state.direction}`
      : isCompany && state.service
        ? `company_${state.service}`
        : "charter"

  const serviceLabel = (): string => {
    if (state.service === "umrah") {
      const kind = findOption(umrahKinds, state.umrahKind)
      const parts = [tx(umrahService.label)]
      if (kind) parts.push(tx(kind.label))
      if (state.umrahKind === "dawra") {
        const len = findOption(dawraLengths, state.dawraLength)
        if (len) parts.push(tx(len.label))
      } else if (state.umrahKind === "maktaa") {
        const d = findOption(tripDirections, state.direction)
        if (d) parts.push(tx(d.label))
      }
      return parts.join(" · ")
    }
    const o = findOption(serviceOptions, state.service)
    return o ? tx(o.label) : ""
  }

  /** Route text in the language given (English for the sales payload). */
  const routeParts = (loc: string) => {
    if (state.service === "umrah" && state.umrahKind === "dawra") {
      const mazarat =
        state.dawraLength === "long"
          ? state.mazarat
              .map((id) => findOption(mazaratOptions, id))
              .filter((o): o is Option => Boolean(o))
              .map((o) => pick(o.label, loc))
          : []
      const mid = [placeLabel("makkah", loc), ...mazarat, placeLabel("madinah", loc)]
      return {
        pickup: placeLabel(state.arrival, loc),
        destination: placeLabel(state.departure, loc),
        stops: mid.join(" → "),
      }
    }
    if (state.service === "umrah") {
      return {
        pickup: state.from ? placeLabel(state.from, loc) : "",
        destination: state.to ? placeLabel(state.to, loc) : "",
        stops: "",
      }
    }
    return {
      pickup: state.pickup.trim(),
      destination: state.destination.trim(),
      stops: state.stops.trim(),
    }
  }

  /* ---- validation ---- */

  const validate = (id: StepId): Record<string, string> => {
    const e: Record<string, string> = {}
    switch (id) {
      case "customer":
        if (!state.customer) e.choice = tx(COPY.errors.choose)
        break
      case "service":
        if (!state.service) e.choice = tx(COPY.errors.choose)
        break
      case "umrahKind":
        if (!state.umrahKind) e.choice = tx(COPY.errors.choose)
        break
      case "dawraLength":
        if (!state.dawraLength) e.choice = tx(COPY.errors.choose)
        break
      case "maktaaRoute":
        if (!state.from) e.from = tx(COPY.errors.place)
        if (!state.to) e.to = tx(COPY.errors.place)
        if (state.from && state.to && state.from === state.to) {
          e.to = tx(COPY.errors.samePlace)
        }
        break
      case "charterRoute":
        if (state.pickup.trim().length < 2) e.pickup = tx(COPY.errors.place)
        if (state.destination.trim().length < 2) e.destination = tx(COPY.errors.place)
        break
      case "when":
        if (!state.date) e.date = tx(COPY.errors.date)
        if (state.umrahKind === "maktaa" && !state.time) e.time = tx(COPY.errors.time)
        if (state.umrahKind === "maktaa" && twoWay && !state.returnDate) {
          e.returnDate = tx(COPY.errors.returnDate)
        }
        if (state.date && state.returnDate && state.returnDate < state.date) {
          e.returnDate = tx(COPY.errors.returnBefore)
        }
        break
      case "passengers":
        if (!Number(state.passengers) || Number(state.passengers) < 1) {
          e.passengers = tx(COPY.errors.passengers)
        }
        break
      case "vehicle":
        if (!Number(state.busCount) || Number(state.busCount) < 1) {
          e.busCount = tx(COPY.errors.buses)
        }
        break
      case "contact":
        if (state.name.trim().length < 2) e.name = tx(COPY.errors.name)
        if (needsOrg && !state.organization.trim()) e.organization = tx(COPY.errors.organization)
        if (state.phone.trim().length < 8) e.phone = tx(COPY.errors.phone)
        if (state.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
          e.email = tx(COPY.errors.email)
        }
        break
      case "review":
        if (!state.consent) e.consent = tx(COPY.errors.consent)
        break
      default:
        break
    }
    return e
  }

  /* ---- navigation ---- */

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }

  const goTo = (index: number, direction: "fwd" | "back") => {
    setDir(direction)
    setErrors({})
    setStepIndex(index)
    scrollTop()
  }

  const goNext = () => {
    const e = validate(step)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    if (stepIndexSafe < steps.length - 1) goTo(stepIndexSafe + 1, "fwd")
  }

  const goBack = () => {
    if (stepIndexSafe > 0) goTo(stepIndexSafe - 1, "back")
  }

  const jumpTo = (id: StepId) => {
    const i = steps.indexOf(id)
    if (i >= 0) goTo(i, "back")
  }

  // Choice steps advance by themselves once a value is picked.
  const nextRef = useRef(goNext)
  nextRef.current = goNext
  const [autoTick, setAutoTick] = useState(0)
  useEffect(() => {
    if (autoTick === 0) return
    const timer = window.setTimeout(() => nextRef.current(), 230)
    return () => window.clearTimeout(timer)
  }, [autoTick])

  const choose = (p: Partial<WizardState>) => {
    patch(p)
    setAutoTick((n) => n + 1)
  }

  /* ---- submit ---- */

  const buildPayload = () => {
    const route = routeParts("en")
    return {
      tripType: state.customer || undefined,
      serviceType,
      customerName: state.name,
      organization: state.organization,
      email: state.email,
      phone: state.phone,
      pickup: route.pickup,
      destination: route.destination,
      stops: route.stops,
      date: state.date,
      departureTime: state.time,
      returnDate: state.returnDate,
      waitingHours: state.waitingHours === "" ? null : Number(state.waitingHours),
      passengers: Number(state.passengers),
      busCount: Number(state.busCount) || 1,
      busClass: state.busClass,
      accessibilityNeeds: state.accessibility,
      luggageNotes: state.luggage,
      specialRequirements: state.notes,
      ...state.extras,
      consent: state.consent,
      language: isAr ? ("ar" as const) : ("en" as const),
      companyWebsite: honeypot,
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (step !== "review") {
      goNext()
      return
    }
    const e = validate("review")
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setStatus("submitting")
    const parsed = quoteRequestSchema.safeParse(buildPayload())
    if (!parsed.success) {
      setStatus("error")
      return
    }
    const response = await submitQuoteRequest(parsed.data)
    if (response.ok) {
      setResult({ leadId: response.leadId, sla: response.quoteSlaHours || 24 })
      setStatus("done")
      scrollTop()
    } else {
      setStatus("error")
    }
  }

  const reset = () => {
    setState(initialState)
    setStepIndex(0)
    setErrors({})
    setResult(null)
    setStatus("idle")
  }

  /* ---- layout bits ---- */

  const shell = (children: ReactNode) => (
    <div
      id={formId}
      ref={topRef}
      dir={isAr ? "rtl" : "ltr"}
      className={cn(
        isOverlay
          ? "bg-transparent p-0 text-start"
          : "rounded-2xl bg-surface-elevated/90 p-4 text-start ring-1 ring-border backdrop-blur-md sm:p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  )

  const summaryRows = (): { id: StepId; label: L10n; value: string }[] => {
    const route = routeParts(locale)
    const customer = findOption(customerOptions, state.customer)
    const dateLine = [state.date, state.time].filter(Boolean).join(" ")
    const when = state.returnDate ? `${dateLine} → ${state.returnDate}` : dateLine
    const extras = [
      ...extraOptions.filter((o) => state.extras[o.id]).map((o) => tx(o.label)),
    ]
    const routeText = [route.pickup, route.stops, route.destination]
      .filter(Boolean)
      .join(" → ")
    const rows: { id: StepId; label: L10n; value: string }[] = [
      { id: "customer", label: COPY.summary.who, value: customer ? tx(customer.label) : "" },
      { id: "service", label: COPY.summary.service, value: serviceLabel() },
      {
        id:
          state.service === "umrah"
            ? state.umrahKind === "dawra"
              ? "dawraRoute"
              : "maktaaRoute"
            : "charterRoute",
        label: COPY.summary.route,
        value: routeText,
      },
      { id: "when", label: COPY.summary.when, value: when },
      {
        id: "passengers",
        label: COPY.summary.passengers,
        value: state.passengers,
      },
      {
        id: "vehicle",
        label: COPY.summary.vehicle,
        value: `${state.busCount} × ${tx(findOption(busClassOptions, state.busClass)!.label)}`,
      },
      ...(extras.length
        ? [{ id: "extras" as StepId, label: COPY.summary.extras, value: extras.join(", ") }]
        : []),
      {
        id: "contact",
        label: COPY.summary.contact,
        value: [state.name, state.organization, state.phone].filter(Boolean).join(" · "),
      },
    ]
    return rows.filter((r) => r.value)
  }

  /* ---- finished ---- */

  if (status === "done" && result) {
    return shell(
      <div className="qw-step qw-step--fwd" role="status">
        <div className="mx-auto mb-4 w-full max-w-sm text-ink/70">
          <RouteVisual
            route={routeIds.length ? routeIds : ["jed_airport", "makkah", "madinah"]}
            locale={locale}
            className="h-auto w-full"
          />
        </div>
        <p className="font-label text-[0.7rem] font-semibold tracking-[0.14em] text-orange uppercase">
          {tx(COPY.done.eyebrow)}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
          {tx(COPY.done.title)}
        </h3>
        {result.leadId ? (
          <p className="mt-3 rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink">
            {tx(COPY.done.number)}:{" "}
            <span className="font-mono font-semibold" dir="ltr">
              {result.leadId}
            </span>
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {tx(COPY.done.eta(result.sla))}
        </p>
        <dl className="mt-4 space-y-1.5 rounded-xl bg-surface-muted/60 px-4 py-3 text-sm">
          {summaryRows().map((row) => (
            <div key={row.id + row.value} className="flex flex-wrap gap-x-2">
              <dt className="text-ink-muted">{tx(row.label)}:</dt>
              <dd className="text-ink/80">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-ink/55">{tx(COPY.done.note)}</p>
        <button type="button" className={cn(btnGhost, "mt-5")} onClick={reset}>
          {tx(COPY.done.another)}
        </button>
      </div>,
    )
  }

  /* ---- step bodies ---- */

  const inputErr = (key: string) => (errors[key] ? fieldErrorRing : "")

  const showGlobe = step === "customer" || step === "service"
  const showRoute =
    step === "umrahKind" ||
    step === "dawraLength" ||
    step === "dawraRoute" ||
    step === "maktaaRoute"

  const visualRoute: PlaceId[] =
    step === "dawraRoute" || step === "dawraLength"
      ? dawraRoute
      : step === "maktaaRoute"
        ? ([state.from, state.to].filter(Boolean) as PlaceId[])
        : ["jed_airport", "makkah", "madinah"]

  const body = (() => {
    switch (step) {
      case "customer":
        return (
          <Choices
            options={customerOptions}
            value={state.customer}
            locale={locale}
            onPick={(id) => {
              const next = id as TripType
              choose({
                customer: next,
                service:
                  (next === "company") === isCompany || !state.service ? state.service : "",
              })
            }}
          />
        )
      case "service":
        return (
          <Choices
            options={serviceOptions}
            value={state.service}
            locale={locale}
            onPick={(id) => choose({ service: id, umrahKind: "", dawraLength: "" })}
          />
        )
      case "umrahKind":
        return (
          <Choices
            options={umrahKinds}
            value={state.umrahKind}
            locale={locale}
            onPick={(id) => choose({ umrahKind: id })}
          />
        )
      case "dawraLength":
        return (
          <Choices
            options={dawraLengths}
            value={state.dawraLength}
            locale={locale}
            onPick={(id) => choose({ dawraLength: id })}
          />
        )
      case "dawraRoute":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label={tx(COPY.fields.arrival)} htmlFor="qw-arrival">
                <PlaceSelect
                  id="qw-arrival"
                  value={state.arrival}
                  options={airports}
                  locale={locale}
                  placeholder=""
                  onChange={(v) => v && patch({ arrival: v })}
                />
              </Field>
              <Field label={tx(COPY.fields.departure)} htmlFor="qw-departure">
                <PlaceSelect
                  id="qw-departure"
                  value={state.departure}
                  options={airports}
                  locale={locale}
                  placeholder=""
                  onChange={(v) => v && patch({ departure: v })}
                />
              </Field>
            </div>
            {state.dawraLength === "long" ? (
              <fieldset>
                <legend className="font-label mb-2 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
                  {tx(COPY.mazaratTitle)}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {mazaratOptions.map((o) => {
                    const on = state.mazarat.includes(o.id)
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          patch({
                            mazarat: on
                              ? state.mazarat.filter((m) => m !== o.id)
                              : [...state.mazarat, o.id],
                          })
                        }
                        className={cn(
                          "rounded-full px-3.5 py-2 text-sm transition",
                          on
                            ? "bg-black text-white"
                            : "bg-surface-muted text-ink hover:bg-surface-container",
                        )}
                      >
                        {tx(o.label)}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ) : null}
          </div>
        )
      case "maktaaRoute":
        return (
          <div className="space-y-4">
            <Choices
              options={tripDirections}
              value={state.direction}
              locale={locale}
              onPick={(id) => patch({ direction: id })}
            />
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label={tx(COPY.fields.from)} htmlFor="qw-from" error={errors.from}>
                <PlaceSelect
                  id="qw-from"
                  value={state.from}
                  options={places}
                  locale={locale}
                  placeholder="—"
                  error={errors.from}
                  onChange={(v) => patch({ from: v })}
                />
              </Field>
              <Field label={tx(COPY.fields.to)} htmlFor="qw-to" error={errors.to}>
                <PlaceSelect
                  id="qw-to"
                  value={state.to}
                  options={places}
                  locale={locale}
                  placeholder="—"
                  error={errors.to}
                  onChange={(v) => patch({ to: v })}
                />
              </Field>
            </div>
          </div>
        )
      case "charterRoute":
        return (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label={tx(COPY.fields.pickup)} htmlFor="qw-pickup" error={errors.pickup}>
              <input
                id="qw-pickup"
                className={cn(fieldClass, inputErr("pickup"))}
                value={state.pickup}
                onChange={(e) => patch({ pickup: e.target.value })}
              />
            </Field>
            <Field
              label={tx(COPY.fields.destination)}
              htmlFor="qw-destination"
              error={errors.destination}
            >
              <input
                id="qw-destination"
                className={cn(fieldClass, inputErr("destination"))}
                value={state.destination}
                onChange={(e) => patch({ destination: e.target.value })}
              />
            </Field>
            <Field
              label={tx(COPY.fields.stops)}
              htmlFor="qw-stops"
              className="sm:col-span-2"
            >
              <input
                id="qw-stops"
                className={fieldClass}
                value={state.stops}
                onChange={(e) => patch({ stops: e.target.value })}
              />
            </Field>
          </div>
        )
      case "when": {
        const returnRequired = state.umrahKind === "maktaa" && twoWay
        return (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label={tx(COPY.fields.date)} htmlFor="qw-date" error={errors.date}>
              <input
                id="qw-date"
                type="date"
                className={cn(fieldClass, "min-h-[3.25rem]", inputErr("date"))}
                value={state.date}
                onChange={(e) => patch({ date: e.target.value })}
              />
            </Field>
            <Field label={tx(COPY.fields.time)} htmlFor="qw-time" error={errors.time}>
              <input
                id="qw-time"
                type="time"
                className={cn(fieldClass, "min-h-[3.25rem]", inputErr("time"))}
                value={state.time}
                onChange={(e) => patch({ time: e.target.value })}
              />
            </Field>
            <Field
              label={tx(
                returnRequired ? COPY.fields.returnDate : COPY.fields.returnDateOptional,
              )}
              htmlFor="qw-return"
              error={errors.returnDate}
            >
              <input
                id="qw-return"
                type="date"
                className={cn(fieldClass, "min-h-[3.25rem]", inputErr("returnDate"))}
                value={state.returnDate}
                min={state.date || undefined}
                onChange={(e) => patch({ returnDate: e.target.value })}
              />
            </Field>
            {state.service !== "umrah" ? (
              <Field label={tx(COPY.fields.waiting)} htmlFor="qw-waiting">
                <input
                  id="qw-waiting"
                  type="number"
                  min={0}
                  max={168}
                  className={fieldClass}
                  value={state.waitingHours}
                  onChange={(e) => patch({ waitingHours: e.target.value })}
                />
              </Field>
            ) : null}
          </div>
        )
      }
      case "passengers":
        return (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field
              label={tx(COPY.fields.passengers)}
              htmlFor="qw-pax"
              error={errors.passengers}
            >
              <input
                id="qw-pax"
                type="number"
                min={1}
                max={500}
                className={cn(fieldClass, inputErr("passengers"))}
                value={state.passengers}
                onChange={(e) => patch({ passengers: e.target.value })}
              />
            </Field>
            <Field label={tx(COPY.fields.luggage)} htmlFor="qw-luggage">
              <input
                id="qw-luggage"
                className={fieldClass}
                value={state.luggage}
                onChange={(e) => patch({ luggage: e.target.value })}
              />
            </Field>
            <Field
              label={tx(COPY.fields.accessibility)}
              htmlFor="qw-access"
              className="sm:col-span-2"
            >
              <input
                id="qw-access"
                className={fieldClass}
                value={state.accessibility}
                onChange={(e) => patch({ accessibility: e.target.value })}
              />
            </Field>
          </div>
        )
      case "vehicle":
        return (
          <div className="space-y-4">
            <Field
              label={tx(COPY.fields.busCount)}
              htmlFor="qw-buses"
              error={errors.busCount}
            >
              <input
                id="qw-buses"
                type="number"
                min={1}
                max={50}
                className={cn(fieldClass, inputErr("busCount"))}
                value={state.busCount}
                onChange={(e) => patch({ busCount: e.target.value })}
              />
            </Field>
            <Choices
              options={busClassOptions}
              value={state.busClass}
              locale={locale}
              onPick={(id) => patch({ busClass: id as BusClass })}
            />
          </div>
        )
      case "extras":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {extraOptions.map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface-muted px-3.5 py-3 text-sm text-ink/80"
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-ink/20"
                    checked={state.extras[o.id]}
                    onChange={(e) =>
                      patch({ extras: { ...state.extras, [o.id]: e.target.checked } })
                    }
                  />
                  {tx(o.label)}
                </label>
              ))}
            </div>
            <Field label={tx(COPY.fields.notes)} htmlFor="qw-notes">
              <textarea
                id="qw-notes"
                className={cn(fieldClass, "min-h-[5.5rem] resize-y")}
                value={state.notes}
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </Field>
          </div>
        )
      case "contact":
        return (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field
              label={tx(COPY.fields.name)}
              htmlFor="qw-name"
              error={errors.name}
              className="sm:col-span-2"
            >
              <input
                id="qw-name"
                className={cn(fieldClass, inputErr("name"))}
                value={state.name}
                autoComplete="name"
                onChange={(e) => patch({ name: e.target.value })}
              />
            </Field>
            {needsOrg ? (
              <Field
                label={tx(COPY.fields.organization)}
                htmlFor="qw-org"
                error={errors.organization}
                className="sm:col-span-2"
              >
                <input
                  id="qw-org"
                  className={cn(fieldClass, inputErr("organization"))}
                  value={state.organization}
                  autoComplete="organization"
                  onChange={(e) => patch({ organization: e.target.value })}
                />
              </Field>
            ) : null}
            <Field label={tx(COPY.fields.phone)} htmlFor="qw-phone" error={errors.phone}>
              <input
                id="qw-phone"
                type="tel"
                dir="ltr"
                className={cn(fieldClass, inputErr("phone"))}
                value={state.phone}
                autoComplete="tel"
                onChange={(e) => patch({ phone: e.target.value })}
              />
            </Field>
            <Field label={tx(COPY.fields.email)} htmlFor="qw-email" error={errors.email}>
              <input
                id="qw-email"
                type="email"
                dir="ltr"
                className={cn(fieldClass, inputErr("email"))}
                value={state.email}
                autoComplete="email"
                onChange={(e) => patch({ email: e.target.value })}
              />
            </Field>
          </div>
        )
      case "review":
        return (
          <div className="space-y-4">
            <dl className="divide-y divide-border rounded-xl bg-surface-muted/60 text-sm">
              {summaryRows().map((row) => (
                <div
                  key={row.id + row.value}
                  className="flex items-start justify-between gap-3 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <dt className="text-xs text-ink-muted">{tx(row.label)}</dt>
                    <dd className="text-ink/85">{row.value}</dd>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-semibold text-orange hover:underline"
                    onClick={() => jumpTo(row.id)}
                  >
                    {tx(COPY.edit)}
                  </button>
                </div>
              ))}
            </dl>
            <label
              className={cn(
                "flex items-start gap-3 rounded-xl px-3.5 py-3 text-sm text-ink/70",
                errors.consent ? "bg-red-50 ring-2 ring-red-400/40" : "bg-surface-muted/60",
              )}
            >
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-ink/20"
                checked={state.consent}
                onChange={(e) => patch({ consent: e.target.checked })}
              />
              <span>{tx(COPY.consent)}</span>
            </label>
            {errors.consent ? (
              <p className="px-1 text-sm text-red-700" role="alert">
                {errors.consent}
              </p>
            ) : null}
          </div>
        )
      default:
        return null
    }
  })()

  const isLast = stepIndexSafe === steps.length - 1
  const isChoiceStep =
    step === "customer" || step === "service" || step === "umrahKind" || step === "dawraLength"
  const choiceValue =
    step === "customer"
      ? state.customer
      : step === "service"
        ? state.service
        : step === "umrahKind"
          ? state.umrahKind
          : step === "dawraLength"
            ? state.dawraLength
            : ""
  // Choice steps auto-advance on pick; once a value exists (e.g. after Back) offer Continue.
  const showContinue = !isChoiceStep || Boolean(choiceValue)
  const progress = ((stepIndexSafe + 1) / steps.length) * 100

  return shell(
    <>
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 text-xs text-ink-muted">
          <span className="font-label tracking-[0.12em] uppercase">
            {tx(COPY.stepOf(stepIndexSafe + 1, steps.length))}
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-orange transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div key={step} className={cn("qw-step space-y-4", dir === "fwd" ? "qw-step--fwd" : "qw-step--back")}>
          <div className="flex items-center gap-3">
            {showGlobe ? (
              <GlobeVisual className="size-14 shrink-0" />
            ) : null}
            <h3 className="text-lg font-semibold text-ink sm:text-xl">
              {tx(COPY.titles[step])}
            </h3>
          </div>

          {showRoute ? (
            <div className="mx-auto w-full max-w-md rounded-xl bg-surface-muted/60 p-3 text-ink/70">
              <RouteVisual route={visualRoute} locale={locale} className="h-auto w-full" />
            </div>
          ) : null}

          {body}

          {errors.choice ? (
            <p className="text-sm text-red-700" role="alert">
              {errors.choice}
            </p>
          ) : null}
        </div>

        {/* honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />

        {status === "error" ? (
          <div
            className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-800 ring-1 ring-red-200/80"
            role="alert"
          >
            {tx(COPY.error)}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {stepIndexSafe > 0 ? (
            <button type="button" className={btnGhost} onClick={goBack}>
              {tx(COPY.back)}
            </button>
          ) : null}
          {isLast ? (
            <button type="submit" className={cn(btnPrimary, "ms-auto")} disabled={status === "submitting"}>
              {status === "submitting" ? tx(COPY.sending) : tx(COPY.submit)}
            </button>
          ) : showContinue ? (
            <button type="submit" className={cn(btnPrimary, "ms-auto")}>
              {tx(COPY.next)}
            </button>
          ) : null}
        </div>
      </form>
    </>,
  )
}
