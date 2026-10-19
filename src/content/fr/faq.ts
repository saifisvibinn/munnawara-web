import type { FaqItem } from "../types"

export const faq: readonly FaqItem[] = [
  {
    id: "hajj-contract",
    question: "Comment réserver le transport pour le Hajj ?",
    answer:
      "Pendant la saison du Hajj, le transport des pèlerins est contracté via la mission responsable et enregistré sur le parcours électronique, et non comme une réservation directe du pèlerin auprès de la société. Le paiement de ces contrats passe par ce parcours.",
  },
  {
    id: "yemen",
    question: "Exploitez-vous des liaisons internationales ?",
    answer:
      "Oui. Les services internationaux comprennent actuellement des destinations au Yémen : Marib, Mukalla et Aden. Indiquez l'origine, la date et le nombre de passagers pour vérifier la disponibilité.",
  },
  {
    id: "fleet-types",
    question: "Quels types d'autocars sont disponibles ?",
    answer:
      "Les classes du profil officiel incluent les autocars VIP (18 ou 28 sièges de luxe), les autocars coach (49), les bus urbains (45 avec places debout), les bus V7 (41) et les coasters (29). Nous confirmons l'autocar attribué à votre date dans l'offre.",
  },
  {
    id: "quote",
    question: "Que faut-il pour obtenir un devis ?",
    answer:
      "Nom, contact, nombre de passagers, origine et destination, date et heure, classe d'autocar si connue, et toute précision sur l'accessibilité ou les bagages. Un numéro de demande n'est pas une réservation confirmée tant qu'une offre officielle n'a pas été émise.",
  },
  {
    id: "baggage",
    question: "Quelle est la politique bagages ?",
    answer:
      "La franchise varie selon l'itinéraire, le billet et le type d'autocar. Nous confirmons la politique en vigueur avec votre réservation avant le paiement. Nous n'inventons pas de poids fixes dans le chat.",
  },
  {
    id: "safety",
    question: "Quelles normes de sécurité suivez-vous ?",
    answer:
      "Inspections, maintenance périodique, suivi GPS, supervision des conducteurs et procédures d'intervention d'urgence conformément aux exigences réglementaires.",
  },
] as const
