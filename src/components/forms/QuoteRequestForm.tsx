"use client"

import { submitQuoteRequest } from "@/app/actions/quote"
import {
  quoteRequestSchema,
  tripTypes,
  type TripType,
} from "@/components/forms/formSchemas"
import { cn } from "@/lib/cn"
import { useTranslations } from "next-intl"
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
  const isOverlay = variant === "overlay"
  const [tripType, setTripType] = useState<TripType>("individual")
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [phone, setPhone] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("submitting")

    const payload = {
      tripType,
      pickup,
      destination,
      date,
      passengers: Number(passengers),
      phone,
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

  const tripLabel = (type: TripType) =>
    type === "individual"
      ? t("tripIndividual")
      : type === "group"
        ? t("tripGroup")
        : t("tripCorporate")

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

          {/* Native select on small screens — 3 long labels crush in a row */}
          <label className="block sm:hidden">
            <span className="sr-only">{t("tripType")}</span>
            <select
              className={cn(fieldClass, "appearance-none bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat pr-10")}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%235c5666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
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

          <div
            role="radiogroup"
            aria-label={t("tripType")}
            className="hidden grid-cols-3 gap-1 rounded-xl bg-ink/[0.04] p-1 sm:grid"
          >
            {tripTypes.map((type) => {
              const selected = tripType === type
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTripType(type)}
                  className={cn(
                    "font-label rounded-lg px-2 py-2.5 text-center text-sm font-semibold transition",
                    selected
                      ? "bg-white text-ink shadow-sm ring-1 ring-ink/6"
                      : "text-ink/50 hover:text-ink",
                  )}
                >
                  {tripLabel(type)}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          <label className="block min-w-0">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("pickup")}
            </span>
            <input
              className={isOverlay ? overlayFieldClass : fieldClass}
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
              className={isOverlay ? overlayFieldClass : fieldClass}
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
              className={cn(
                isOverlay ? overlayFieldClass : fieldClass,
                "min-h-[3.25rem] sm:min-h-0",
              )}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              aria-label={t("date")}
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
              className={isOverlay ? overlayFieldClass : fieldClass}
              value={passengers}
              onChange={(event) => setPassengers(event.target.value)}
              required
              aria-label={t("passengers")}
            />
          </label>

          <label className="block min-w-0 sm:col-span-2">
            <span className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink/45 uppercase">
              {t("phone")}
            </span>
            <input
              type="tel"
              className={isOverlay ? overlayFieldClass : fieldClass}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              dir="ltr"
              autoComplete="tel"
              inputMode="tel"
              aria-label={t("phone")}
            />
          </label>
        </div>

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
