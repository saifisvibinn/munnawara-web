import type { ContactContent } from "../types"

export const contact: ContactContent = {
  headline: "Talk to the team behind every journey.",
  intro:
    "Durrat Al-Munawwara Transport is pleased to handle your requests and inquiries 24/7. Planning a pilgrimage group, an institutional contract, or a single transfer? Reach us directly.",
  heroImageAlt: "Leather coach seats with the Durrat Almunawwara Co. logo",
  whatsappCta: "Message us on WhatsApp",
  channelsTitle: "Reach us directly",
  whatsappNote: "Message our operations team",
  phoneLines: [
    {
      id: "sales",
      label: "Sales",
      note: "Quotes, bookings, and commercial inquiries",
      phone: "+966535731923",
    },
    {
      id: "management",
      label: "Management",
      note: "Dedicated line for complaints and suggestions",
      phone: "+966555967366",
    },
    {
      id: "operations",
      label: "Operations",
      note: "Fleet operations and day-of-travel support",
      phone: "+966504352314",
    },
  ],
  emailNote: "For detailed requests and documents",
  officeTitle: "Visit our office",
  mapTitle: "Map showing Durrat Almunawwara Co. in Makkah, Kingdom of Saudi Arabia",
  mapsLink: "Open in Google Maps",
  quoteTitle: "Planning a trip?",
  quoteBody:
    "Share your dates, group size, and route. Our team will prepare options for you.",
  quoteHref: "/quote",
}
