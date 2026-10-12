import type { AboutStat } from "@/content/types"
import { BusFront, CalendarDays, MapPinned, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const STAT_ICONS: Record<AboutStat["id"], LucideIcon> = {
  fleet: BusFront,
  years: CalendarDays,
  partners: Users,
  cities: MapPinned,
}

export const getStatIcon = (id: string): LucideIcon =>
  STAT_ICONS[id] ?? BusFront
