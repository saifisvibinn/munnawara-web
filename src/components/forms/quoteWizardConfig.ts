/**
 * Quote wizard content — everything Abdullah may want to change lives here.
 * Draft options come from the product notes; confirm exact lists with Abdullah.
 */

export type L10n = { en: string; ar: string }

export type Option<T extends string = string> = {
  id: T
  label: L10n
  hint?: L10n
}

export const l = (en: string, ar: string): L10n => ({ en, ar })

/* ---------- Step 1: who is asking ---------- */

export const customerOptions = [
  {
    id: "individual",
    label: l("Individual", "فرد"),
    hint: l("Family or personal trip", "رحلة عائلية أو شخصية"),
  },
  {
    id: "company",
    label: l("Company / Corporate", "شركة / مؤسسة"),
    hint: l("Staff, events, and contracts", "نقل موظفين وفعاليات وعقود"),
  },
  {
    id: "government",
    label: l("Government entity", "جهة حكومية"),
    hint: l("Institutional and official transport", "نقل رسمي ومؤسسي"),
  },
  {
    id: "school",
    label: l("School / University", "مدرسة / جامعة"),
    hint: l("Student routes and trips", "مسارات ورحلات الطلاب"),
  },
  {
    id: "hajj_mission",
    label: l("Hajj / Umrah mission", "بعثة حج / عمرة"),
    hint: l("Mission or campaign operators", "مكاتب وحملات الحج والعمرة"),
  },
  {
    id: "tourism",
    label: l("Tourism company", "شركة سياحة"),
    hint: l("Tour groups and packages", "مجموعات وبرامج سياحية"),
  },
] as const satisfies readonly Option[]

export type CustomerId = (typeof customerOptions)[number]["id"]

/** Customer types that must give an organization name. */
export const orgRequired: readonly CustomerId[] = [
  "company",
  "government",
  "school",
  "hajj_mission",
  "tourism",
]

/* ---------- Step 2: service ---------- */

export const umrahService: Option = {
  id: "umrah",
  label: l("Magmu3a Umra", "مجموعة عمرة"),
  hint: l("Airport ↔ Makkah ↔ Madinah transport", "نقل المطار ومكة والمدينة"),
}

export const charterService: Option = {
  id: "charter",
  label: l("Custom trip", "رحلة مخصصة"),
  hint: l("Any route, any date", "أي مسار وأي موعد"),
}

/** Company sub-menu (draft — workers confirmed, rest from the KB; confirm with Abdullah). */
export const corporateServices: readonly Option[] = [
  {
    id: "workers",
    label: l("Workers / staff transport", "نقل العمال والموظفين"),
    hint: l("Daily or contract shuttles", "نقل يومي أو بعقد"),
  },
  {
    id: "education",
    label: l("School / university transport", "نقل مدارس وجامعات"),
  },
  {
    id: "tourism_group",
    label: l("Tourism groups", "مجموعات سياحية"),
  },
  {
    id: "events",
    label: l("Events & conferences", "فعاليات ومؤتمرات"),
  },
  {
    id: "vip_airport",
    label: l("VIP airport transfer", "استقبال كبار الزوار من المطار"),
  },
  {
    id: "international",
    label: l("International routes", "رحلات دولية"),
  },
  {
    id: "other",
    label: l("Something else", "طلب آخر"),
  },
]

/* ---------- Umrah: Dawra / Makta3 ---------- */

export const umrahKinds: readonly Option[] = [
  {
    id: "dawra",
    label: l("Dawra", "دورة"),
    hint: l("Full circuit: airport, Makkah, Madinah, airport", "دورة كاملة: مطار ومكة ومدينة ومطار"),
  },
  {
    id: "maktaa",
    label: l("Makta3", "مقطع"),
    hint: l("One-way or two-way between two places", "اتجاه واحد أو ذهاب وعودة بين نقطتين"),
  },
]

export const dawraLengths: readonly Option[] = [
  {
    id: "short",
    label: l("Short Dawra", "دورة قصيرة"),
    hint: l("Airport → Makkah → Madinah → Airport", "مطار ← مكة ← المدينة ← مطار"),
  },
  {
    id: "long",
    label: l("Long Dawra", "دورة طويلة"),
    hint: l("Same route plus mazarat (ziyarat) stops", "نفس المسار مع زيارة المزارات"),
  },
]

/** Mazarat offered on the long Dawra (draft list — confirm with Abdullah). */
export const mazaratOptions: readonly Option[] = [
  { id: "quba", label: l("Quba Mosque", "مسجد قباء") },
  { id: "qiblatain", label: l("Masjid Qiblatain", "مسجد القبلتين") },
  { id: "uhud", label: l("Mount Uhud", "جبل أحد") },
  { id: "dates", label: l("Dates market", "سوق التمور") },
  { id: "hira", label: l("Cave of Hira", "غار حراء") },
  { id: "arafat", label: l("Arafat", "عرفات") },
]

export const tripDirections: readonly Option[] = [
  { id: "oneway", label: l("One way", "اتجاه واحد") },
  { id: "twoway", label: l("Two way", "ذهاب وعودة") },
]

/* ---------- Locations ---------- */

export type PlaceId = "jed_airport" | "makkah" | "madinah" | "med_airport"

export const places: readonly (Option<PlaceId> & { x: number; y: number })[] = [
  { id: "jed_airport", label: l("Jeddah Airport", "مطار جدة"), x: 34, y: 78 },
  { id: "makkah", label: l("Makkah", "مكة المكرمة"), x: 58, y: 62 },
  { id: "madinah", label: l("Madinah", "المدينة المنورة"), x: 130, y: 20 },
  { id: "med_airport", label: l("Madinah Airport", "مطار المدينة"), x: 168, y: 34 },
]

export const airports: readonly Option<PlaceId>[] = places.filter(
  (p) => p.id === "jed_airport" || p.id === "med_airport",
)

/* ---------- Fleet ---------- */

export const busClassOptions = [
  { id: "vip", label: l("VIP", "في آي بي"), hint: l("32 seats", "٣٢ مقعد") },
  { id: "standard", label: l("Standard", "عادية"), hint: l("49 seats", "٤٩ مقعد") },
  { id: "coach", label: l("Coach", "حافلة ٤٥"), hint: l("45 seats", "٤٥ مقعد") },
  { id: "city", label: l("City bus", "حافلة مدينة"), hint: l("19 seats", "١٩ مقعد") },
  {
    id: "employee",
    label: l("Staff transport", "نقل موظفين"),
    hint: l("48 & 60 seats", "٤٨ و٦٠ مقعد"),
  },
] as const satisfies readonly Option[]

export type BusClassId = (typeof busClassOptions)[number]["id"]

export const extraOptions = [
  { id: "needsSupervisors", label: l("Supervisors / coordinators", "مشرفون / منسقون") },
  { id: "needsTracking", label: l("Live tracking", "تتبع مباشر") },
  { id: "needsBranding", label: l("Branding on buses", "هوية المؤسسة على الحافلات") },
  { id: "needsAirportReception", label: l("Airport pickup", "استقبال من المطار") },
] as const

export type ExtraId = (typeof extraOptions)[number]["id"]

/* ---------- Helpers ---------- */

export const pick = (text: L10n, locale: string) => (locale === "ar" ? text.ar : text.en)

export const findOption = <T extends Option>(list: readonly T[], id: string) =>
  list.find((o) => o.id === id)

export const placeLabel = (id: string, locale: string) => {
  const p = places.find((x) => x.id === id)
  return p ? pick(p.label, locale) : id
}
