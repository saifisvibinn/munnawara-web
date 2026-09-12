import { z } from "zod"

export const tripTypes = ["individual", "group", "corporate"] as const

export type TripType = (typeof tripTypes)[number]

export const quoteRequestSchema = z.object({
  tripType: z.enum(tripTypes),
  pickup: z.string().trim().min(2).max(120),
  destination: z.string().trim().min(2).max(120),
  date: z.string().trim().min(1).max(40),
  passengers: z.coerce.number().int().min(1).max(500),
  phone: z.string().trim().min(8).max(40),
  /** Honeypot — must stay empty */
  companyWebsite: z.string().optional().default(""),
})

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>
