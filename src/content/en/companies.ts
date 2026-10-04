import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "Durrah Al-Munawwara Transport for Pilgrims",
    summary:
      "A modern fleet for Hajj and Umrah pilgrims, staff, and students, including airport reception, intercity transport, Holy Sites journeys, and international routes to Yemen (Marib, Mukalla, Aden). Hajj-season pilgrim transport is contracted via the responsible mission and the electronic path.",
    services: [
      "Airport reception",
      "Intercity transport",
      "Holy Sites journey",
      "International transport (Yemen: Marib, Mukalla, Aden)",
      "Staff and student transport",
      "Hajj mission contracting via electronic path",
    ],
    logo: "/brand/company-group.png",
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
    logo: "/brand/company-umrah.png",
    heroImage: "/hero/cover.png",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "Durrah Al-Munawwara Tourism Services",
    summary:
      "Group tourism, conferences, events, and private hire, with reception plans, spare buses, and VIP airport options by capacity.",
    services: [
      "Tourist group transport",
      "Conferences and events",
      "Private occasions and weddings",
      "VIP airport transfers",
      "Multi-bus event fleets",
    ],
    logo: "/brand/company-tourism.png",
    heroImage: "/hero/cover.png",
    contentReady: true,
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
    logo: "/brand/company-hospitality.png",
    heroImage: "/fleet/premium-vip-2026/exterior/pv-col.webp",
    contentReady: true,
  },
] as const
