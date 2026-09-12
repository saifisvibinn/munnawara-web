import type { FaqItem } from "../types"

export const faq: readonly FaqItem[] = [
  {
    id: "group-size",
    question: "What is the minimum group size?",
    answer:
      // TODO(content): confirm commercial minimums with client
      "It depends on the service type and season. Contact us via the form or WhatsApp for details.",
  },
  {
    id: "fleet-types",
    question: "Which bus types are available?",
    answer:
      "Our fleet includes Premium VIP, VIP, Coach, City, Labour, and Mini Bus categories from the exhibition catalog.",
  },
  {
    id: "safety",
    question: "What safety standards do you follow?",
    answer:
      "Buses include safety features, GPS, and advanced braking systems according to each category’s specifications.",
  },
] as const
