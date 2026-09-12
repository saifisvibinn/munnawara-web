import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "Durrah Al-Munawwara Transport for Pilgrims",
    summary:
      "A modern fleet for Hajj and Umrah pilgrims, staff, and students — including airport reception, intercity transport, and Holy Sites journeys.",
    services: [
      "Airport reception",
      "Intercity transport",
      "Holy Sites journey",
      "International transport",
      "Staff and student transport",
    ],
    heroImage: "/fleet/coach-2025-2026/cover.webp",
    contentReady: true,
  },
  {
    slug: "umrah-services",
    name: "Durrah Al-Munawwara Umrah Services",
    summary:
      "Supporting services for Umrah journeys, coordinated with transport and hospitality for group operators.",
    services: [
      "Umrah program coordination",
      "Group logistics support",
      "Hotel and transport coordination",
    ],
    heroImage: "/hero/cover.png",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "Durrah Al-Munawwara Tourism Services",
    // TODO(content): Tourism subsidiary — blocked until client provides real services copy
    summary: null,
    services: [],
    heroImage: "/hero/cover.png",
    contentReady: false,
  },
  {
    slug: "hospitality-catering",
    name: "Durrah Al-Munawwara Hospitality & Catering",
    summary:
      "Hospitality and catering support for Hajj and Umrah programs and institutional events.",
    services: [
      "Group catering",
      "Field hospitality",
      "Hajj and Umrah program support",
    ],
    heroImage: "/fleet/premium-vip-2026/exterior/pv-col.webp",
    contentReady: true,
  },
] as const
