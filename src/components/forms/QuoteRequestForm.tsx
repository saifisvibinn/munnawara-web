"use client"

import { submitQuoteRequest } from "@/app/actions/quote"
import {
  busClasses,
  quoteRequestSchema,
  tripTypes,
  type TripType,
} from "@/components/forms/formSchemas"
import { cn } from "@/lib/cn"
import { useLocale, useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"

type QuoteRequestFormProps = {
  className?: string
  variant?: "card" | "overlay"
  formId?: string
}

const fieldClass =
  "w-full min-w-0 rounded-xl border-0 bg-ink/[0.04] px-3.5 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-2 focus:ring-orange/25 sm:py-3 sm:text-[0.9375rem]"

const overlayFieldClass =
  "w-full min-w-0 rounded-xl border-0 bg-ink/[0.04] px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-2 focus:ring-orange/25 sm:text-[0.9375rem]"

export const QuoteRequestForm = ({
  className,
  variant = "card",
  formId = "quote",
}: QuoteRequestFormProps) => {
  const t = useTranslations("quote")
  const locale = useLocale()
  const isOverlay = variant === "overlay"
  const inputClass = isOverlay ? overlayFieldClass : fieldClass

  const [tripType, setTripType] = useState<TripType>("individual")
  const [customerName, setCustomerName] = useState("")
  const [organization, setOrganization] = useState("")
  const [email, setEmail] = useState("")
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [busClass, setBusClass] = useState<(typeof busClasses)[number]>("standard")
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("")
  const [luggageNotes, setLuggageNotes] = useState("")
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  )

  const tripLabel = (type: TripType) => {
    switch (type) {
      case "individual":
        return t("tripIndividual")
      case "group":
        return t("tripGroup")
      case "corporate":
        return t("tripCorporate")
      case "school":
        return t("tripSchool")
      case "hajj_mission":
        return t("tripHajj")
      case "tourism":
        return t("tripTourism")
      default:
        return type
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("submitting")

    const payload = {
      tripType,
      customerName,
      organization,
      email,
      pickup,
      destination,
      date,
      returnDate,
      passengers: Number(passengers),
      busClass,
      accessibilityNeeds,
      luggageNotes,
      phone,
      consent,
      language: locale === "ar" ? ("ar" as const) : ("en" as const),
      companyWebsite: honeypot,
    }

    const parsed = quoteRequestSchema.safeParse(payload)
    if (!parsed.success) {
      setStatus("error")
      return
    }

    const result = await submitQuoteRequest(parsed.data)
    setStatus(result.ok ? "success" : "error")
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
      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
        <fieldset className="min-w-0">
          <legend className="font-label mb-2 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase sm:mb-2.5">
            {t("tripType")}
          </legend>
          <label className="block">
            <span className="sr-only">{t("tripType")}</span>
            <select
              className={cn(inputClass, "appearance-none")}
              value={tripType}
              onChange={(event) => setTripType(event.target.value as TripType)}
              required
              aria-label={t("tripType")}
            >
              {tripTypes.map((type) => (
                <option key={type} value={type}>
                  {tripLabel(type)}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          <label className="block min-w-0 sm:col-span-2">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("name")}
            </span>
            <input
              className={inputClass}
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              required
              autoComplete="name"
              aria-label={t("name")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("organization")}
            </span>
            <input
              className={inputClass}
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              autoComplete="organization"
              aria-label={t("organization")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("email")}
            </span>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              dir="ltr"
              aria-label={t("email")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("pickup")}
            </span>
            <input
              className={inputClass}
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
              required
              autoComplete="address-level2"
              aria-label={t("pickup")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("destination")}
            </span>
            <input
              className={inputClass}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              required
              aria-label={t("destination")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("date")}
            </span>
            <input
              type="date"
              className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              aria-label={t("date")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("returnDate")}
            </span>
            <input
              type="date"
              className={cn(inputClass, "min-h-[3.25rem] sm:min-h-0")}
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              aria-label={t("returnDate")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("passengers")}
            </span>
            <input
              type="number"
              min={1}
              max={500}
              inputMode="numeric"
              className={inputClass}
              value={passengers}
              onChange={(event) => setPassengers(event.target.value)}
              required
              aria-label={t("passengers")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("busClass")}
            </span>
            <select
              className={cn(inputClass, "appearance-none")}
              value={busClass}
              onChange={(event) =>
                setBusClass(event.target.value as (typeof busClasses)[number])
              }
              aria-label={t("busClass")}
            >
              {busClasses.map((c) => (
                <option key={c} value={c}>
                  {t(`bus_${c}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0 sm:col-span-2">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("phone")}
            </span>
            <input
              type="tel"
              className={inputClass}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              dir="ltr"
              autoComplete="tel"
              inputMode="tel"
              aria-label={t("phone")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("accessibility")}
            </span>
            <input
              className={inputClass}
              value={accessibilityNeeds}
              onChange={(event) => setAccessibilityNeeds(event.target.value)}
              aria-label={t("accessibility")}
            />
          </label>

          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("luggage")}
            </span>
            <input
              className={inputClass}
              value={luggageNotes}
              onChange={(event) => setLuggageNotes(event.target.value)}
              aria-label={t("luggage")}
            />
          </label>
        </div>

        <label className="flex items-start gap-3 text-sm text-ink/70">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-ink/20"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
          />
          <span>{t("consent")}</span>
        </label>

        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "font-label inline-flex w-full items-center justify-center rounded-xl bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-60",
              isOverlay && "sm:ms-auto sm:w-auto sm:min-w-[10.5rem]",
            )}
          >
            {status === "submitting" ? t("submitting") : t("submit")}
          </button>

          {status === "success" ? (
            <p className="text-center text-sm text-orange sm:text-start" role="status">
              {t("success")}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-center text-sm text-red-600 sm:text-start" role="alert">
              {t("error")}
            </p>
          ) : null}
        </div>

        <label className="sr-only" aria-hidden>
          {t("honeypot")}
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>
      </form>
    </div>
  )
}
