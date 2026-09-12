import type { SiteConfig } from "./types"

/** Contact details from exhibition brochure page 16 — confirm WhatsApp preference with client */
export const siteConfig: SiteConfig = {
  brandNameAr: "درة المنورة",
  brandNameEn: "Durrah Al-Munawwara",
  brandShort: "DMTC",
  email: "info@munawwara.com",
  phones: ["+966504352314", "+966596610097"],
  // TODO(content): confirm which brochure number is the official WhatsApp line
  whatsappNumber: "966504352314",
  address: {
    ar: "المملكة العربية السعودية، جدة — طريق المدينة المنورة، مبنى الوصال، الدور الرابع، مكتب 408",
    en: "KSA, Jeddah — Almadinah Almunawarah Rd, Al Wessal Building, 4th floor, Office 408",
  },
  workingHours: {
    ar: "الأحد – الخميس، ٩ ص – ٥ م",
    en: "Sunday – Thursday, 9 AM – 5 PM",
  },
  social: {
    handle: "@dmtcSA",
    twitter: "https://twitter.com/dmtcSA",
    facebook: "https://facebook.com/dmtcSA",
    instagram: "https://instagram.com/dmtcSA",
    snapchat: "https://snapchat.com/add/dmtcSA",
  },
  siteUrl: "https://www.munawwara.com",
}
