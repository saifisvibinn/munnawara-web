import type { ReactNode } from "react"
import type { BusClass, TripType } from "@/components/forms/formSchemas"
import type { ExtraId, PlaceId } from "./quoteWizardConfig"

export type WizardProps = {
  className?: string
  formId?: string
  /** "split" = map pane + form panel that fits the viewport (used by /quote). */
  layout?: "stack" | "split"
  /** Title chip drawn over the map in split layout. */
  heading?: { eyebrow?: string; title: string }
  /** Optional chrome above the step progress (e.g. back link). */
  toolbar?: ReactNode
}

export type StepId =
  | "customer"
  | "service"
  | "umrahKind"
  | "dawraLength"
  | "dawraRoute"
  | "maktaaRoute"
  | "charterRoute"
  | "when"
  | "passengers"
  | "vehicle"
  | "extras"
  | "contact"
  | "review"

export type WizardState = {
  customer: TripType | ""
  service: string
  umrahKind: string
  dawraLength: string
  mazarat: string[]
  direction: string
  from: PlaceId | ""
  to: PlaceId | ""
  arrival: PlaceId
  departure: PlaceId
  pickup: string
  destination: string
  stops: string
  date: string
  time: string
  returnDate: string
  waitingHours: string
  passengers: string
  luggage: string
  accessibility: string
  busCount: string
  busClass: BusClass
  extras: Record<ExtraId, boolean>
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
  umrahKind: "",
  dawraLength: "",
  mazarat: [],
  direction: "oneway",
  from: "",
  to: "",
  arrival: "jed_airport",
  departure: "med_airport",
  pickup: "",
  destination: "",
  stops: "",
  date: "",
  time: "",
  returnDate: "",
  waitingHours: "",
  passengers: "1",
  luggage: "",
  accessibility: "",
  busCount: "1",
  busClass: "standard",
  extras: {
    needsSupervisors: false,
    needsTracking: false,
    needsBranding: false,
    needsAirportReception: false,
  },
  notes: "",
  name: "",
  organization: "",
  phone: "",
  email: "",
  consent: false,
}
