import type { HomeContent } from "../types"

export const home: HomeContent = {
  landingHero: {
    eyebrow: "Durrat Almunawwara Co.",
    lines: ["Moving", "with care", "for guests"],
    sub: "Integrated transport solutions for pilgrims and institutions, supported by a modern fleet and a complete operations network.",
    primaryCta: "Request transport",
    secondaryCta: "Explore our fleet",
    brandWords: ["Durrat", "Almunawwara", "Co."],
    backTop: "Durrat Almunawwara Co., back to top",
    chatAria: "Chat with Durrat Almunawwara Co.",
  },
  valueTitle: "Transport built for sacred journeys",
  valueIntro:
    "Durrat Almunawwara Co. coordinates modern coaches, careful operations, and clear communication so pilgrims and institutions travel with confidence.",
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
  passbyEyebrow: "Durrat Almunawwara Co.",
  passbyTitle: "you choose the destination",
  passbyTitleAfter: "we get you there safely",
  howTitle: "How it works",
  howSubtitle: "Three clear steps from request to confirmed transport.",
  howStepPrefix: "Step",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "Tell us about your trip… and we’ll take care of the rest",
      description:
        "Share the trip type, destination, date, and passenger count through the “Request a quote” form or via WhatsApp. Our team will contact you with the option best suited to your trip.",
      ctaLabel: "Request a quote",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "We prepare the option that suits you best",
      description:
        "We offer a range of options and exceptional services, so you can choose what best suits your trip.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "We confirm your trip and arrange every detail",
      description:
        "Once you approve the quote, we prepare the right bus and coordinate the trip details so everything is ready at the scheduled time.",
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
  quoteEyebrow: "Tell us the road.",
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
    "Seasonal notes, fleet updates, and announcements from Durrat Almunawwara Co.",
  newsEmpty: "No news posts yet. Check back soon.",
  faqTitle: "FAQs",
  faqSubtitle: "Answers to questions groups and institutions ask most often.",
  faqCta: "Contact us",
  ctaBandEyebrow: "From request to road.",
  ctaBandTitle: "Sit back, we'll coordinate the rest.",
  ctaBandSubtitle:
    "Share your trip details and our team will follow up with clear options.",
}
