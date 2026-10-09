import type { TripType } from "@/components/forms/formSchemas"
import { cn } from "@/lib/cn"
import Image from "next/image"
import { useState } from "react"
import {
  busClassImages,
  busClassOptions,
  corporateServices,
  customerOptions,
  places,
} from "./quoteWizardConfig"
import { CheckBadge, choiceIcon } from "./QuoteChoiceIcons"
import { DatePicker, NumberStepper, TimePicker } from "./QuoteFields"
import { COPY } from "./quoteWizardCopy"
import { tripLine, type SummaryRow, type Tx } from "./quoteWizardLogic"
import { MAX_TRIPS, emptyTrip, type StepId, type Trip, type WizardState } from "./quoteWizardTypes"
import { Choices, Field, PlaceSelect, fieldClass, fieldErrorRing } from "./quoteWizardUi"

export type StepBodyProps = {
  step: StepId
  state: WizardState
  errors: Record<string, string>
  locale: string
  tx: Tx
  patch: (p: Partial<WizardState>) => void
  jumpTo: (id: StepId) => void
  needsOrg: boolean
  todayISO: string
  summaryRows: () => SummaryRow[]
}

const tripFields = ["from", "to", "date", "time"] as const

/** Trips as cards: finished ones collapse to a summary, the open one is editable. */
function TripsEditor({
  state,
  errors,
  locale,
  tx,
  patch,
  todayISO,
}: Pick<StepBodyProps, "state" | "errors" | "locale" | "tx" | "patch" | "todayISO">) {
  const { trips } = state
  const [open, setOpen] = useState(trips.length - 1)
  // A validation error always opens the trip it belongs to.
  const errAt = trips.findIndex((_, i) => tripFields.some((k) => errors[`${k}${i}`]))
  const current = errAt >= 0 ? errAt : Math.min(open, trips.length - 1)
  const last = trips[trips.length - 1]
  const lastDone = tripFields.every((k) => last[k])

  const set = (i: number, p: Partial<Trip>) =>
    patch({ trips: trips.map((t, j) => (j === i ? { ...t, ...p } : t)) })
  const add = () => {
    patch({ trips: [...trips, { ...emptyTrip, from: last.to }] })
    setOpen(trips.length)
  }
  const remove = (i: number) => {
    patch({ trips: trips.filter((_, j) => j !== i) })
    setOpen(trips.length - 2)
  }

  return (
    <div className="space-y-3">
      {trips.map((t, i) =>
        i === current ? (
          <div
            key={i}
            className="space-y-3.5 rounded-2xl border border-border bg-surface-elevated p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-label text-xs font-semibold text-orange-text">
                {tx(COPY.trip(i + 1))}
              </p>
              {trips.length > 1 ? (
                <button
                  type="button"
                  className="text-xs font-semibold text-ink-muted transition-colors hover:text-orange-text"
                  onClick={() => remove(i)}
                >
                  {tx(COPY.removeTrip)}
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
              <Field label={tx(COPY.fields.from)} htmlFor={`qw-from-${i}`} error={errors[`from${i}`]}>
                <PlaceSelect
                  id={`qw-from-${i}`}
                  value={t.from}
                  options={places}
                  locale={locale}
                  placeholder={tx(COPY.pickPlace)}
                  error={errors[`from${i}`]}
                  onChange={(v) => set(i, { from: v })}
                />
              </Field>
              <Field label={tx(COPY.fields.to)} htmlFor={`qw-to-${i}`} error={errors[`to${i}`]}>
                <PlaceSelect
                  id={`qw-to-${i}`}
                  value={t.to}
                  options={places}
                  locale={locale}
                  placeholder={tx(COPY.pickPlace)}
                  error={errors[`to${i}`]}
                  onChange={(v) => set(i, { to: v })}
                />
              </Field>
              <Field label={tx(COPY.fields.date)} htmlFor={`qw-date-${i}`} error={errors[`date${i}`]}>
                <DatePicker
                  id={`qw-date-${i}`}
                  locale={locale}
                  value={t.date}
                  min={todayISO}
                  placeholder={tx(COPY.pickDate)}
                  error={errors[`date${i}`]}
                  onChange={(v) => set(i, { date: v })}
                />
              </Field>
              <Field label={tx(COPY.fields.time)} htmlFor={`qw-time-${i}`} error={errors[`time${i}`]}>
                <TimePicker
                  id={`qw-time-${i}`}
                  locale={locale}
                  value={t.time}
                  placeholder={tx(COPY.pickTime)}
                  error={errors[`time${i}`]}
                  onChange={(v) => set(i, { time: v })}
                />
              </Field>
            </div>
          </div>
        ) : (
          <div
            key={i}
            className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-surface-muted px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-label text-xs font-semibold text-orange-text">
                {tx(COPY.trip(i + 1))}
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink">{tripLine(t, locale, true)}</p>
            </div>
            <button
              type="button"
              className="shrink-0 text-xs font-semibold text-orange-text hover:underline"
              onClick={() => setOpen(i)}
            >
              {tx(COPY.edit)}
            </button>
          </div>
        ),
      )}
      <button
        type="button"
        disabled={!lastDone || trips.length >= MAX_TRIPS}
        onClick={add}
        className="font-label inline-flex items-center gap-2 rounded-full border border-orange/50 px-4 py-2 text-sm font-semibold text-orange-text transition-[background-color,transform] duration-150 hover:bg-orange/[0.06] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100"
      >
        <span aria-hidden>+</span>
        {tx(COPY.addTrip)}
      </button>
    </div>
  )
}

export function StepBody({
  step,
  state,
  errors,
  locale,
  tx,
  patch,
  jumpTo,
  needsOrg,
  todayISO,
  summaryRows,
}: StepBodyProps) {
  const inputErr = (key: string) => (errors[key] ? fieldErrorRing : "")
  const totalBusCount = Object.values(state.busCounts).reduce(
    (total, count) => total + Number(count || 0),
    0,
  )

  switch (step) {
    case "customer":
      return (
        <Choices
          options={customerOptions}
          value={state.customer}
          locale={locale}
          onPick={(id) =>
            patch({
              customer: id as TripType,
              service: id === "company" ? state.service : "",
            })
          }
        />
      )
    case "service":
      return (
        <Choices
          options={corporateServices}
          value={state.service}
          locale={locale}
          onPick={(id) => patch({ service: id })}
        />
      )
    case "route":
      return (
        <TripsEditor
          state={state}
          errors={errors}
          locale={locale}
          tx={tx}
          patch={patch}
          todayISO={todayISO}
        />
      )
    case "vehicle":
      return (
        <div
          className="grid max-h-[calc(100dvh_-_20rem)] grid-cols-1 items-start gap-2 overflow-y-auto overscroll-contain @md:grid-cols-2 @md:gap-3 @xl:grid-cols-4"
          data-lenis-prevent
          role="group"
          aria-label={tx(COPY.titles.vehicle)}
        >
          {busClassOptions.map((o) => {
            const busCount = Number(state.busCounts[o.id] ?? 0)
            const selected = busCount > 0
            return (
              <div
                key={o.id}
                className={cn(
                  "flex flex-col rounded-2xl border bg-surface-elevated p-1.5 transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none @md:p-2",
                  selected
                    ? "border-orange shadow-[0_0_0_1px_var(--brand-orange),0_16px_32px_-22px_rgb(243_112_33/0.8)]"
                    : "border-border hover:border-ink/20 hover:shadow-[0_12px_28px_-20px_rgb(0_0_0/0.5)]",
                )}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => {
                    const busCounts = { ...state.busCounts }
                    if (selected) delete busCounts[o.id]
                    else busCounts[o.id] = "1"
                    patch({ busCounts })
                  }}
                  className="group flex items-center gap-3 rounded-xl text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/60 @md:flex-col @md:items-stretch @md:gap-0"
                >
                  <span className="relative block aspect-[16/9] w-[4.75rem] shrink-0 overflow-hidden rounded-xl bg-surface-elevated @md:w-full">
                    <Image
                      src={busClassImages[o.id]}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 240px, (min-width: 768px) 33vw, 45vw"
                      className="scale-[1.12] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.18] motion-reduce:transition-none motion-reduce:group-hover:scale-[1.12]"
                    />
                    {selected ? (
                      <CheckBadge />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute end-2 top-2 size-5 rounded-full border-[1.5px] border-white bg-black/20 shadow-sm"
                      />
                    )}
                  </span>
                  <span className="block min-w-0 @md:mt-3 @md:px-1.5">
                    <span className="block text-[0.95rem] leading-snug font-semibold text-ink">
                      {tx(o.label)}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted @md:mt-1 @md:mb-1">
                      {choiceIcon("individual")}
                      {tx(o.hint)}
                    </span>
                  </span>
                </button>
                {selected ? (
                  <Field
                    label={tx(COPY.fields.busCount)}
                    htmlFor={`qw-buses-${o.id}`}
                    className="mt-1 border-t border-border px-1.5 pt-1.5 pb-0.5 @md:mt-2 @md:pt-3 @md:pb-1 [&>label]:sr-only @md:[&>label]:not-sr-only"
                  >
                    <NumberStepper
                      id={`qw-buses-${o.id}`}
                      locale={locale}
                      min={1}
                      max={50 - totalBusCount + busCount}
                      value={String(busCount)}
                      onChange={(v) =>
                        patch({ busCounts: { ...state.busCounts, [o.id]: v } })
                      }
                    />
                  </Field>
                ) : null}
              </div>
            )
          })}
        </div>
      )
    case "passengers":
      return (
        <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
          <Field
            label={tx(COPY.fields.passengers)}
            htmlFor="qw-pax"
            error={errors.passengers}
          >
            <NumberStepper
              id="qw-pax"
              locale={locale}
              min={1}
              max={500}
              step={1}
              error={errors.passengers}
              value={state.passengers}
              onChange={(v) => patch({ passengers: v })}
            />
          </Field>
          <Field label={tx(COPY.fields.luggage)} htmlFor="qw-luggage">
            <input
              id="qw-luggage"
              name="luggage"
              className={fieldClass}
              value={state.luggage}
              onChange={(e) => patch({ luggage: e.target.value })}
            />
          </Field>
          <Field label={tx(COPY.fields.accessibility)} htmlFor="qw-access">
            <input
              id="qw-access"
              name="access"
              className={fieldClass}
              value={state.accessibility}
              onChange={(e) => patch({ accessibility: e.target.value })}
            />
          </Field>
          <Field label={tx(COPY.fields.notes)} htmlFor="qw-notes" className="@lg:col-span-2">
            <textarea
              id="qw-notes"
              name="notes"
              className={cn(fieldClass, "min-h-[5.5rem] resize-none")}
              value={state.notes}
              onChange={(e) => patch({ notes: e.target.value })}
            />
          </Field>
        </div>
      )
    case "contact":
      return (
        <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
          <Field
            label={tx(COPY.fields.name)}
            htmlFor="qw-name"
            error={errors.name}
            className="@lg:col-span-2"
          >
            <input
              id="qw-name"
              name="name"
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
              className="@lg:col-span-2"
            >
              <input
                id="qw-org"
                name="org"
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
              name="phone"
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
              name="email"
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
                key={row.id + row.label.en + row.value}
                className="flex items-start justify-between gap-3 px-4 py-[clamp(0.25rem,1.1vh,0.625rem)]"
              >
                <div className="min-w-0">
                  <dt className="text-xs text-ink-muted">{tx(row.label)}</dt>
                  <dd className="text-ink/85">{row.value}</dd>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-orange-text hover:underline"
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
              errors.consent ? "bg-red-50 ring-2 ring-red-400/40 dark:bg-red-950/40" : "bg-surface-muted/60",
            )}
          >
            <input
              type="checkbox"
              name="consent"
              className="qw-check mt-0.5"
              checked={state.consent}
              onChange={(e) => patch({ consent: e.target.checked })}
            />
            <span>{tx(COPY.consent)}</span>
          </label>
          {errors.consent ? (
            <p className="px-1 text-sm text-red-700 dark:text-red-300" role="alert">
              {errors.consent}
            </p>
          ) : null}
        </div>
      )
    default:
      return null
  }
}
