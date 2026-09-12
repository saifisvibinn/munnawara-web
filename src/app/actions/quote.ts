"use server"

import {
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/components/forms/formSchemas"

export type QuoteActionState = {
  ok: boolean
  messageKey: "success" | "error"
}

export const submitQuoteRequest = async (
  raw: QuoteRequestInput,
): Promise<QuoteActionState> => {
  const parsed = quoteRequestSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, messageKey: "error" }
  }

  // Spam honeypot filled
  if (parsed.data.companyWebsite) {
    return { ok: true, messageKey: "success" }
  }

  const apiKey = process.env.RESEND_API_KEY
  const inbox = process.env.CONTACT_INBOX_EMAIL

  // TODO(M5): send via Resend when RESEND_API_KEY + CONTACT_INBOX_EMAIL are set
  if (!apiKey || !inbox) {
    console.info("[quote] preview submission (Resend not configured)", {
      tripType: parsed.data.tripType,
      pickup: parsed.data.pickup,
      destination: parsed.data.destination,
      date: parsed.data.date,
      passengers: parsed.data.passengers,
      phone: parsed.data.phone,
    })
    return { ok: true, messageKey: "success" }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DMTC Website <onboarding@resend.dev>",
        to: [inbox],
        subject: `[Quote] ${parsed.data.tripType} — ${parsed.data.pickup} → ${parsed.data.destination}`,
        text: [
          `Trip type: ${parsed.data.tripType}`,
          `Pickup: ${parsed.data.pickup}`,
          `Destination: ${parsed.data.destination}`,
          `Date: ${parsed.data.date}`,
          `Passengers: ${parsed.data.passengers}`,
          `Phone: ${parsed.data.phone}`,
        ].join("\n"),
      }),
    })

    if (!response.ok) {
      console.error("[quote] Resend failed", await response.text())
      return { ok: false, messageKey: "error" }
    }

    return { ok: true, messageKey: "success" }
  } catch (error) {
    console.error("[quote] submit failed", error)
    return { ok: false, messageKey: "error" }
  }
}
