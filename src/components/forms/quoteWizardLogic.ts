import {
  allHubStops,
  buildDawraStops,
  buildTransferStops,
  busClassOptions,
  customerOptions,
  dawraLengths,
  extraOptions,
  findOption,
  pick,
  placeLabel,
  tripDirections,
  umrahKinds,
  umrahService,
  ziyaratOptions,
  type L10n,
  type MapStop,
  type Option,
  type PlaceId,
} from "./quoteWizardConfig"
import { COPY } from "./quoteWizardCopy"
import type { StepId, WizardState } from "./quoteWizardTypes"

export type Tx = (text: L10n) => string
export type MapView = { stops: MapStop[]; context: MapStop[] }
export type SummaryRow = { id: StepId; label: L10n; value: string }

export function computeSteps(service: string, umrahKind: string): StepId[] {
  const list: StepId[] = ["customer", "service"]
  if (service === "umrah") {
    list.push("umrahKind")
    if (umrahKind === "dawra") list.push("dawraLength", "dawraRoute")
    else if (umrahKind === "maktaa") list.push("maktaaRoute")
  } else if (service) {
    list.push("charterRoute")
  }
  list.push("when", "passengers", "vehicle", "extras", "contact", "review")
  return list
}

export function getTodayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** Stops drawn on the map for the current step, plus faint context markers. */
export function getMapView(step: StepId, state: WizardState): MapView {
  const isLongDawra = state.dawraLength === "long"
  if (step === "dawraLength") {
    return { stops: buildDawraStops(state.arrival, state.departure, [], false), context: [] }
  }
  if (step === "dawraRoute") {
    const stops = buildDawraStops(state.arrival, state.departure, state.mazarat, isLongDawra)
    const context: MapStop[] = isLongDawra
      ? ziyaratOptions
          .filter((z) => !state.mazarat.includes(z.id))
          .map((z) => ({ id: z.id, lat: z.lat, lng: z.lng, label: z.label, kind: "ziyarat" as const }))
      : []
    return { stops, context }
  }
  if (step === "maktaaRoute") {
    const chosen = [state.from, state.to].filter(Boolean) as PlaceId[]
    return {
      stops: buildTransferStops(chosen),
      context: chosen.length < 2 ? allHubStops().filter((h) => !chosen.includes(h.id as PlaceId)) : [],
    }
  }
  const laterSteps: readonly StepId[] = ["when", "passengers", "vehicle", "extras", "contact", "review"]
  if (laterSteps.includes(step)) {
    const finalRoute = getFinalStops(state)
    if (finalRoute.length > 1) return { stops: finalRoute, context: [] }
  }
  return { stops: [], context: allHubStops() }
}

/** Final route for the confirmation map. */
export function getFinalStops(state: WizardState): MapStop[] {
  const isLongDawra = state.dawraLength === "long"
  if (state.umrahKind === "dawra") {
    return buildDawraStops(state.arrival, state.departure, state.mazarat, isLongDawra)
  }
  if (state.umrahKind === "maktaa" && state.from && state.to) {
    return buildTransferStops([state.from, state.to])
  }
  return []
}

export function getServiceType(state: WizardState, isCompany: boolean): string {
  return state.service === "umrah"
    ? state.umrahKind === "dawra"
      ? `umrah_dawra_${state.dawraLength || "short"}`
      : `umrah_maktaa_${state.direction}`
    : isCompany && state.service
      ? `company_${state.service}`
      : "charter"
}

export function getServiceLabel(
  state: WizardState,
  serviceOptions: readonly Option[],
  tx: Tx,
): string {
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
export function getRouteParts(state: WizardState, loc: string) {
  const isLongDawra = state.dawraLength === "long"
  if (state.service === "umrah" && state.umrahKind === "dawra") {
    const mid = buildDawraStops(state.arrival, state.departure, state.mazarat, isLongDawra)
      .slice(1, -1)
      .map((s) => pick(s.label, loc))
    return {
      pickup: placeLabel(state.arrival, loc),
      destination: placeLabel(state.departure, loc),
      stops: mid.join(loc === "ar" ? " ← " : " → "),
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

export function validateStep(
  id: StepId,
  state: WizardState,
  tx: Tx,
  needsOrg: boolean,
): Record<string, string> {
  const twoWay = state.direction === "twoway"
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

export function buildQuotePayload(
  state: WizardState,
  serviceType: string,
  isAr: boolean,
  honeypot: string,
) {
  const route = getRouteParts(state, "en")
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

export function buildSummaryRows(
  state: WizardState,
  locale: string,
  serviceOptions: readonly Option[],
  tx: Tx,
): SummaryRow[] {
  const route = getRouteParts(state, locale)
  const customer = findOption(customerOptions, state.customer)
  const tag = locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB"
  const fmtDate = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
    if (!m) return iso
    return new Intl.DateTimeFormat(tag, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  }
  const fmtTime = (hhmm: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
    if (!m) return hhmm
    return new Intl.DateTimeFormat(tag, { hour: "numeric", minute: "2-digit", hour12: true }).format(
      new Date(2000, 0, 1, Number(m[1]), Number(m[2])),
    )
  }
  const dateLine = [state.date ? fmtDate(state.date) : "", state.time ? fmtTime(state.time) : ""]
    .filter(Boolean)
    .join(" · ")
  const arrow = locale === "ar" ? " ← " : " → "
  const when = state.returnDate ? `${dateLine}${arrow}${fmtDate(state.returnDate)}` : dateLine
  const extras = [
    ...extraOptions.filter((o) => state.extras[o.id]).map((o) => tx(o.label)),
  ]
  const routeText = [route.pickup, route.stops, route.destination]
    .filter(Boolean)
    .join(arrow)
  const rows: SummaryRow[] = [
    { id: "customer", label: COPY.summary.who, value: customer ? tx(customer.label) : "" },
    { id: "service", label: COPY.summary.service, value: getServiceLabel(state, serviceOptions, tx) },
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
