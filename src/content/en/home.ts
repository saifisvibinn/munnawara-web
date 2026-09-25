import type { HomeContent } from "../types"

export const home: HomeContent = {
  landingHero: {
    eyebrow: "Durrah Al Munawwara Transportation",
    line1: "Moving you",
    line2: "forward",
    sub: "Premium journeys, thoughtfully driven across every mile.",
    cta: "Explore our services",
    brandWords: ["DURRAH", "AL", "MUNAWWARA", "TRANSPORTATION"],
    backTop: "DMTC — back to top",
    chatAria: "Chat with DMTC",
    chatWith: "Chat with",
    chatAi: "AI",
    brand: "DMTC",
  },
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
  howStepPrefix: "Step",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "Request your trip & expect a follow-up,",
      description:
        "Share trip type, cities, dates, and passenger count through the quote form or WhatsApp. Our team reviews the request and prepares clear options.",
      ctaLabel: "Request a quote",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "Choose the best option for your group.",
      description:
        "We send a confirmed quote and itinerary covering fleet, timing, and supporting services so you can decide with confidence.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "Trip confirmed.",
      description:
        "Once approved, we assign the vehicle and driver and keep coordination open through departure.",
      ctaLabel: "Contact us",
      ctaHref: "/contact",
    },
  ],
  aboutEyebrow: "About the group",
  aboutCta: "Read our story",
  aboutSecondaryCta: "Contact us",
  aboutSocialCta: "Follow @dmtcSA",
  aboutImage: "/hero/landing-sky.jpg",
  aboutHeadlineLines: [
    "Safe, comfortable journeys.",
    "Organized fleet. Clear standards.",
  ],
  quoteEyebrow: "Plan your trip",
  quoteHeadline: "Sit back. We'll coordinate the rest.",
  quoteBody:
    "Share trip type, cities, dates, and passenger count. Our team follows up with clear options.",
  testimonialsTitle: "Partners we serve",
  testimonialsSubtitle:
    "Organized transport for campaigns, institutions, and formal assignments.",
  testimonialsCta: "Contact us",
  // TODO(content): replace once client provides approved testimonials
  testimonialsEmpty: "Client testimonials will appear here once approved for publication.",
  newsTitle: "Read about the group",
  newsSubtitle:
    "Seasonal notes, fleet updates, and announcements from Durrah Al-Munawwara.",
  newsEmpty: "No news posts yet — check back soon.",
  faqTitle: "FAQs",
  faqSubtitle: "Answers to questions groups and institutions ask most often.",
  faqCta: "Contact us",
  ctaBandEyebrow: "Experience organized transport like never before",
  ctaBandTitle: "Sit back, we'll coordinate the rest.",
  ctaBandSubtitle:
    "Share your trip details and our team will follow up with clear options.",
}
