import type { ClientCategory } from "../types"

// Category-level only until client permits named logos
export const clients: readonly ClientCategory[] = [
  {
    id: "hajj-umrah-operators",
    label: "Hajj & Umrah campaign operators",
    description: "Transport and operational support for groups and campaigns.",
  },
  {
    id: "corporate",
    label: "Corporate & institutions",
    description: "Staff, school, and workforce transport.",
  },
  {
    id: "government",
    label: "Government & diplomatic",
    description: "Formal transport arrangements on request.",
  },
] as const
