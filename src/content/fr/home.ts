import type { HomeContent } from "../types"

export const home: HomeContent = {
  landingHero: {
    eyebrow: "Durrat Almunawwara Co.",
    lines: ["Se déplacer", "avec soin", "pour les hôtes"],
    sub: "Solutions opérationnelles et transport intégré dans le Royaume et au-delà, pour les pèlerins et les institutions, soutenus par une flotte moderne et un réseau d'opérations complet.",
    primaryCta: "Demander un transport",
    secondaryCta: "Explorer notre flotte",
    brandWords: ["Durrat", "Almunawwara", "Co."],
    backTop: "Durrat Almunawwara Co., retour en haut",
    chatAria: "Discuter avec Durrat Almunawwara Co.",
  },
  valueTitle: "Un transport pensé pour les trajets sacrés",
  valueIntro:
    "Durrat Almunawwara Co. coordonne des autocars modernes, des opérations soignées et une communication claire pour que pèlerins et institutions voyagent en toute confiance.",
  valueImage: "/fleet/vip-2026/side.webp",
  valueBullets: [
    {
      id: "safety",
      title: "La sécurité d'abord",
      description: "Chaque mission commence par des véhicules sûrs, des conducteurs formés et des opérations disciplinées.",
    },
    {
      id: "commitment",
      title: "Engagement et qualité",
      description: "Des standards clairs et une livraison fiable pour les partenaires publics et privés.",
    },
    {
      id: "hospitality",
      title: "Hospitalité et professionnalisme",
      description: "Un service respectueux pour les hôtes d'Allah, les employés, les étudiants et les délégations officielles.",
    },
    {
      id: "innovation",
      title: "Innovation et opérations",
      description: "Technologies intelligentes et amélioration continue sur l'ensemble de la flotte et de la salle de contrôle.",
    },
  ],
  passbyEyebrow: "Durrat Almunawwara Co.",
  passbyTitle: "vous choisissez la destination",
  passbyTitleAfter: "nous vous y emmenons en sécurité",
  howTitle: "Comment ça marche",
  howSubtitle: "Trois étapes claires de la demande au transport confirmé.",
  howStepPrefix: "Étape",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "Parlez-nous de votre trajet… et nous nous occupons du reste",
      description:
        "Indiquez le type de trajet, la destination, la date et le nombre de passagers via le formulaire « Demander un devis » ou WhatsApp. Notre équipe vous contactera avec l'option la mieux adaptée à votre trajet.",
      ctaLabel: "Demander un devis",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "Nous préparons l'option qui vous convient le mieux",
      description:
        "Nous proposons une gamme d'options et de services d'exception, pour que vous puissiez choisir ce qui convient le mieux à votre trajet.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "Nous confirmons votre trajet et organisons chaque détail",
      description:
        "Une fois le devis approuvé, nous préparons l'autocar adapté et coordonnons les détails du trajet pour que tout soit prêt à l'heure prévue.",
      ctaLabel: "Nous contacter",
      ctaHref: "/contact",
    },
  ],
  aboutEyebrow: "À propos du groupe",
  aboutCta: "Lire notre histoire",
  aboutSecondaryCta: "Nous contacter",
  aboutSocialCta: "Suivre @dmtcSA",
  aboutImage: "/hero/landing-sky.jpg",
  aboutHeadlineLines: [
    "Des trajets sûrs et confortables.",
    "Flotte organisée. Standards clairs.",
  ],
  quoteEyebrow: "Indiquez-nous la route.",
  quoteHeadline: "Installez-vous. Nous coordonnons le reste.",
  quoteBody:
    "Indiquez le type de trajet, les villes, les dates et le nombre de passagers. Notre équipe fait le suivi avec des options claires.",
  testimonialsTitle: "Les partenaires que nous servons",
  testimonialsSubtitle:
    "Transport organisé pour les campagnes, les institutions et les missions formelles.",
  testimonialsCta: "Nous contacter",
  testimonialsViewMore: "Voir plus",
  // TODO(content): remplacer lorsque le client fournira des témoignages approuvés
  testimonialsEmpty: "Les témoignages clients apparaîtront ici une fois approuvés pour publication.",
  newsTitle: "Lire à propos du groupe",
  newsSubtitle:
    "Notes saisonnières, actualités de la flotte et annonces de Durrat Almunawwara Co.",
  newsEmpty: "Aucun article pour le moment. Revenez bientôt.",
  faqTitle: "FAQ",
  faqSubtitle: "Réponses aux questions les plus fréquentes des groupes et des institutions.",
  faqCta: "Nous contacter",
  ctaBandEyebrow: "De la demande à la route.",
  ctaBandTitle: "Installez-vous, nous coordonnons le reste.",
  ctaBandSubtitle:
    "Partagez les détails de votre trajet et notre équipe fera le suivi avec des options claires.",
}
