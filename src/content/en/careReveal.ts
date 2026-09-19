import type { CareRevealContent } from "../types"

export const careReveal: CareRevealContent = {
  eyebrow: "Munawwara Care",
  headingLines: ["Travel together.", "Stay connected."],
  body:
    "For organized Hajj and Umrah groups, coordination is the journey. Munawwara Care helps organizers and pilgrims stay aligned, accounted for, and reachable—from the first meetpoint to the safe return home.",
  benefits: [
    {
      id: "aligned",
      icon: "group",
      label: "Shared plans so the whole group moves as one",
    },
    {
      id: "reachable",
      icon: "signal",
      label: "Clear roles and timely updates when it matters",
    },
    {
      id: "accounted",
      icon: "shield",
      label: "Pilgrims accounted for from meetpoint to return",
    },
    {
      id: "journey",
      icon: "route",
      label: "Coordination that stays with you for the full journey",
    },
  ],
}
