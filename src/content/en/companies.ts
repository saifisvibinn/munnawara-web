import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "Durrat Almunawwara Transport for Pilgrims",
    summary:
      "Serving the guests of Allah is our top priority. We provide integrated land transport for pilgrims, students, and institutions, airport and port reception, prayer shuttles, Holy Sites journeys, and staff routes, with a modern fleet and high operating standards. Hajj-season pilgrim transport is contracted via the responsible mission and the electronic path.",
    services: [
      "Airport & port reception from King Abdulaziz Airport in Jeddah and Prince Mohammad bin Abdulaziz Airport in Madinah",
      "Prayer shuttles to the Two Holy Mosques around the clock",
      "Ziyarah and historical tours in Makkah and Madinah",
      "Holy Sites shuttles between Arafat, Muzdalifah, and Mina",
      "Intercity transport and international routes to Yemen (Marib, Mukalla, Aden)",
      "Reliable partner to the Ministry of Education, schools, and universities, seat belts, live GPS tracking, and qualified drivers",
      "Corporate and employee transport with flexible shift schedules, fleet sized to the team, and coverage of industrial cities and remote residential complexes",
      "Hajj mission contracting via the electronic path",
    ],
    logo: "/brand/company-group.png",
    heroImage: "/fleet/coach-2025-2026/side.webp",
    contentReady: true,
  },
  {
    slug: "umrah-services",
    name: "Durrat Almunawwara Umrah Services",
    summary:
      "Comprehensive Umrah support that brings visas, hotel booking, and premium transport together so groups move through a clear, coordinated journey.",
    services: [
      "Umrah visa issuance support",
      "Hotel and accommodation booking",
      "Premium transport and logistics for Umrah programs",
      "Group program coordination with transport and hospitality",
    ],
    logo: "/brand/company-umrah.png",
    heroImage: "/fleet/vip-2026/side.webp",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "Durrat Almunawwara Tourism Services",
    summary:
      "Group tourism, conferences, events, and luxury VIP transport for elite clients, diplomatic delegations, and business executives, with privacy, spare capacity, and clear reception plans.",
    services: [
      "Tourist group transport",
      "Conferences and events",
      "Private occasions and weddings",
      "Luxury and VIP transport with premium comfort features",
      "VIP airport transfers",
      "Multi-bus event fleets",
    ],
    logo: "/brand/company-tourism.png",
    heroImage: "/fleet/vip-2026/front.webp",
    contentReady: true,
  },
  {
    slug: "hospitality-catering",
    name: "Durrat Almunawwara Hospitality & Catering",
    summary:
      "Hospitality and catering support for Hajj and Umrah programs and institutional events.",
    services: [
      "Group catering",
      "Field hospitality",
      "Hajj and Umrah program support",
    ],
    logo: "/brand/company-hospitality.png",
    heroImage: "/fleet/vip-2026/interior.webp",
    contentReady: true,
  },
] as const
