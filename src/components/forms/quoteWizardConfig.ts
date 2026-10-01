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
  label: l("Umrah Group Package", "مجموعة عمرة"),
  hint: l("Transport between the airports, Makkah and Madinah", "نقل بين المطارات ومكة والمدينة"),
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

/* ---------- Umrah: Circuit (Dawra) / Transfer (Maqta') ---------- */

export const umrahKinds: readonly Option[] = [
  {
    id: "dawra",
    label: l("Umrah Circuit (Dawra)", "دورة"),
    hint: l(
      "The full loop: airport → Makkah → Madinah → airport",
      "الدورة الكاملة: مطار ← مكة ← المدينة ← مطار",
    ),
  },
  {
    id: "maktaa",
    label: l("Point-to-Point Transfer (Maqta')", "مقطع"),
    hint: l(
      "One leg between two places, one-way or round trip",
      "رحلة بين نقطتين، اتجاه واحد أو ذهاب وعودة",
    ),
  },
]

export const dawraLengths: readonly Option[] = [
  {
    id: "short",
    label: l("Short Circuit", "دورة قصيرة"),
    hint: l("Airport → Makkah → Madinah → Airport", "مطار ← مكة ← المدينة ← مطار"),
  },
  {
    id: "long",
    label: l("Long Circuit with Ziyarat", "دورة طويلة مع المزارات"),
    hint: l("The same route plus visits to holy sites", "نفس المسار مع زيارة المزارات"),
  },
]

export const tripDirections: readonly Option[] = [
  { id: "oneway", label: l("One way", "اتجاه واحد") },
  { id: "twoway", label: l("Round trip", "ذهاب وعودة") },
]

/*
 * ---------- Locations (WGS84, verified against Wikipedia / OpenStreetMap) ----------
 * Jeddah: King Abdulaziz Int'l Airport · Makkah: Masjid al-Haram ·
 * Madinah: Prophet's Mosque · MED: Prince Mohammad bin Abdulaziz Int'l Airport.
 */

export type PlaceId = "jed_airport" | "makkah" | "madinah" | "med_airport"

export type Place = Option<PlaceId> & { lat: number; lng: number; city: "jeddah" | "makkah" | "madinah" }

export const places: readonly Place[] = [
  {
    id: "jed_airport",
    label: l("Jeddah Airport (JED)", "مطار جدة (JED)"),
    lat: 21.67944,
    lng: 39.15667,
    city: "jeddah",
  },
  {
    id: "makkah",
    label: l("Makkah", "مكة المكرمة"),
    lat: 21.4225,
    lng: 39.82611,
    city: "makkah",
  },
  {
    id: "madinah",
    label: l("Madinah", "المدينة المنورة"),
    lat: 24.46833,
    lng: 39.61083,
    city: "madinah",
  },
  {
    id: "med_airport",
    label: l("Madinah Airport (MED)", "مطار المدينة (MED)"),
    lat: 24.55333,
    lng: 39.705,
    city: "madinah",
  },
]

export const airports: readonly Option<PlaceId>[] = places.filter(
  (p) => p.id === "jed_airport" || p.id === "med_airport",
)

/**
 * Ziyarat (holy sites) offered on the long circuit. `city` decides where the
 * stop falls in the route; `order` is the visiting order within that city.
 * `preselect` sites are ticked by default when the user picks the long circuit.
 */
export type Ziyarat = Option & {
  lat: number
  lng: number
  city: "makkah" | "madinah"
  order: number
  preselect?: boolean
}

export const ziyaratOptions: readonly Ziyarat[] = [
  // Makkah
  { id: "aisha", label: l("Masjid Aisha (Tan'im)", "مسجد عائشة (التنعيم)"), lat: 21.46771, lng: 39.80137, city: "makkah", order: 1 },
  { id: "hira", label: l("Jabal al-Nour & Cave of Hira", "جبل النور وغار حراء"), lat: 21.45806, lng: 39.86139, city: "makkah", order: 2, preselect: true },
  { id: "thawr", label: l("Jabal Thawr", "جبل ثور"), lat: 21.377, lng: 39.84987, city: "makkah", order: 3, preselect: true },
  { id: "mina", label: l("Mina", "منى"), lat: 21.41333, lng: 39.89333, city: "makkah", order: 4 },
  { id: "muzdalifah", label: l("Muzdalifah", "مزدلفة"), lat: 21.3925, lng: 39.93778, city: "makkah", order: 5 },
  { id: "arafat", label: l("Mount Arafat", "جبل عرفات"), lat: 21.35472, lng: 39.98389, city: "makkah", order: 6, preselect: true },
  // Madinah
  { id: "quba", label: l("Quba Mosque", "مسجد قباء"), lat: 24.43917, lng: 39.61722, city: "madinah", order: 1, preselect: true },
  { id: "qiblatayn", label: l("Masjid al-Qiblatayn", "مسجد القبلتين"), lat: 24.48409, lng: 39.57891, city: "madinah", order: 2, preselect: true },
  { id: "khandaq", label: l("Seven Mosques (Al-Khandaq)", "المساجد السبعة (الخندق)"), lat: 24.47673, lng: 39.59602, city: "madinah", order: 3 },
  { id: "ghamama", label: l("Masjid al-Ghamama", "مسجد الغمامة"), lat: 24.46581, lng: 39.60696, city: "madinah", order: 4 },
  { id: "baqi", label: l("Al-Baqi Cemetery", "مقبرة البقيع"), lat: 24.4669, lng: 39.6164, city: "madinah", order: 5 },
  { id: "uhud", label: l("Mount Uhud & the Martyrs' Cemetery", "جبل أحد ومقبرة الشهداء"), lat: 24.5, lng: 39.61, city: "madinah", order: 6, preselect: true },
  { id: "badr", label: l("Badr (full-day trip)", "بدر (رحلة يوم كامل)"), lat: 23.73333, lng: 38.76667, city: "madinah", order: 7 },
]

export const defaultZiyarat = (): string[] =>
  ziyaratOptions.filter((z) => z.preselect).map((z) => z.id)

/* A stop on the map, in visiting order. */
export type MapStop = {
  id: string
  lat: number
  lng: number
  label: L10n
  kind: "hub" | "ziyarat"
}

const hubStop = (id: PlaceId): MapStop => {
  const p = places.find((x) => x.id === id)!
  return { id: p.id, lat: p.lat, lng: p.lng, label: p.label, kind: "hub" }
}

const ziyaratStops = (city: "makkah" | "madinah", selected: readonly string[]): MapStop[] =>
  ziyaratOptions
    .filter((z) => z.city === city && selected.includes(z.id))
    .sort((a, b) => a.order - b.order)
    .map((z) => ({ id: z.id, lat: z.lat, lng: z.lng, label: z.label, kind: "ziyarat" as const }))

/** Dawra route: arrival → Makkah (+ziyarat) → Madinah (+ziyarat) → departure. */
export const buildDawraStops = (
  arrival: PlaceId,
  departure: PlaceId,
  selected: readonly string[],
  withZiyarat: boolean,
): MapStop[] => [
  hubStop(arrival),
  hubStop("makkah"),
  ...(withZiyarat ? ziyaratStops("makkah", selected) : []),
  hubStop("madinah"),
  ...(withZiyarat ? ziyaratStops("madinah", selected) : []),
  hubStop(departure),
]

export const buildTransferStops = (ids: readonly PlaceId[]): MapStop[] => ids.map(hubStop)

export const allHubStops = (): MapStop[] => places.map((p) => hubStop(p.id))
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
