"use server"

import { DEFAULT_CHAT_API_URL, serverChatApiUrl } from "@/lib/chat/upstream"

export type QuoteTracking = {
  leadId: string
  status: "new" | "quoted" | "won" | "lost"
  quotedPrice: number | null
  currency: string
  pickup: string
  dropoff: string
  date: string
  passengers: number | null
  busCount: number | null
  submittedAt: string
  updatedAt: string
  editable: boolean
}

export type TrackResult =
  | { ok: true; tracking: QuoteTracking }
  | { ok: false; reason: "invalid" | "not_found" | "rate_limited" | "error" }

const LEAD_ID_RE = /^DM-[A-Z0-9]{4,20}$/i
const TIMEOUT_MS = 10_000

function backendBaseUrl() {
  return serverChatApiUrl(process.env.QUOTE_API_URL || DEFAULT_CHAT_API_URL)
}

/** Looks up a request by its lead ID plus the phone number it was sent with. */
export const trackQuoteRequest = async (
  leadId: string,
  phone: string,
): Promise<TrackResult> => {
  const id = String(leadId ?? "").trim().toUpperCase()
  const tel = String(phone ?? "").trim()
  if (!LEAD_ID_RE.test(id) || tel.replace(/\D/g, "").length < 6 || tel.length > 40) {
    return { ok: false, reason: "invalid" }
  }
  const base = backendBaseUrl()
  if (!base) return { ok: false, reason: "error" }

  try {
    const query = new URLSearchParams({ leadId: id, phone: tel })
    const response = await fetch(`${base}/quotes/track?${query}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (response.status === 404 || response.status === 400) {
      return { ok: false, reason: "not_found" }
    }
    if (response.status === 429) return { ok: false, reason: "rate_limited" }
    if (!response.ok) {
      console.error("[track] backend failed", response.status)
      return { ok: false, reason: "error" }
    }
    const body = (await response.json()) as { tracking?: QuoteTracking }
    if (!body.tracking) return { ok: false, reason: "error" }
    return { ok: true, tracking: body.tracking }
  } catch (error) {
    console.error("[track] lookup failed", error)
    return { ok: false, reason: "error" }
  }
}
