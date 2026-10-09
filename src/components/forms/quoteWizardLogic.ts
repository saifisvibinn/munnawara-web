import {
  allHubStops,
  busClassOptions,
  customerOptions,
  corporateServices,
  findOption,
  placeLabel,
  placeStop,
  type L10n,
  type MapStop,
} from "./quoteWizardConfig"
import { COPY } from "./quoteWizardCopy"
import type { StepId, Trip, WizardState } from "./quoteWizardTypes"

export type Tx = (text: L10n) => string
export type MapView = { stops: MapStop[]; context: MapStop[] }
export type SummaryRow = { id: StepId; label: L10n; value: string }

export function computeSteps(customer: string): StepId[] {
  return [
    "customer",
    ...(customer === "company" ? (["service"] as const) : []),
    "route",
    "vehicle",
    "passengers",
    "contact",
    "review",
  ]
}

export function getTodayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** Places of every trip in order, skipping a repeat when one trip ends where the next starts. */
export function getRouteStops(state: WizardState): MapStop[] {
  const stops: MapStop[] = []
  for (const t of state.trips) {
    for (const id of [t.from, t.to]) {
      const s = placeStop(id)
      if (s && stops[stops.length - 1]?.id !== s.id) stops.push(s)
    }
  }
  return stops
}

/** Route drawn on the map, plus faint hub markers until a route exists. */
export function getMapView(state: WizardState): MapView {
  const stops = getRouteStops(state)
  return {
    stops,
    context: stops.length < 2 ? allHubStops().filter((h) => !stops.some((s) => s.id === h.id)) : [],
  }
}

export function getServiceType(state: WizardState): string {
  return state.customer === "company" && state.service ? `company_${state.service}` : "charter"
}

const localeTag = (locale: string) => (locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB")

export function fmtDate(iso: string, locale: string, short = false): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return new Intl.DateTimeFormat(
    localeTag(locale),
    short
      ? { day: "numeric", month: "short" }
      : { weekday: "short", day: "numeric", month: "short", year: "numeric" },
  ).format(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
}

export function fmtTime(hhmm: string, locale: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
  if (!m) return hhmm
  return new Intl.DateTimeFormat(localeTag(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2000, 0, 1, Number(m[1]), Number(m[2])))
}

/** "From → To · date · time", skipping whatever is not chosen yet. */
export function tripLine(t: Trip, locale: string, short = false): string {
  const arrow = locale === "ar" ? " ← " : " → "
  const route = t.from && t.to ? `${placeLabel(t.from, locale)}${arrow}${placeLabel(t.to, locale)}` : ""
  return [route, t.date && fmtDate(t.date, locale, short), t.time && fmtTime(t.time, locale)]
    .filter(Boolean)
    .join(" · ")
}

export function validateStep(
  id: StepId,
  state: WizardState,
  tx: Tx,
  needsOrg: boolean,
): Record<string, string> {
  const e: Record<string, string> = {}
  switch (id) {
    case "customer":
      if (!state.customer) e.choice = tx(COPY.errors.choose)
      break
    case "service":
      if (!state.service) e.choice = tx(COPY.errors.choose)
      break
    case "route":
      state.trips.forEach((t, i) => {
        if (!t.from) e[`from${i}`] = tx(COPY.errors.place)
        if (!t.to) e[`to${i}`] = tx(COPY.errors.place)
        else if (t.from === t.to) e[`to${i}`] = tx(COPY.errors.samePlace)
        if (!t.date) e[`date${i}`] = tx(COPY.errors.date)
        if (!t.time) e[`time${i}`] = tx(COPY.errors.time)
      })
      break
    case "passengers":
      if (!Number(state.passengers) || Number(state.passengers) < 1) {
        e.passengers = tx(COPY.errors.passengers)
      }
      break
    case "vehicle":
      if (!Object.values(state.busCounts).some((count) => Number(count) > 0)) {
        e.choice = tx(COPY.errors.buses)
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

/** The first trip fills the quote's pickup/date fields; later trips travel in `stops` as plain text. */
export function buildQuotePayload(
  state: WizardState,
  serviceType: string,
  isAr: boolean,
  honeypot: string,
) {
  const [first, ...more] = state.trips
  const busMix = busClassOptions.flatMap((option) => {
    const count = Number(state.busCounts[option.id] ?? 0)
    return count > 0 ? [{ busClass: option.id, count }] : []
  })
  return {
    tripType: state.customer || undefined,
    serviceType,
    customerName: state.name,
    organization: state.organization,
    email: state.email,
    phone: state.phone,
    pickup: placeLabel(first.from, "en"),
    destination: placeLabel(first.to, "en"),
    stops: more
      .map((t, i) => `Trip ${i + 2}: ${placeLabel(t.from, "en")} → ${placeLabel(t.to, "en")} · ${t.date} ${t.time}`)
      .join("; "),
    date: first.date,
    departureTime: first.time,
    passengers: Number(state.passengers),
    busCount: busMix.reduce((total, bus) => total + bus.count, 0),
    busClass: busMix[0]?.busClass ?? "standard",
    busMix,
    accessibilityNeeds: state.accessibility,
    luggageNotes: state.luggage,
    specialRequirements: state.notes,
    consent: state.consent,
    language: isAr ? ("ar" as const) : ("en" as const),
    companyWebsite: honeypot,
  }
}

export function buildSummaryRows(state: WizardState, locale: string, tx: Tx): SummaryRow[] {
  const customer = findOption(customerOptions, state.customer)
  const service = findOption(corporateServices, state.service)
  const multi = state.trips.length > 1
  const buses = busClassOptions.flatMap((option) => {
    const count = Number(state.busCounts[option.id] ?? 0)
    return count > 0 ? [`${count} × ${tx(option.label)}`] : []
  })
  const rows: SummaryRow[] = [
    { id: "customer", label: COPY.summary.who, value: customer ? tx(customer.label) : "" },
    ...(state.customer === "company"
      ? [{ id: "service" as const, label: COPY.summary.service, value: service ? tx(service.label) : "" }]
      : []),
    ...state.trips.map((t, i) => ({
      id: "route" as const,
      label: multi ? COPY.trip(i + 1) : COPY.summary.route,
      value: tripLine(t, locale),
    })),
    {
      id: "vehicle",
      label: COPY.summary.vehicle,
      value: buses.join(", "),
    },
    { id: "passengers", label: COPY.summary.passengers, value: state.passengers },
    {
      id: "contact",
      label: COPY.summary.contact,
      value: [state.name, state.organization, state.phone].filter(Boolean).join(" · "),
    },
  ]
  return rows.filter((r) => r.value)
}
