"use server"

import {
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/components/forms/formSchemas"

export type QuoteActionState = {
  ok: boolean
  messageKey: "success" | "error"
}

function backendBaseUrl() {
  return (
    process.env.CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    process.env.QUOTE_API_URL ||
    ""
  ).replace(/\/$/, "")
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

  const data = parsed.data
  const base = backendBaseUrl()

  if (base) {
    try {
      const response = await fetch(`${base}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.customerName,
          customerContact: data.phone,
          customerPhone: data.phone,
          customerEmail: data.email || undefined,
          email: data.email || undefined,
          pickup: data.pickup,
          dropoff: data.destination,
          date: data.date,
          returnDatetime: data.returnDate || undefined,
          vehicleType: data.busClass || "standard",
          busClass: data.busClass || "standard",
          passengers: data.passengers,
          channel: "web",
          language: data.language,
          customerType: data.tripType,
          tripType: data.tripType,
          organization: data.organization || undefined,
          serviceType: data.serviceType || data.tripType,
          accessibilityNeeds: data.accessibilityNeeds || undefined,
          luggageNotes: data.luggageNotes || undefined,
          specialRequirements: data.specialRequirements || undefined,
          preferredContactChannel: "whatsapp",
          consent: data.consent,
          notes: [
            data.specialRequirements,
            data.accessibilityNeeds
              ? `Accessibility: ${data.accessibilityNeeds}`
              : "",
            data.luggageNotes ? `Luggage: ${data.luggageNotes}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      })

      if (!response.ok) {
        console.error("[quote] backend failed", await response.text())
        return { ok: false, messageKey: "error" }
      }
    } catch (error) {
      console.error("[quote] backend submit failed", error)
      return { ok: false, messageKey: "error" }
    }
  } else {
    console.info("[quote] preview submission (no CHAT_API_URL)", {
      tripType: data.tripType,
      pickup: data.pickup,
      destination: data.destination,
      date: data.date,
      passengers: data.passengers,
      phone: data.phone,
    })
  }

  // Optional email side-channel
  const apiKey = process.env.RESEND_API_KEY
  const inbox = process.env.CONTACT_INBOX_EMAIL
  if (apiKey && inbox) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DMTC Website <onboarding@resend.dev>",
          to: [inbox],
          subject: `[Quote] ${data.tripType} — ${data.pickup} → ${data.destination}`,
          text: [
            `Name: ${data.customerName}`,
            `Org: ${data.organization || "—"}`,
            `Trip type: ${data.tripType}`,
            `Pickup: ${data.pickup}`,
            `Destination: ${data.destination}`,
            `Date: ${data.date}`,
            `Return: ${data.returnDate || "—"}`,
            `Passengers: ${data.passengers}`,
            `Bus class: ${data.busClass}`,
            `Phone: ${data.phone}`,
            `Email: ${data.email || "—"}`,
            `Consent: ${data.consent}`,
          ].join("\n"),
        }),
      })
    } catch (error) {
      console.error("[quote] Resend side-channel failed", error)
    }
  }

  return { ok: true, messageKey: "success" }
}
