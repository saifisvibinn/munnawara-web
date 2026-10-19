import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "Durrat Almunawwara Transport for Pilgrims",
    summary:
      "Servir les hôtes d'Allah est notre priorité absolue. Nous assurons un transport terrestre intégré pour les pèlerins, les étudiants et les institutions, l'accueil aux aéroports et ports, les navettes de prière, les trajets vers les Lieux saints, et les lignes pour le personnel, avec une flotte moderne et des standards d'exploitation élevés. Le transport des pèlerins pendant la saison du Hajj est contracté via la mission responsable et le parcours électronique.",
    services: [
      "Accueil aéroportuaire et portuaire depuis l'aéroport King Abdulaziz à Djeddah et l'aéroport Prince Mohammad bin Abdulaziz à Médine",
      "Navettes de prière vers les Deux Saintes Mosquées, 24h/24",
      "Ziyarah et circuits historiques à La Mecque et Médine",
      "Navettes des Lieux saints entre Arafat, Muzdalifah et Mina",
      "Transport interurbain et liaisons internationales vers le Yémen (Marib, Mukalla, Aden)",
      "Partenaire fiable du ministère de l'Éducation, des écoles et des universités : ceintures de sécurité, suivi GPS en direct et conducteurs qualifiés",
      "Transport d'entreprise et d'employés avec horaires d'équipes flexibles, flotte adaptée à l'effectif, et couverture des villes industrielles et des complexes résidentiels éloignés",
      "Contrats de missions Hajj via le parcours électronique",
    ],
    logo: "/brand/company-group.png",
    heroImage: "/fleet/coach-2025-2026/side.webp",
    contentReady: true,
  },
  {
    slug: "umrah-services",
    name: "Durrat Almunawwara Umrah Services",
    summary:
      "Un accompagnement Omra complet qui réunit visas, réservation d'hôtels et transport premium afin que les groupes avancent selon un parcours clair et coordonné.",
    services: [
      "Accompagnement pour l'obtention du visa Omra",
      "Réservation d'hôtels et d'hébergements",
      "Transport premium et logistique pour les programmes Omra",
      "Coordination des programmes de groupe avec transport et hospitalité",
    ],
    logo: "/brand/company-umrah.png",
    heroImage: "/fleet/vip-2026/side.webp",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "Durrat Almunawwara Tourism Services",
    summary:
      "Tourisme de groupe, conférences, événements et transport VIP de luxe pour clients d'élite, délégations diplomatiques et dirigeants d'entreprise, avec confidentialité, capacité de réserve et plans d'accueil clairs.",
    services: [
      "Transport de groupes touristiques",
      "Conférences et événements",
      "Occasions privées et mariages",
      "Transport de luxe et VIP avec équipements de confort premium",
      "Transfers VIP aéroport",
      "Flottes multi-autocars pour événements",
    ],
    logo: "/brand/company-tourism.png",
    heroImage: "/fleet/vip-2026/front.webp",
    contentReady: true,
  },
  {
    slug: "hospitality-catering",
    name: "Durrat Almunawwara Hospitality & Catering",
    summary:
      "Soutien en hospitalité et restauration pour les programmes Hajj et Omra et les événements institutionnels.",
    services: [
      "Restauration de groupe",
      "Hospitalité sur le terrain",
      "Soutien aux programmes Hajj et Omra",
    ],
    logo: "/brand/company-hospitality.png",
    heroImage: "/fleet/vip-2026/interior-aisle.jpeg",
    contentReady: true,
  },
] as const
