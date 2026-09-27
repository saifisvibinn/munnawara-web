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
import { useMemo, useState, type FormEvent } from "react"

type QuoteRequestFormProps = {
  className?: string
  variant?: "card" | "overlay"
  formId?: string
}

const fieldClass =
  "w-full min-w-0 rounded-xl border-0 bg-ink/[0.04] px-3.5 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-2 focus:ring-orange/25 sm:py-3 sm:text-[0.9375rem]"

const overlayFieldClass =
  "w-full min-w-0 rounded-xl border-0 bg-ink/[0.04] px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-2 focus:ring-orange/25 sm:text-[0.9375rem]"

const btnPrimary =
  "font-label inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-60"

const btnGhost =
  "font-label inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink"

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

  const [tripType, setTripType] = useState<TripType>("individual")
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
  const [stepError, setStepError] = useState<string | null>(null)

  const needsOrg = orgRequiredTypes.includes(tripType)
  const showWaiting =
    tripType === "corporate" ||
    tripType === "government" ||
    tripType === "tourism" ||
    tripType === "group"
  const showExtras =
    tripType !== "individual" ||
    needsSupervisors ||
    needsTracking ||
    needsBranding ||
    needsAirportReception

  const tripLabel = (type: TripType) => t(`trip_${type}` as "trip_individual")
  const tripHint = (type: TripType) => t(`hint_${type}` as "hint_individual")

  const progress = useMemo(
    () => ((stepIndex + 1) / quoteSteps.length) * 100,
    [stepIndex],
  )

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
    setStepError(null)
    switch (current) {
      case "type":
        return true
      case "contact":
        if (customerName.trim().length < 2) {
          setStepError(t("errName"))
          return false
        }
        if (phone.trim().length < 8) {
          setStepError(t("errPhone"))
          return false
        }
        if (needsOrg && !organization.trim()) {
          setStepError(t("errOrg"))
          return false
        }
        return true
      case "passengers":
        if (!Number(passengers) || Number(passengers) < 1) {
          setStepError(t("errPassengers"))
          return false
        }
        return true
      case "route":
        if (pickup.trim().length < 2 || destination.trim().length < 2) {
          setStepError(t("errRoute"))
          return false
        }
        return true
      case "timing":
        if (!date) {
          setStepError(t("errDate"))
          return false
        }
        return true
      case "vehicles":
        if (!Number(busCount) || Number(busCount) < 1) {
          setStepError(t("errBuses"))
          return false
        }
        return true
      case "requirements":
        return true
      case "consent":
        if (!consent) {
          setStepError(t("errConsent"))
          return false
        }
        return true
      default:
        return true
    }
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStepIndex((i) => Math.min(i + 1, quoteSteps.length - 1))
  }

  const goBack = () => {
    setStepError(null)
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
    const parsed = quoteRequestSchema.safeParse(buildPayload())
    if (!parsed.success) {
      setStatus("error")
      setStepError(t("error"))
      return
    }

    const result = await submitQuoteRequest(parsed.data)
    if (result.ok) {
      setLeadId(result.leadId || null)
      setSlaHours(result.quoteSlaHours || 24)
      setStatus("success")
    } else {
      setStatus("error")
    }
  }

  const Field = ({
    label,
    children,
    className: fieldWrapClass,
  }: {
    label: string
    children: React.ReactNode
    className?: string
  }) => (
    <label className={cn("block min-w-0", fieldWrapClass)}>
      <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
        {label}
      </span>
      {children}
    </label>
  )

  if (status === "success") {
    return (
      <div
        id={formId}
        className={cn(
          isOverlay
            ? "bg-transparent p-0 text-start"
            : "rounded-2xl bg-white/90 p-4 text-start ring-1 ring-ink/6 backdrop-blur-md sm:p-6 md:p-8",
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
          <p className="mt-3 rounded-xl bg-ink/[0.04] px-4 py-3 font-mono text-sm text-ink">
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
          : "rounded-2xl bg-white/90 p-4 text-start ring-1 ring-ink/6 backdrop-blur-md sm:p-6 md:p-8",
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
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/[0.08]">
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
            <legend className="font-label mb-3 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
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
                        ? "bg-ink text-white shadow-sm"
                        : "bg-ink/[0.04] text-ink hover:bg-ink/[0.07]",
                    )}
                  >
                    <span className="block text-sm font-semibold">{tripLabel(type)}</span>
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
            <Field label={t("name")} className="sm:col-span-2">
              <input
                className={inputClass}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoComplete="name"
                required
              />
            </Field>
            {needsOrg ? (
              <Field label={t("organization")} className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  autoComplete="organization"
                  required
                />
              </Field>
            ) : (
              <Field label={t("organizationOptional")} className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </Field>
            )}
            <Field label={t("phone")}>
              <input
                type="tel"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                autoComplete="tel"
                required
              />
            </Field>
            <Field label={t("email")}>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            >
              <input
                type="number"
                min={1}
                max={500}
                className={inputClass}
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                required
              />
            </Field>
            <Field label={t("accessibility")}>
              <input
                className={inputClass}
                value={accessibilityNeeds}
                onChange={(e) => setAccessibilityNeeds(e.target.value)}
                placeholder={t("accessibilityPh")}
              />
            </Field>
            <Field label={t("luggage")} className="sm:col-span-2">
              <input
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
            <Field label={t("pickup")}>
              <input
                className={inputClass}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
            </Field>
            <Field label={t("destination")}>
              <input
                className={inputClass}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
            >
              <input
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
            <Field label={t("date")}>
              <input
                type="date"
                className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field label={t("departureTime")}>
              <input
                type="time"
                className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </Field>
            <Field label={t("returnDate")}>
              <input
                type="date"
                className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Field>
            {showWaiting ? (
              <Field label={t("waitingHours")}>
                <input
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
            <Field label={t("busCount")}>
              <input
                type="number"
                min={1}
                max={50}
                className={inputClass}
                value={busCount}
                onChange={(e) => setBusCount(e.target.value)}
                required
              />
            </Field>
            <Field label={t("busClass")}>
              <select
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
            {showExtras ? (
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
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-ink/[0.04] px-3.5 py-3 text-sm text-ink/80"
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
            ) : null}
            <Field label={t("specialRequirements")}>
              <textarea
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
            <div className="rounded-xl bg-ink/[0.04] px-4 py-3 text-sm text-ink/70">
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
              <p className="mt-1">{customerName} · {phone}</p>
            </div>
            <label className="flex items-start gap-3 text-sm text-ink/70">
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-ink/20"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <span>{t("consent")}</span>
            </label>
          </div>
        ) : null}

        {stepError ? (
          <p className="text-sm text-red-600" role="alert">
            {stepError}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-red-600" role="alert">
            {t("error")}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {stepIndex > 0 ? (
            <button type="button" className={btnGhost} onClick={goBack}>
              {t("back")}
            </button>
          ) : null}
          {step !== "consent" ? (
            <button type="button" className={cn(btnPrimary, "ms-auto")} onClick={goNext}>
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
