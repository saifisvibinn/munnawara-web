"use client"

import { submitQuoteRequest } from "@/app/actions/quote"
import {
  busClasses,
  orgRequiredTypes,
  quoteRequestSchema,
  quoteSteps,
  tripTypes,
  type BusClass,
  type QuoteStep,
  type TripType,
} from "@/components/forms/formSchemas"
import { cn } from "@/lib/cn"
import { useLocale, useTranslations } from "next-intl"
import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"

type QuoteRequestFormProps = {
  className?: string
  variant?: "card" | "overlay"
  formId?: string
}

type FieldKey =
  | "customerName"
  | "organization"
  | "phone"
  | "email"
  | "passengers"
  | "pickup"
  | "destination"
  | "date"
  | "busCount"
  | "consent"

const fieldClass =
  "w-full min-w-0 rounded-xl border border-border bg-surface-muted px-3.5 py-3.5 text-base text-ink outline-none transition placeholder:text-ink-muted focus:border-orange/40 focus:bg-surface-elevated focus:ring-2 focus:ring-orange/25 sm:py-3 sm:text-[0.9375rem]"

const overlayFieldClass =
  "w-full min-w-0 rounded-xl border border-border bg-surface-muted px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink-muted focus:border-orange/40 focus:bg-surface-elevated focus:ring-2 focus:ring-orange/25 sm:text-[0.9375rem]"

const fieldErrorRing =
  "ring-2 ring-red-400/50 focus:ring-red-400/60 bg-red-50/60 dark:bg-red-950/40"

const btnPrimary =
  "font-label inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated disabled:opacity-60"

const btnGhost =
  "font-label inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink"

function Field({
  label,
  children,
  className,
  error,
  htmlFor,
}: {
  label: string
  children: ReactNode
  className?: string
  error?: string
  htmlFor?: string
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
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          className="mt-1.5 flex items-start gap-1.5 text-sm leading-snug text-red-700"
          role="alert"
        >
          <span
            aria-hidden
            className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[0.65rem] font-bold text-red-600"
          >
            !
          </span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}

export const QuoteRequestForm = ({
  className,
  variant = "card",
  formId = "quote",
}: QuoteRequestFormProps) => {
  const t = useTranslations("quote")
  const locale = useLocale()
  const isOverlay = variant === "overlay"
  const inputClass = isOverlay ? overlayFieldClass : fieldClass

  const [stepIndex, setStepIndex] = useState(0)
  const step = quoteSteps[stepIndex]

  const [tripType, setTripType] = useState<TripType>("group")
  const [customerName, setCustomerName] = useState("")
  const [organization, setOrganization] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [stops, setStops] = useState("")
  const [date, setDate] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [waitingHours, setWaitingHours] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [busCount, setBusCount] = useState("1")
  const [busClass, setBusClass] = useState<BusClass>("standard")
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("")
  const [luggageNotes, setLuggageNotes] = useState("")
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [needsSupervisors, setNeedsSupervisors] = useState(false)
  const [needsTracking, setNeedsTracking] = useState(false)
  const [needsBranding, setNeedsBranding] = useState(false)
  const [needsAirportReception, setNeedsAirportReception] = useState(false)
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  )
  const [leadId, setLeadId] = useState<string | null>(null)
  const [slaHours, setSlaHours] = useState(24)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>(
    {},
  )
  const [formError, setFormError] = useState<string | null>(null)

  const needsOrg = orgRequiredTypes.includes(tripType)
  const showWaiting =
    tripType === "corporate" ||
    tripType === "government" ||
    tripType === "tourism" ||
    tripType === "group"

  const tripLabel = (type: TripType) => t(`trip_${type}` as "trip_group")
  const tripHint = (type: TripType) => t(`hint_${type}` as "hint_group")

  const progress = useMemo(
    () => ((stepIndex + 1) / quoteSteps.length) * 100,
    [stepIndex],
  )

  const clearError = (key: FieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const inputProps = (key: FieldKey, id: string) => ({
    id,
    className: cn(inputClass, fieldErrors[key] && fieldErrorRing),
    "aria-invalid": Boolean(fieldErrors[key]) || undefined,
    "aria-describedby": fieldErrors[key] ? `${id}-error` : undefined,
  })

  const buildPayload = () => ({
    tripType,
    customerName,
    organization,
    email,
    phone,
    pickup,
    destination,
    stops,
    date,
    departureTime,
    returnDate,
    waitingHours: waitingHours === "" ? null : Number(waitingHours),
    passengers: Number(passengers),
    busCount: Number(busCount) || 1,
    busClass,
    accessibilityNeeds,
    luggageNotes,
    specialRequirements,
    needsSupervisors,
    needsTracking,
    needsBranding,
    needsAirportReception,
    consent,
    language: locale === "ar" ? ("ar" as const) : ("en" as const),
    companyWebsite: honeypot,
  })

  const validateStep = (current: QuoteStep): boolean => {
    const next: Partial<Record<FieldKey, string>> = {}
    setFormError(null)

    switch (current) {
      case "type":
        break
      case "contact":
        if (customerName.trim().length < 2) next.customerName = t("errName")
        if (phone.trim().length < 8) next.phone = t("errPhone")
        if (needsOrg && !organization.trim()) next.organization = t("errOrg")
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          next.email = t("errEmail")
        }
        break
      case "passengers":
        if (!Number(passengers) || Number(passengers) < 1) {
          next.passengers = t("errPassengers")
        }
        break
      case "route":
        if (pickup.trim().length < 2) next.pickup = t("errPickup")
        if (destination.trim().length < 2) next.destination = t("errDestination")
        break
      case "timing":
        if (!date) next.date = t("errDate")
        break
      case "vehicles":
        if (!Number(busCount) || Number(busCount) < 1) next.busCount = t("errBuses")
        break
      case "requirements":
        break
      case "consent":
        if (!consent) next.consent = t("errConsent")
        break
      default:
        break
    }

    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStepIndex((i) => Math.min(i + 1, quoteSteps.length - 1))
  }

  const goBack = () => {
    setFieldErrors({})
    setFormError(null)
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step !== "consent") {
      goNext()
      return
    }
    if (!validateStep("consent")) return

    setStatus("submitting")
    setFormError(null)
    const parsed = quoteRequestSchema.safeParse(buildPayload())
    if (!parsed.success) {
      setStatus("error")
      setFormError(t("error"))
      return
    }

    const result = await submitQuoteRequest(parsed.data)
    if (result.ok) {
      setLeadId(result.leadId || null)
      setSlaHours(result.quoteSlaHours || 24)
      setStatus("success")
    } else {
      setStatus("error")
      setFormError(t("error"))
    }
  }

  if (status === "success") {
    return (
      <div
        id={formId}
        className={cn(
          isOverlay
            ? "bg-transparent p-0 text-start"
            : "rounded-2xl bg-surface-elevated/90 p-4 text-start ring-1 ring-border backdrop-blur-md sm:p-6 md:p-8",
          className,
        )}
        role="status"
      >
        <p className="font-label text-[0.7rem] font-semibold tracking-[0.14em] text-orange uppercase">
          {t("resultEyebrow")}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
          {t("resultTitle")}
        </h3>
        {leadId ? (
          <p className="mt-3 rounded-xl bg-surface-muted px-4 py-3 font-mono text-sm text-ink">
            {t("resultLeadId", { id: leadId })}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {t("resultSla", { hours: slaHours })}
        </p>
        <p className="mt-2 text-sm text-ink/55">{t("resultNote")}</p>
        <button
          type="button"
          className={cn(btnGhost, "mt-5")}
          onClick={() => {
            setStatus("idle")
            setStepIndex(0)
            setConsent(false)
            setLeadId(null)
            setFieldErrors({})
            setFormError(null)
          }}
        >
          {t("newRequest")}
        </button>
      </div>
    )
  }

  return (
    <div
      id={formId}
      className={cn(
        isOverlay
          ? "bg-transparent p-0 text-start shadow-none"
          : "rounded-2xl bg-surface-elevated/90 p-4 text-start ring-1 ring-border backdrop-blur-md sm:p-6 md:p-8",
        className,
      )}
    >
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 text-xs text-ink/45">
          <span className="font-label tracking-[0.12em] uppercase">
            {t("stepLabel", {
              current: stepIndex + 1,
              total: quoteSteps.length,
            })}
          </span>
          <span>{t(`step_${step}` as "step_type")}</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-orange transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {tripType === "hajj_mission" && stepIndex > 0 ? (
        <p className="mb-4 rounded-xl bg-orange/10 px-3.5 py-2.5 text-sm text-ink/75">
          {t("hajjNote")}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {step === "type" ? (
          <fieldset>
            <legend className="font-label mb-3 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              {t("tripType")}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {tripTypes.map((type) => {
                const selected = tripType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTripType(type)}
                    className={cn(
                      "rounded-xl px-4 py-3.5 text-start transition",
                      selected
                        ? "bg-black text-white shadow-sm"
                        : "bg-surface-muted text-ink hover:bg-surface-container",
                    )}
                  >
                    <span className="block text-sm font-semibold">
                      {tripLabel(type)}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-xs leading-snug",
                        selected ? "text-white/70" : "text-ink/50",
                      )}
                    >
                      {tripHint(type)}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {step === "contact" ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field
              label={t("name")}
              className="sm:col-span-2"
              htmlFor="quote-name"
              error={fieldErrors.customerName}
            >
              <input
                {...inputProps("customerName", "quote-name")}
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value)
                  clearError("customerName")
                }}
                autoComplete="name"
                required
              />
            </Field>
            <Field
              label={needsOrg ? t("organization") : t("organizationOptional")}
              className="sm:col-span-2"
              htmlFor="quote-org"
              error={fieldErrors.organization}
            >
              <input
                {...inputProps("organization", "quote-org")}
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value)
                  clearError("organization")
                }}
                autoComplete="organization"
                required={needsOrg}
              />
            </Field>
            <Field
              label={t("phone")}
              htmlFor="quote-phone"
              error={fieldErrors.phone}
            >
              <input
                {...inputProps("phone", "quote-phone")}
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  clearError("phone")
                }}
                dir="ltr"
                autoComplete="tel"
                required
              />
            </Field>
            <Field
              label={t("email")}
              htmlFor="quote-email"
              error={fieldErrors.email}
            >
              <input
                {...inputProps("email", "quote-email")}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError("email")
                }}
                dir="ltr"
                autoComplete="email"
              />
            </Field>
          </div>
        ) : null}

        {step === "passengers" ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field
              label={
                tripType === "school"
                  ? t("passengersSchool")
                  : tripType === "hajj_mission"
                    ? t("passengersHajj")
                    : t("passengers")
              }
              htmlFor="quote-passengers"
              error={fieldErrors.passengers}
            >
              <input
                {...inputProps("passengers", "quote-passengers")}
                type="number"
                min={1}
                max={500}
                value={passengers}
                onChange={(e) => {
                  setPassengers(e.target.value)
                  clearError("passengers")
                }}
                required
              />
            </Field>
            <Field label={t("accessibility")} htmlFor="quote-access">
              <input
                id="quote-access"
                className={inputClass}
                value={accessibilityNeeds}
                onChange={(e) => setAccessibilityNeeds(e.target.value)}
                placeholder={t("accessibilityPh")}
              />
            </Field>
            <Field
              label={t("luggage")}
              className="sm:col-span-2"
              htmlFor="quote-luggage"
            >
              <input
                id="quote-luggage"
                className={inputClass}
                value={luggageNotes}
                onChange={(e) => setLuggageNotes(e.target.value)}
                placeholder={t("luggagePh")}
              />
            </Field>
          </div>
        ) : null}

        {step === "route" ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field
              label={t("pickup")}
              htmlFor="quote-pickup"
              error={fieldErrors.pickup}
            >
              <input
                {...inputProps("pickup", "quote-pickup")}
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value)
                  clearError("pickup")
                }}
                required
              />
            </Field>
            <Field
              label={t("destination")}
              htmlFor="quote-destination"
              error={fieldErrors.destination}
            >
              <input
                {...inputProps("destination", "quote-destination")}
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  clearError("destination")
                }}
                required
              />
            </Field>
            <Field
              label={
                tripType === "school"
                  ? t("stopsSchool")
                  : tripType === "corporate" || tripType === "government"
                    ? t("stopsCorporate")
                    : t("stops")
              }
              className="sm:col-span-2"
              htmlFor="quote-stops"
            >
              <input
                id="quote-stops"
                className={inputClass}
                value={stops}
                onChange={(e) => setStops(e.target.value)}
                placeholder={t("stopsPh")}
              />
            </Field>
          </div>
        ) : null}

        {step === "timing" ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label={t("date")} htmlFor="quote-date" error={fieldErrors.date}>
              <input
                {...inputProps("date", "quote-date")}
                type="date"
                className={cn(
                  inputClass,
                  "min-h-[3.25rem] sm:min-h-0",
                  fieldErrors.date && fieldErrorRing,
                )}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  clearError("date")
                }}
                required
              />
            </Field>
            <Field label={t("departureTime")} htmlFor="quote-time">
              <input
                id="quote-time"
                type="time"
                className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </Field>
            <Field label={t("returnDate")} htmlFor="quote-return">
              <input
                id="quote-return"
                type="date"
                className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Field>
            {showWaiting ? (
              <Field label={t("waitingHours")} htmlFor="quote-waiting">
                <input
                  id="quote-waiting"
                  type="number"
                  min={0}
                  max={168}
                  className={inputClass}
                  value={waitingHours}
                  onChange={(e) => setWaitingHours(e.target.value)}
                  placeholder="0"
                />
              </Field>
            ) : null}
          </div>
        ) : null}

        {step === "vehicles" ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field
              label={t("busCount")}
              htmlFor="quote-buses"
              error={fieldErrors.busCount}
            >
              <input
                {...inputProps("busCount", "quote-buses")}
                type="number"
                min={1}
                max={50}
                value={busCount}
                onChange={(e) => {
                  setBusCount(e.target.value)
                  clearError("busCount")
                }}
                required
              />
            </Field>
            <Field label={t("busClass")} htmlFor="quote-bus-class">
              <select
                id="quote-bus-class"
                className={cn(inputClass, "appearance-none")}
                value={busClass}
                onChange={(e) => setBusClass(e.target.value as BusClass)}
              >
                {busClasses.map((c) => (
                  <option key={c} value={c}>
                    {t(`bus_${c}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : null}

        {step === "requirements" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {(
                [
                  ["needsSupervisors", needsSupervisors, setNeedsSupervisors],
                  ["needsTracking", needsTracking, setNeedsTracking],
                  ["needsBranding", needsBranding, setNeedsBranding],
                  [
                    "needsAirportReception",
                    needsAirportReception,
                    setNeedsAirportReception,
                  ],
                ] as const
              ).map(([key, value, setter]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface-muted px-3.5 py-3 text-sm text-ink/80"
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-ink/20"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                  />
                  {t(key)}
                </label>
              ))}
            </div>
            <Field
              label={t("specialRequirements")}
              htmlFor="quote-special"
            >
              <textarea
                id="quote-special"
                className={cn(inputClass, "min-h-[5.5rem] resize-y")}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder={t("specialRequirementsPh")}
              />
            </Field>
          </div>
        ) : null}

        {step === "consent" ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink/70">
              <p>
                <span className="font-semibold text-ink">{tripLabel(tripType)}</span>
                {" · "}
                {pickup} → {destination}
              </p>
              <p className="mt-1">
                {date}
                {departureTime ? ` ${departureTime}` : ""} · {passengers}{" "}
                {t("passengersShort")} · {busCount}× {t(`bus_${busClass}`)}
              </p>
              <p className="mt-1">
                {customerName} · {phone}
              </p>
            </div>
            <div>
              <label
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3.5 py-3 text-sm text-ink/70 transition",
                  fieldErrors.consent
                    ? "bg-red-50 ring-2 ring-red-400/40"
                    : "bg-surface-muted/60",
                )}
              >
                <input
                  id="quote-consent"
                  type="checkbox"
                  className="mt-1 size-4 rounded border-ink/20"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    clearError("consent")
                  }}
                  aria-invalid={Boolean(fieldErrors.consent) || undefined}
                  aria-describedby={
                    fieldErrors.consent ? "quote-consent-error" : undefined
                  }
                  required
                />
                <span>{t("consent")}</span>
              </label>
              {fieldErrors.consent ? (
                <p
                  id="quote-consent-error"
                  className="mt-1.5 flex items-start gap-1.5 px-1 text-sm leading-snug text-red-700"
                  role="alert"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[0.65rem] font-bold text-red-600"
                  >
                    !
                  </span>
                  <span>{fieldErrors.consent}</span>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {formError || status === "error" ? (
          <div
            className="flex items-start gap-2.5 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-800 ring-1 ring-red-200/80"
            role="alert"
          >
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600"
            >
              !
            </span>
            <span>{formError || t("error")}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {stepIndex > 0 ? (
            <button type="button" className={btnGhost} onClick={goBack}>
              {t("back")}
            </button>
          ) : null}
          {step !== "consent" ? (
            <button
              type="button"
              className={cn(btnPrimary, "ms-auto")}
              onClick={goNext}
            >
              {t("next")}
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "submitting"}
              className={cn(btnPrimary, "ms-auto")}
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </button>
          )}
        </div>

        <label className="sr-only" aria-hidden>
          {t("honeypot")}
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </form>
    </div>
  )
}
