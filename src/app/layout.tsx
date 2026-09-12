import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "DMTC | Durrah Al-Munawwara",
  description: "Durrah Al-Munawwara Group — transport and pilgrimage services",
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return children
}

export default RootLayout
