"use server"

import {
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/components/forms/formSchemas"
import { DEFAULT_CHAT_API_URL } from "@/lib/chat/upstream"

export type QuoteActionState = {
  ok: boolean
  messageKey: "success" | "error"
  leadId?: string
  quoteSlaHours?: number
  /** Lets the same browser edit the request until staff start on it. */
  edit?: { quoteId: string; editToken: string }
}

export type QuoteEditState = {
  ok: boolean
  messageKey: "success" | "error" | "locked"
  leadId?: string
}

const BACKEND_TIMEOUT_MS = 15_000
const EMAIL_TIMEOUT_MS = 10_000
const DEFAULT_EMAIL_FROM = "Durrat Almunawwara Co. Website <onboarding@resend.dev>"

/** Collapse CR/LF so user text cannot inject headers into an email subject. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim()

function backendBaseUrl() {
  return (
    process.env.CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    process.env.QUOTE_API_URL ||
    DEFAULT_CHAT_API_URL
  ).replace(/\/$/, "")
}

type QuoteData = ReturnType<typeof quoteRequestSchema.parse>

/** Shapes validated wizard data into the backend's create/edit payload. */
function buildBackendQuote(data: QuoteData) {
  const buses = data.busMix.length
    ? data.busMix
    : [{ busClass: data.busClass, count: data.busCount }]
  const totalBusCount = buses.reduce((total, bus) => total + bus.count, 0)
  const primaryBusClass = buses[0]?.busClass ?? data.busClass
  const busMixNote = buses
    .map(({ busClass, count }) => `${count} × ${busClass}`)
    .join(", ")

  // The sales backend only knows the original five classes; preserve newer
  // classes and the full mix in the request notes.
  const backendBusClass =
    { premium_vip: "vip", city_large: "city" }[primaryBusClass as string] ?? primaryBusClass
  const busClassNote =
    backendBusClass !== primaryBusClass
      ? `Bus class requested: ${primaryBusClass}`
      : ""

  const extras = [
    data.needsSupervisors ? "Supervisors" : "",
    data.needsTracking ? "Tracking" : "",
    data.needsBranding ? "Bus branding" : "",
    data.needsAirportReception ? "Airport reception" : "",
    busMixNote ? `Bus mix: ${busMixNote}` : "",
    data.specialRequirements,
  ]
    .filter(Boolean)
    .join("; ")

  const body = {
    customerName: data.customerName,
    customerContact: data.phone,
    customerPhone: data.phone,
    customerEmail: data.email || undefined,
    email: data.email || undefined,
    pickup: data.pickup,
    dropoff: data.destination,
    date: data.date,
    returnDatetime: data.returnDate || undefined,
    vehicleType: backendBusClass || "standard",
    busClass: backendBusClass || "standard",
    passengers: data.passengers,
    busCount: totalBusCount || 1,
    channel: "web",
    language: data.language,
    customerType: data.tripType,
    tripType: data.serviceType || data.tripType,
    organization: data.organization || undefined,
    serviceType: data.serviceType || data.tripType,
    originCity: data.pickup,
    destinationCity: data.destination,
    stops: data.stops || undefined,
    departureTime: data.departureTime || undefined,
    waitingHours: data.waitingHours ?? undefined,
    accessibilityNeeds: data.accessibilityNeeds || undefined,
    luggageNotes: data.luggageNotes || undefined,
    specialRequirements: extras || undefined,
    needsSupervisors: data.needsSupervisors,
    needsTracking: data.needsTracking,
    needsBranding: data.needsBranding,
    needsAirportReception: data.needsAirportReception,
    preferredContactChannel: "whatsapp",
    consent: data.consent,
    notes: [
      busClassNote,
      data.serviceType ? `Service: ${data.serviceType}` : "",
      data.stops ? `Stops: ${data.stops}` : "",
      data.departureTime ? `Time: ${data.departureTime}` : "",
      data.waitingHours != null
        ? `Waiting hours: ${data.waitingHours}`
        : "",
      extras ? `Requirements: ${extras}` : "",
      data.accessibilityNeeds
        ? `Accessibility: ${data.accessibilityNeeds}`
        : "",
      data.luggageNotes ? `Luggage: ${data.luggageNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }

  return { body, extras, busMixNote, totalBusCount }
}

async function emailInbox(
  data: QuoteData,
  leadId: string | undefined,
  summary: { extras: string; busMixNote: string; totalBusCount: number },
  edited = false,
) {
  const apiKey = process.env.RESEND_API_KEY
  const inbox = process.env.CONTACT_INBOX_EMAIL
  if (!apiKey || !inbox) return
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_EMAIL_FROM,
        to: [inbox],
        subject: singleLine(
          `[Quote ${leadId || ""}${edited ? " edited" : ""}] ${data.tripType}: ${data.pickup} → ${data.destination}`,
        ),
        text: [
          edited ? "The customer edited this request from the website." : "",
          `Lead: ${leadId || "-"}`,
          `Name: ${data.customerName}`,
          `Org: ${data.organization || "-"}`,
          `Type: ${data.tripType}`,
          `Pickup: ${data.pickup}`,
          `Destination: ${data.destination}`,
          `Stops: ${data.stops || "-"}`,
          `Date: ${data.date} ${data.departureTime || ""}`,
          `Return: ${data.returnDate || "-"}`,
          `Passengers: ${data.passengers}`,
          `Buses: ${summary.totalBusCount} total (${summary.busMixNote})`,
          `Phone: ${data.phone}`,
          `Requirements: ${summary.extras || "-"}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    })
  } catch (error) {
    console.error("[quote] Resend side-channel failed", error)
  }
}

export const submitQuoteRequest = async (
  raw: QuoteRequestInput,
): Promise<QuoteActionState> => {
  const parsed = quoteRequestSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, messageKey: "error" }
  }

  if (parsed.data.companyWebsite) {
    return { ok: true, messageKey: "success", leadId: "DM-PREVIEW" }
  }

  const data = parsed.data
  const base = backendBaseUrl()
  const { body, ...summary } = buildBackendQuote(data)
  let leadId: string | undefined
  let quoteSlaHours = 24
  let edit: QuoteActionState["edit"]

  if (base) {
    try {
      const response = await fetch(`${base}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        console.error("[quote] backend failed", await response.text())
        return { ok: false, messageKey: "error" }
      }

      const created = (await response.json()) as {
        leadId?: string
        quoteSlaHours?: number
        editToken?: string
        quote?: { _id?: string; leadId?: string }
      }
      leadId = created.leadId || created.quote?.leadId
      if (created.quoteSlaHours) quoteSlaHours = created.quoteSlaHours
      if (created.quote?._id && created.editToken) {
        edit = { quoteId: String(created.quote._id), editToken: created.editToken }
      }
    } catch (error) {
      console.error("[quote] backend submit failed", error)
      return { ok: false, messageKey: "error" }
    }
  } else {
    leadId = `DM-LOCAL-${Date.now().toString(36).toUpperCase()}`
    console.info("[quote] preview submission (no CHAT_API_URL)", {
      leadId,
      tripType: data.tripType,
      pickup: data.pickup,
      destination: data.destination,
    })
  }

  await emailInbox(data, leadId, summary)

  return {
    ok: true,
    messageKey: "success",
    leadId,
    quoteSlaHours,
    edit,
  }
}

const QUOTE_ID_RE = /^[a-f0-9]{24}$/i
const EDIT_TOKEN_RE = /^[a-f0-9]{16,128}$/i

/**
 * Replaces a request the customer sent earlier. The backend only accepts it
 * while the quote is still "new"; after that it answers 409 ("locked").
 */
export const updateQuoteRequest = async (
  edit: { quoteId: string; editToken: string },
  raw: QuoteRequestInput,
): Promise<QuoteEditState> => {
  const parsed = quoteRequestSchema.safeParse(raw)
  const base = backendBaseUrl()
  if (
    !parsed.success ||
    parsed.data.companyWebsite ||
    !base ||
    !QUOTE_ID_RE.test(edit?.quoteId ?? "") ||
    !EDIT_TOKEN_RE.test(edit?.editToken ?? "")
  ) {
    return { ok: false, messageKey: "error" }
  }

  const data = parsed.data
  const { body, ...summary } = buildBackendQuote(data)
  try {
    const response = await fetch(`${base}/quotes/${edit.quoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-edit-token": edit.editToken },
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      body: JSON.stringify(body),
    })
    if (response.status === 409) return { ok: false, messageKey: "locked" }
    if (!response.ok) {
      console.error("[quote] backend edit failed", response.status, await response.text())
      return { ok: false, messageKey: "error" }
    }
    const updated = (await response.json()) as { leadId?: string; quote?: { leadId?: string } }
    const leadId = updated.leadId || updated.quote?.leadId
    await emailInbox(data, leadId, summary, true)
    return { ok: true, messageKey: "success", leadId }
  } catch (error) {
    console.error("[quote] backend edit failed", error)
    return { ok: false, messageKey: "error" }
  }
}
