import { z } from "zod"

export const tripTypes = [
  "individual",
  "group",
  "corporate",
  "school",
  "hajj_mission",
  "tourism",
] as const

export type TripType = (typeof tripTypes)[number]

export const busClasses = ["standard", "vip", "city", "coach", "employee"] as const

export const quoteRequestSchema = z.object({
  tripType: z.enum(tripTypes),
  customerName: z.string().trim().min(2).max(120),
  organization: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(8).max(40),
  pickup: z.string().trim().min(2).max(120),
  destination: z.string().trim().min(2).max(120),
  date: z.string().trim().min(1).max(40),
  returnDate: z.string().trim().max(40).optional().default(""),
  passengers: z.coerce.number().int().min(1).max(500),
  busClass: z.enum(busClasses).optional().default("standard"),
  serviceType: z.string().trim().max(80).optional().default(""),
  accessibilityNeeds: z.string().trim().max(300).optional().default(""),
  luggageNotes: z.string().trim().max(300).optional().default(""),
  specialRequirements: z.string().trim().max(500).optional().default(""),
  consent: z.boolean().refine((v) => v === true, { message: "consent required" }),
  language: z.enum(["ar", "en"]).optional().default("en"),
  /** Honeypot — must stay empty */
  companyWebsite: z.string().optional().default(""),
})

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>
