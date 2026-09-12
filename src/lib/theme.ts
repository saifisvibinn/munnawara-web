// DMTC logo design language — orange primary, blue accent, purple wordmark.

export const brand = {
  primary: "#F37021",
  primaryDeep: "#1A1210",
  primarySoft: "#F9A066",
  onPrimary: "#FFFFFF",
  gold: "#F37021",
  goldSoft: "#F9A066",
  goldDeep: "#C45A12",
  secondary: "#C45A12",
  secondaryContainer: "#FFE3D0",
  wordmark: "#662D91",
  wordmarkDeep: "#4A1F6B",
  orange: "#F37021",
  orangeSoft: "#F9A066",
  blue: "#00AEEF",
  blueSoft: "#7DD3F5",
  ink: "#1A1520",
  inkMuted: "#5C5666",
  silver: "#8A8494",
  surface: "#FAF7F4",
  surfaceMint: "#FFF4EC",
  surfaceMuted: "#F3EBE4",
  surfaceContainer: "#FFE8D8",
  surfaceElevated: "#FFFFFF",
  border: "#EADFD5",
  black: "#1A1210",
  white: "#FFFFFF",
  whatsapp: "#25D366",
} as const

export const spacing = {
  scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96] as const,
} as const

export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
} as const

export const shadow = {
  sm: "0 2px 12px -2px rgb(243 112 33 / 0.08)",
  md: "0 12px 32px -8px rgb(243 112 33 / 0.16)",
} as const
