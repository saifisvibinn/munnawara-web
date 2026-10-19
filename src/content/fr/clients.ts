import type { ClientCategory } from "../types"

/** Regroupements sectoriels correspondant aux logos du mur clients officiel. */
export const clients: readonly ClientCategory[] = [
  {
    id: "hajj-umrah-operators",
    label: "Opérateurs Hajj et Omra",
    description:
      "Campagnes et sociétés de Omra dans le Royaume et sur les marchés internationaux.",
  },
  {
    id: "corporate",
    label: "Entreprises et institutions",
    description: "Partenaires de transport pour le personnel, les écoles, la main-d'œuvre et le secteur privé.",
  },
  {
    id: "government",
    label: "Gouvernement et éducation",
    description:
      "Dispositifs de transport formels, y compris les programmes du ministère de l'Éducation et les missions institutionnelles.",
  },
] as const
