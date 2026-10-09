import type { ReactNode } from "react"
import type { BusClass, TripType } from "@/components/forms/formSchemas"

export type WizardProps = {
  className?: string
  formId?: string
  /** "split" = form panel + summary/map sidebar that fits the viewport (used by /quote). */
  layout?: "stack" | "split"
  /** Page title shown above the form in split layout. */
  heading?: { eyebrow?: string; title: string }
  /** Optional chrome beside the title (e.g. back link). */
  toolbar?: ReactNode
}

export type StepId =
  | "customer"
  | "service"
  | "route"
  | "vehicle"
  | "passengers"
  | "contact"
  | "review"

export type Trip = { from: string; to: string; date: string; time: string }

export const emptyTrip: Trip = { from: "", to: "", date: "", time: "" }

export const MAX_TRIPS = 5

export type WizardState = {
  customer: TripType | ""
  service: string
  trips: Trip[]
  passengers: string
  luggage: string
  accessibility: string
  busCounts: Partial<Record<BusClass, string>>
  notes: string
  name: string
  organization: string
  phone: string
  email: string
  consent: boolean
}

export const initialState: WizardState = {
  customer: "",
  service: "",
  trips: [emptyTrip],
  passengers: "1",
  luggage: "",
  accessibility: "",
  busCounts: { standard: "1" },
  notes: "",
  name: "",
  organization: "",
  phone: "",
  email: "",
  consent: false,
}
