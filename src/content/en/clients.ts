import type { ClientCategory } from "../types"

/** Sector groupings that match who appears on the official client logo wall. */
export const clients: readonly ClientCategory[] = [
  {
    id: "hajj-umrah-operators",
    label: "Hajj & Umrah operators",
    description:
      "Campaigns and Umrah companies across the Kingdom and international markets.",
  },
  {
    id: "corporate",
    label: "Corporate & institutions",
    description: "Staff, school, workforce, and private-sector transport partners.",
  },
  {
    id: "government",
    label: "Government & education",
    description:
      "Formal transport arrangements including Ministry of Education programs and institutional assignments.",
  },
] as const
