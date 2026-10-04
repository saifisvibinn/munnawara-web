import type { BusClass, TripType } from "@/components/forms/formSchemas"
import { cn } from "@/lib/cn"
import {
  airports,
  busClassOptions,
  customerOptions,
  dawraLengths,
  defaultZiyarat,
  extraOptions,
  places,
  tripDirections,
  umrahKinds,
  ziyaratOptions,
  type Option,
} from "./quoteWizardConfig"
import { DatePicker, NumberStepper, TimePicker } from "./QuoteFields"
import { COPY } from "./quoteWizardCopy"
import type { SummaryRow, Tx } from "./quoteWizardLogic"
import type { StepId, WizardState } from "./quoteWizardTypes"
import { Choices, Field, PlaceSelect, fieldClass, fieldErrorRing } from "./quoteWizardUi"

export type StepBodyProps = {
  step: StepId
  state: WizardState
  errors: Record<string, string>
  locale: string
  tx: Tx
  patch: (p: Partial<WizardState>) => void
  jumpTo: (id: StepId) => void
  serviceOptions: readonly Option[]
  isCompany: boolean
  needsOrg: boolean
  todayISO: string
  summaryRows: () => SummaryRow[]
}

export function StepBody({
  step,
  state,
  errors,
  locale,
  tx,
  patch,
  jumpTo,
  serviceOptions,
  isCompany,
  needsOrg,
  todayISO,
  summaryRows,
}: StepBodyProps) {
  const twoWay = state.direction === "twoway"
  const isLongDawra = state.dawraLength === "long"
  const inputErr = (key: string) => (errors[key] ? fieldErrorRing : "")

  switch (step) {
    case "customer":
      return (
        <Choices
          options={customerOptions}
          value={state.customer}
          locale={locale}
          onPick={(id) => {
            const next = id as TripType
            patch({
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
          onPick={(id) => patch({ service: id, umrahKind: "", dawraLength: "" })}
        />
      )
    case "umrahKind":
      return (
        <Choices
          options={umrahKinds}
          value={state.umrahKind}
          locale={locale}
          onPick={(id) => patch({ umrahKind: id })}
        />
      )
    case "dawraLength":
      return (
        <Choices
          options={dawraLengths}
          value={state.dawraLength}
          locale={locale}
          onPick={(id) =>
            patch({ dawraLength: id, mazarat: id === "long" ? defaultZiyarat() : [] })
          }
        />
      )
    case "dawraRoute":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
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
          {isLongDawra ? (
            <fieldset className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <legend className="font-label text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
                  {tx(COPY.ziyaratTitle)}
                </legend>
                <div className="flex gap-1 text-xs font-semibold text-orange">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 hover:underline"
                    onClick={() => patch({ mazarat: ziyaratOptions.map((z) => z.id) })}
                  >
                    {tx(COPY.selectAll)}
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 hover:underline"
                    onClick={() => patch({ mazarat: [] })}
                  >
                    {tx(COPY.selectNone)}
                  </button>
                </div>
              </div>
              {(["makkah", "madinah"] as const).map((city) => (
                <div key={city}>
                  <p className="mb-2 text-sm font-semibold text-ink">
                    {tx(city === "makkah" ? COPY.cityMakkah : COPY.cityMadinah)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ziyaratOptions
                      .filter((z) => z.city === city)
                      .map((o) => {
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
                </div>
              ))}
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
          <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
            <Field label={tx(COPY.fields.from)} htmlFor="qw-from" error={errors.from}>
              <PlaceSelect
                id="qw-from"
                value={state.from}
                options={places}
                locale={locale}
                placeholder={tx(COPY.pickPlace)}
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
                placeholder={tx(COPY.pickPlace)}
                error={errors.to}
                onChange={(v) => patch({ to: v })}
              />
            </Field>
          </div>
        </div>
      )
    case "charterRoute":
      return (
        <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
          <Field label={tx(COPY.fields.pickup)} htmlFor="qw-pickup" error={errors.pickup}>
            <input
              id="qw-pickup"
              name="pickup"
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
              name="destination"
              className={cn(fieldClass, inputErr("destination"))}
              value={state.destination}
              onChange={(e) => patch({ destination: e.target.value })}
            />
          </Field>
          <Field
            label={tx(COPY.fields.stops)}
            htmlFor="qw-stops"
            className="@lg:col-span-2"
          >
            <input
              id="qw-stops"
              name="stops"
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
        <div className="grid grid-cols-1 gap-3.5 @lg:grid-cols-2">
          <Field label={tx(COPY.fields.date)} htmlFor="qw-date" error={errors.date}>
            <DatePicker
              id="qw-date"
              locale={locale}
              value={state.date}
              min={todayISO}
              placeholder={tx(COPY.pickDate)}
              error={errors.date}
              onChange={(v) => patch({ date: v })}
            />
          </Field>
          <Field label={tx(COPY.fields.time)} htmlFor="qw-time" error={errors.time}>
            <TimePicker
              id="qw-time"
              locale={locale}
              value={state.time}
              placeholder={tx(COPY.pickTime)}
              error={errors.time}
              onChange={(v) => patch({ time: v })}
            />
          </Field>
          <Field
            label={tx(
              returnRequired ? COPY.fields.returnDate : COPY.fields.returnDateOptional,
            )}
            htmlFor="qw-return"
            error={errors.returnDate}
          >
            <DatePicker
              id="qw-return"
              locale={locale}
              value={state.returnDate}
              min={state.date || todayISO}
              placeholder={tx(COPY.pickDate)}
              error={errors.returnDate}
              onChange={(v) => patch({ returnDate: v })}
            />
          </Field>
          {state.service !== "umrah" ? (
            <Field label={tx(COPY.fields.waiting)} htmlFor="qw-waiting">
              <NumberStepper
                id="qw-waiting"
                locale={locale}
                min={0}
                max={168}
                placeholder="0"
                value={state.waitingHours}
                onChange={(v) => patch({ waitingHours: v })}
              />
            </Field>
          ) : null}
        </div>
      )
    }
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
          <Field
            label={tx(COPY.fields.accessibility)}
            htmlFor="qw-access"
            className="@lg:col-span-2"
          >
            <input
              id="qw-access"
              name="access"
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
            <NumberStepper
              id="qw-buses"
              locale={locale}
              min={1}
              max={50}
              error={errors.busCount}
              value={state.busCount}
              onChange={(v) => patch({ busCount: v })}
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
          <div className="grid grid-cols-1 gap-2.5 @lg:grid-cols-2">
            {extraOptions.map((o) => (
              <label
                key={o.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface-muted px-3.5 py-3 text-sm text-ink/80"
              >
                <input
                  type="checkbox"
                  name={`extra-${o.id}`}
                  className="qw-check"
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
