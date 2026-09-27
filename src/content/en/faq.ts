import type { FaqItem } from "../types"

export const faq: readonly FaqItem[] = [
  {
    id: "hajj-contract",
    question: "How is Hajj transport booked?",
    answer:
      "During Hajj season, pilgrim transport is contracted through the responsible mission and registered on the electronic path — not as a direct pilgrim-to-company booking. Payment for those contracts goes through that path.",
  },
  {
    id: "yemen",
    question: "Do you operate international routes?",
    answer:
      "Yes. International services currently include Yemen destinations: Marib, Mukalla, and Aden. Share origin, date, and passenger count for availability.",
  },
  {
    id: "fleet-types",
    question: "Which bus types are available?",
    answer:
      "Catalog classes include coach, VIP, city, and employee buses in multiple capacities. Brochure seat counts may differ from operational assignment — we confirm the bus for your date in the offer.",
  },
  {
    id: "quote",
    question: "What do you need for a quote?",
    answer:
      "Name, contact, passenger count, origin and destination, date and time, bus class if known, and any accessibility or luggage notes. A request number is not a confirmed booking until an official offer is issued.",
  },
  {
    id: "baggage",
    question: "What is the baggage policy?",
    answer:
      "Allowance varies by route, ticket, and bus type. We confirm the current policy with your booking before payment — we do not invent fixed weights in chat.",
  },
  {
    id: "safety",
    question: "What safety standards do you follow?",
    answer:
      "Inspections, periodic maintenance, GPS tracking, driver monitoring, and emergency response procedures under regulatory requirements.",
  },
] as const
