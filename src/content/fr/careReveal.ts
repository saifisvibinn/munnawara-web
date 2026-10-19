import type { CareRevealContent } from "../types"

export const careReveal: CareRevealContent = {
  eyebrow: "Munawwara Care",
  headingLines: ["Voyagez ensemble.", "Restez connectés."],
  body:
    "Munawwara Care accompagne les hôtes du Tout Miséricordieux avec des conseils, des informations santé, des demandes d'aide, le partage de position et les détails d'hôtel/chambre, dans le cadre du programme contractuel, afin que les organisateurs et les pèlerins restent alignés du point de rendez-vous au retour.",
  benefits: [
    {
      id: "aligned",
      icon: "group",
      label: "Conseils et plans partagés pour que le groupe avance comme un seul",
    },
    {
      id: "reachable",
      icon: "signal",
      label: "Demandes d'aide et mises à jour au bon moment",
    },
    {
      id: "accounted",
      icon: "shield",
      label: "Partage de position et responsabilité du point de rendez-vous au retour",
    },
    {
      id: "journey",
      icon: "route",
      label: "Détails d'hôtel et de chambre conservés avec le programme contractuel",
    },
  ],
}
