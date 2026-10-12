export type Partner = {
  name: string
  /** Path under /public, e.g. "/partners/acme.svg" (SVG preferred, else transparent PNG). */
  logo: string
  /** Optional link to the partner's site. */
  url?: string
}

/** Client logos from the official 2026 company profile (OUR CLIENTS page). */
export const partners: readonly Partner[] = [
  { name: "Client 01", logo: "/partners/pdf-00.png" },
  { name: "Client 02", logo: "/partners/pdf-01.png" },
  { name: "Client 03", logo: "/partners/pdf-02.png" },
  { name: "Client 04", logo: "/partners/pdf-03.png" },
  { name: "Client 05", logo: "/partners/pdf-04.png" },
  { name: "Client 06", logo: "/partners/pdf-05.png" },
  { name: "Client 07", logo: "/partners/pdf-06.png" },
  { name: "Client 08", logo: "/partners/pdf-07.png" },
  { name: "Client 09", logo: "/partners/pdf-08.png" },
  { name: "Client 10", logo: "/partners/pdf-09.png" },
  { name: "Client 11", logo: "/partners/pdf-10.png" },
  { name: "Client 12", logo: "/partners/pdf-11.png" },
  { name: "Client 13", logo: "/partners/pdf-12.png" },
  { name: "Client 14", logo: "/partners/pdf-13.png" },
  { name: "Client 15", logo: "/partners/pdf-14.png" },
  { name: "Client 16", logo: "/partners/pdf-15.png" },
  { name: "Client 17", logo: "/partners/pdf-16.png" },
  { name: "Client 18", logo: "/partners/pdf-17.png" },
  { name: "Client 19", logo: "/partners/pdf-19.png" },
  { name: "Client 20", logo: "/partners/pdf-20.png" },
  { name: "Client 21", logo: "/partners/pdf-21.png" },
  { name: "Client 22", logo: "/partners/pdf-22.png" },
  { name: "Client 23", logo: "/partners/pdf-23.png" },
  { name: "Client 24", logo: "/partners/pdf-24.png" },
  { name: "Client 25", logo: "/partners/pdf-25.png" },
  { name: "Client 26", logo: "/partners/pdf-26.png" },
  { name: "Client 27", logo: "/partners/pdf-27.png" },
  { name: "Client 28", logo: "/partners/pdf-28.png" },
  { name: "Client 29", logo: "/partners/pdf-29.png" },
  { name: "Client 30", logo: "/partners/pdf-30.png" },
  { name: "Client 31", logo: "/partners/pdf-31.png" },
  { name: "Client 32", logo: "/partners/pdf-32.png" },
  { name: "Client 33", logo: "/partners/pdf-33.png" },
  { name: "Client 34", logo: "/partners/pdf-34.png" },
  { name: "Client 35", logo: "/partners/pdf-35.png" },
  { name: "Client 36", logo: "/partners/pdf-36.png" },
  { name: "Client 37", logo: "/partners/pdf-37.png" },
  { name: "Client 38", logo: "/partners/pdf-38.png" },
  { name: "Client 39", logo: "/partners/pdf-39.png" },
  { name: "Client 40", logo: "/partners/pdf-40.png" },
  { name: "Client 41", logo: "/partners/pdf-41.png" },
  { name: "Client 42", logo: "/partners/pdf-42.png" },
  { name: "Client 43", logo: "/partners/pdf-43.png" },
  { name: "Client 44", logo: "/partners/pdf-44.png" },
] as const
