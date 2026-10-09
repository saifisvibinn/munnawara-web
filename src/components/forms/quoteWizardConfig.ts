/**
 * Quote wizard content — everything that may change lives here.
 * Options mirror the production quote form.
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
    label: l("Umrah campaigns", "حملات عمرة"),
    hint: l("Umrah campaign operators and offices", "مكاتب وحملات العمرة"),
  },
  {
    id: "tourism",
    label: l("Tourism company", "شركة سياحة"),
    hint: l("Tour groups and packages", "مجموعات وبرامج سياحية"),
  },
] as const satisfies readonly Option[]

/* ---------- Step 2 (companies only): service ---------- */

export const corporateServices: readonly Option[] = [
  {
    id: "workers",
    label: l("Workers / staff transport", "نقل العمال والموظفين"),
  },
  { id: "education", label: l("School / university transport", "نقل مدارس وجامعات") },
  { id: "tourism_group", label: l("Tourism groups", "مجموعات سياحية") },
  { id: "events", label: l("Events & conferences", "فعاليات ومؤتمرات") },
  { id: "vip_airport", label: l("VIP airport transfer", "استقبال كبار الزوار من المطار") },
  { id: "international", label: l("International routes", "رحلات دولية") },
  { id: "other", label: l("Something else", "طلب آخر") },
]

/*
 * ---------- Locations ----------
 * Airports, Makkah, Madinah and the holy sites carried over from the previous
 * wizard are verified against Wikipedia / OpenStreetMap. Taif, the miqats, the
 * generic "ziyarat tour" entries and the Mushaf complex are approximate map
 * pins: they only place the marker.
 */

export type PlaceGroup = "airports" | "cities" | "makkah" | "madinah"

export type Place = Option & { lat: number; lng: number; group: PlaceGroup }

export const placeGroups: Record<PlaceGroup, L10n> = {
  airports: l("Airports", "المطارات"),
  cities: l("Makkah & Madinah", "مكة والمدينة"),
  makkah: l("Holy sites in Makkah", "المزارات في مكة"),
  madinah: l("Holy sites in Madinah", "المزارات في المدينة"),
}

const place = (
  id: string,
  group: PlaceGroup,
  en: string,
  ar: string,
  lat: number,
  lng: number,
): Place => ({ id, group, label: l(en, ar), lat, lng })

export const places: readonly Place[] = [
  place("jed_airport", "airports", "Jeddah Airport (JED)", "مطار جدة (JED)", 21.67944, 39.15667),
  place("med_airport", "airports", "Madinah Airport (MED)", "مطار المدينة (MED)", 24.55333, 39.705),
  place("tif_airport", "airports", "Taif Airport (TIF)", "مطار الطائف (TIF)", 21.48333, 40.54444),
  place("ynb_airport", "airports", "Yanbu Airport (YNB)", "مطار ينبع (YNB)", 24.14417, 38.06333),
  place("ula_airport", "airports", "AlUla Airport (ULH)", "مطار العلا (ULH)", 26.48333, 38.12806),
  place("ruh_airport", "airports", "Riyadh Airport (RUH)", "مطار الرياض (RUH)", 24.95764, 46.69878),
  place("dmm_airport", "airports", "Dammam Airport (DMM)", "مطار الدمام (DMM)", 26.47117, 49.79789),

  place("makkah", "cities", "Makkah", "مكة المكرمة", 21.4225, 39.82611),
  place("madinah", "cities", "Madinah", "المدينة المنورة", 24.46833, 39.61083),

  place("makkah_ziyarat", "makkah", "Makkah Ziyarat tour", "مكة - مزارات", 21.4225, 39.82611),
  place("hudaybiyah", "makkah", "Miqat al-Hudaybiyah", "مكة - ميقات الحديبية", 21.43, 39.68),
  place("jiranah", "makkah", "Miqat al-Ja'ranah", "مكة - ميقات الجعرانة", 21.5333, 40.0),
  place("tanim", "makkah", "Miqat al-Tan'im (Masjid Aisha)", "مكة - ميقات التنعيم", 21.46771, 39.80137),
  place("taif_tour", "makkah", "Taif tour", "مكة - جولة الطائف", 21.2703, 40.4158),
  place("hira", "makkah", "Jabal al-Nour & Cave of Hira", "جبل النور وغار حراء", 21.45806, 39.86139),
  place("thawr", "makkah", "Jabal Thawr", "جبل ثور", 21.377, 39.84987),
  place("mina", "makkah", "Mina", "منى", 21.41333, 39.89333),
  place("muzdalifah", "makkah", "Muzdalifah", "مزدلفة", 21.3925, 39.93778),
  place("arafat", "makkah", "Mount Arafat", "جبل عرفات", 21.35472, 39.98389),

  place("madinah_ziyarat", "madinah", "Madinah Ziyarat tour", "المدينة - مزارات", 24.46833, 39.61083),
  place("mushaf", "madinah", "Mushaf Printing Complex", "المدينة - مطبعة المصحف", 24.563, 39.539),
  place("quba", "madinah", "Quba Mosque", "مسجد قباء", 24.43917, 39.61722),
  place("qiblatayn", "madinah", "Masjid al-Qiblatayn", "مسجد القبلتين", 24.48409, 39.57891),
  place("khandaq", "madinah", "Seven Mosques (Al-Khandaq)", "المساجد السبعة (الخندق)", 24.47673, 39.59602),
  place("ghamama", "madinah", "Masjid al-Ghamama", "مسجد الغمامة", 24.46581, 39.60696),
  place("baqi", "madinah", "Al-Baqi Cemetery", "مقبرة البقيع", 24.4669, 39.6164),
  place("uhud", "madinah", "Mount Uhud & the Martyrs' Cemetery", "جبل أحد ومقبرة الشهداء", 24.5, 39.61),
  place("badr", "madinah", "Badr (full-day trip)", "بدر (رحلة يوم كامل)", 23.73333, 38.76667),
]

/** A stop on the map, in visiting order. */
export type MapStop = {
  id: string
  lat: number
  lng: number
  label: L10n
  kind: "hub" | "ziyarat"
}

export const placeStop = (id: string): MapStop | null => {
  const p = places.find((x) => x.id === id)
  if (!p) return null
  const hub = p.group === "airports" || p.group === "cities"
  return { id: p.id, lat: p.lat, lng: p.lng, label: p.label, kind: hub ? "hub" : "ziyarat" }
}

export const allHubStops = (): MapStop[] =>
  places.flatMap((p) => (p.group === "airports" || p.group === "cities" ? [placeStop(p.id)!] : []))

/* ---------- Fleet ---------- */

export const busClassOptions = [
  { id: "vip", label: l("VIP", "في آي بي"), hint: l("32 seats", "٣٢ مقعد") },
  { id: "premium_vip", label: l("Premium VIP", "بريميوم في آي بي"), hint: l("18 seats", "١٨ مقعد") },
  { id: "standard", label: l("Standard", "عادية"), hint: l("49 seats", "٤٩ مقعد") },
  { id: "coach", label: l("Coach", "حافلة ٤٥"), hint: l("45 seats", "٤٥ مقعد") },
  { id: "city_large", label: l("City bus 55", "حافلة مدينة ٥٥"), hint: l("55 seats", "٥٥ مقعد") },
  { id: "city", label: l("City bus", "حافلة مدينة"), hint: l("19 seats", "١٩ مقعد") },
  {
    id: "employee",
    label: l("Staff transport", "نقل موظفين"),
    hint: l("48 & 60 seats", "٤٨ و٦٠ مقعد"),
  },
] as const satisfies readonly Option[]

export type BusClassId = (typeof busClassOptions)[number]["id"]

/** Cut-out photo per class (public/quotes). The two "city" files are named opposite to their fleet years. */
export const busClassImages: Record<BusClassId, string> = {
  vip: "/quotes/vip_bus-removebg-preview.png",
  premium_vip: "/quotes/premium_vip-removebg-preview.png",
  standard: "/quotes/COACH_BUS-removebg-preview.png",
  coach: "/quotes/city_bus_2025-removebg-preview.png",
  city_large: "/quotes/CITY_BUS-removebg-preview.png",
  city: "/quotes/mini_bus-removebg-preview.png",
  employee: "/quotes/labour-removebg-preview.png",
}

/** Fleet page category id → quote wizard bus class (for /quote?bus=…). */
export const fleetCategoryToBusClass: Record<string, BusClassId> = {
  "premium-vip-2026": "premium_vip",
  "vip-2026": "vip",
  "coach-2025-2026": "standard",
  "city-2025": "city_large",
  "labour-2024": "employee",
  "coaster-2026": "city",
}

export const resolveQuoteBusClass = (raw: string | undefined | null): BusClassId | null => {
  if (!raw) return null
  if (busClassOptions.some((o) => o.id === raw)) return raw as BusClassId
  return fleetCategoryToBusClass[raw] ?? null
}

/* ---------- Helpers ---------- */

export const pick = (text: L10n, locale: string) => (locale === "ar" ? text.ar : text.en)

export const findOption = <T extends Option>(list: readonly T[], id: string) =>
  list.find((o) => o.id === id)

export const placeLabel = (id: string, locale: string) => {
  const p = places.find((x) => x.id === id)
  return p ? pick(p.label, locale) : id
}
