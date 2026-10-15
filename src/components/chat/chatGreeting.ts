export type GreetingKey = "greetMorning" | "greetAfternoon" | "greetEvening"
export type SeasonKey =
  | "seasonRamadan"
  | "seasonEidFitr"
  | "seasonHajj"
  | "seasonEidAdha"
  | "seasonNationalDay"

const TIME_ZONE = "Asia/Riyadh"

function parts(date: Date, calendar: "gregory" | "islamic-umalqura") {
  const out = new Intl.DateTimeFormat(`en-u-ca-${calendar}-nu-latn`, {
    timeZone: TIME_ZONE,
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date)
  const num = (type: string) => Number(out.find((p) => p.type === type)?.value)
  return { month: num("month"), day: num("day"), hour: num("hour") }
}

/**
 * Greeting line shown above the chat, by Makkah time: time of day, plus the
 * season when it matters (Ramadan, both Eids, Hajj, Saudi National Day).
 */
export function chatGreeting(date = new Date()): { time: GreetingKey; season: SeasonKey | null } {
  const { hour } = parts(date, "gregory")
  const time: GreetingKey =
    hour >= 4 && hour < 12 ? "greetMorning" : hour >= 12 && hour < 17 ? "greetAfternoon" : "greetEvening"

  const hijri = parts(date, "islamic-umalqura")
  const greg = parts(date, "gregory")
  let season: SeasonKey | null = null
  if (hijri.month === 9) season = "seasonRamadan"
  else if (hijri.month === 10 && hijri.day <= 3) season = "seasonEidFitr"
  else if (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) season = "seasonEidAdha"
  else if ((hijri.month === 11 && hijri.day >= 15) || (hijri.month === 12 && hijri.day < 10)) season = "seasonHajj"
  else if (greg.month === 9 && greg.day === 23) season = "seasonNationalDay"
  return { time, season }
}
