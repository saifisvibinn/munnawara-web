import type { HomeContent } from "../types"

export const home: HomeContent = {
  valueTitle: "Transport built for sacred journeys",
  valueIntro:
    "Durrah Al-Munawwara Group coordinates modern coaches, careful operations, and clear communication so pilgrims and institutions travel with confidence.",
  valueImage: "/fleet/premium-vip-2026/exterior/pv-out-1.webp",
  valueBullets: [
    {
      id: "safety",
      title: "Safety first",
      description: "Disciplined operations and trained drivers for every assignment.",
    },
    {
      id: "licensed",
      title: "Licensed group",
      description: "Organized subsidiaries under one accountable brand.",
    },
    {
      id: "fleet",
      title: "Modern fleet",
      description: "Current-model coaches across VIP and group categories.",
    },
    {
      id: "tracked",
      title: "Journey clarity",
      description: "Clear coordination from quote to confirmed trip.",
    },
  ],
  passbyEyebrow: "Durrah Al-Munawwara",
  passbyTitle: "every journey, carefully arranged",
  passbyTitleAfter: "from quote to confirmed departure",
  howTitle: "How it works",
  howSubtitle: "Three clear steps from request to confirmed transport.",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "Request your trip",
      description:
        "Share trip type, cities, dates, and passenger count through the quote form or WhatsApp.",
      ctaLabel: "Request a quote",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "Get a confirmed quote and itinerary",
      description:
        "Our team prepares a clear plan for fleet, timing, and supporting services.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "Trip confirmed — driver and bus assigned",
      description:
        "Once approved, we assign the vehicle and keep coordination open through departure.",
      ctaLabel: "Contact us",
      ctaHref: "/contact",
    },
  ],
  aboutEyebrow: "About the group",
  aboutCta: "Read our story",
  aboutImage: "/fleet/coach-2025-2026/cover.webp",
  testimonialsTitle: "What partners say",
  // TODO(content): replace once client provides approved testimonials
  testimonialsEmpty: "Client testimonials will appear here once approved for publication.",
  newsTitle: "Updates",
  newsSubtitle: "Seasonal notes and group announcements.",
  newsEmpty: "No news posts yet — check back soon.",
  faqTitle: "Frequently asked questions",
  faqSubtitle: "Quick answers for groups and institutions planning transport.",
}
