import type { CareRevealContent } from "../types"

export const careReveal: CareRevealContent = {
  eyebrow: "Munawwara Care",
  headingLines: ["Travel together.", "Stay connected."],
  body:
    "Munawwara Care supports Guests of Rahman with guidance, health information, help requests, location sharing, and hotel/room details, within the scope of the contracted program, so organizers and pilgrims stay aligned from meetpoint to return.",
  benefits: [
    {
      id: "aligned",
      icon: "group",
      label: "Guidance and shared plans so the group moves as one",
    },
    {
      id: "reachable",
      icon: "signal",
      label: "Help requests and timely updates when it matters",
    },
    {
      id: "accounted",
      icon: "shield",
      label: "Location sharing and accountability from meetpoint to return",
    },
    {
      id: "journey",
      icon: "route",
      label: "Hotel and room details kept with the contracted program",
    },
  ],
}
