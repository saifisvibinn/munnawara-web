import type { ContactContent } from "../types"

export const contact: ContactContent = {
  headline: "Parlez à l'équipe derrière chaque trajet.",
  intro:
    "Durrat Al-Munawwara Transport se tient à votre disposition pour vos demandes et questions 24h/24 et 7j/7. Vous planifiez un groupe de pèlerinage, un contrat institutionnel ou un simple transfert ? Contactez-nous directement.",
  heroImageAlt: "Sièges en cuir d'autocar avec le logo Durrat Almunawwara Co.",
  whatsappCta: "Nous écrire sur WhatsApp",
  channelsTitle: "Nous joindre directement",
  whatsappNote: "Écrire à notre équipe opérations",
  phoneLines: [
    {
      id: "sales",
      label: "Ventes",
      note: "Devis, réservations et demandes commerciales",
      phone: "+966535731923",
    },
    {
      id: "operations",
      label: "Opérations",
      note: "Opérations de flotte et assistance le jour du voyage",
      phone: "+966504352314",
    },
    {
      id: "management",
      label: "Direction",
      note: "Ligne dédiée aux réclamations et suggestions",
      phone: "+966555967366",
    },
    {
      id: "international",
      label: "Transport international",
      note: "Trajets transfrontaliers et coordination",
      phone: "+966549058538",
    },
  ],
  emailNote: "Pour les demandes détaillées et les documents",
  officeTitle: "Visitez notre bureau",
  mapTitle: "Carte situant Durrat Almunawwara Co. à La Mecque, Royaume d'Arabie saoudite",
  mapsLink: "Ouvrir dans Google Maps",
  quoteTitle: "Vous planifiez un trajet ?",
  quoteBody:
    "Indiquez vos dates, la taille du groupe et l'itinéraire. Notre équipe préparera des options pour vous.",
  quoteHref: "/quote",
}
