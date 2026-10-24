/**
 * Quote wizard content — everything that may change lives here.
 * Options mirror the production quote form.
 */

export type L10n = { en: string; ar: string; fr: string; id: string }

export type Option<T extends string = string> = {
  id: T
  label: L10n
  hint?: L10n
}

export const l = (en: string, ar: string, fr: string, id: string): L10n => ({
  en,
  ar,
  fr,
  id,
})

/* ---------- Step 1: who is asking ---------- */

export const customerOptions = [
  {
    id: "company",
    label: l("Company / Corporate", "شركة / مؤسسة", "Entreprise", "Perusahaan / Korporat"),
    hint: l(
      "Staff, events, and contracts",
      "نقل موظفين وفعاليات وعقود",
      "Personnel, événements et contrats",
      "Staf, acara, dan kontrak",
    ),
  },
  {
    id: "government",
    label: l("Government entity", "جهة حكومية", "Organisme public", "Instansi pemerintah"),
    hint: l(
      "Institutional and official transport",
      "نقل رسمي ومؤسسي",
      "Transport institutionnel et officiel",
      "Transportasi kelembagaan dan resmi",
    ),
  },
  {
    id: "school",
    label: l("School / University", "مدرسة / جامعة", "École / Université", "Sekolah / Universitas"),
    hint: l(
      "Student routes and trips",
      "مسارات ورحلات الطلاب",
      "Circuits et sorties d'élèves",
      "Rute dan perjalanan siswa",
    ),
  },
  {
    id: "hajj_mission",
    label: l("Umrah campaigns", "حملات عمرة", "Groupes de Omra", "Rombongan umrah"),
    hint: l(
      "Umrah campaign operators and offices",
      "مكاتب وحملات العمرة",
      "Organisateurs et agences de Omra",
      "Penyelenggara dan biro umrah",
    ),
  },
  {
    id: "tourism",
    label: l("Tourism company", "شركة سياحة", "Agence de tourisme", "Perusahaan pariwisata"),
    hint: l(
      "Tour groups and packages",
      "مجموعات وبرامج سياحية",
      "Groupes et circuits touristiques",
      "Rombongan dan paket wisata",
    ),
  },
] as const satisfies readonly Option[]

/* ---------- Step 2 (companies only): service ---------- */

export const corporateServices: readonly Option[] = [
  {
    id: "workers",
    label: l("V7 / staff transport", "نقل V7 والموظفين", "V7 / transport du personnel", "V7 / transportasi staf"),
  },
  {
    id: "education",
    label: l(
      "School / university transport",
      "نقل مدارس وجامعات",
      "Transport scolaire / universitaire",
      "Transportasi sekolah / universitas",
    ),
  },
  { id: "tourism_group", label: l("Tourism groups", "مجموعات سياحية", "Groupes touristiques", "Rombongan wisata") },
  {
    id: "events",
    label: l("Events & conferences", "فعاليات ومؤتمرات", "Événements et conférences", "Acara & konferensi"),
  },
  {
    id: "vip_airport",
    label: l(
      "VIP airport transfer",
      "استقبال كبار الزوار من المطار",
      "Transfert aéroport VIP",
      "Antar-jemput bandara VIP",
    ),
  },
  { id: "international", label: l("International routes", "رحلات دولية", "Trajets internationaux", "Rute internasional") },
  { id: "other", label: l("Something else", "طلب آخر", "Autre demande", "Lainnya") },
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
  airports: l("Airports", "المطارات", "Aéroports", "Bandara"),
  cities: l("Makkah & Madinah", "مكة والمدينة", "La Mecque et Médine", "Makkah & Madinah"),
  makkah: l("Holy sites in Makkah", "المزارات في مكة", "Lieux saints de La Mecque", "Tempat suci di Makkah"),
  madinah: l("Holy sites in Madinah", "المزارات في المدينة", "Lieux saints de Médine", "Tempat suci di Madinah"),
}

const place = (
  id: string,
  group: PlaceGroup,
  label: L10n,
  lat: number,
  lng: number,
): Place => ({ id, group, label, lat, lng })

export const places: readonly Place[] = [
  place("jed_airport", "airports", l("Jeddah Airport (JED)", "مطار جدة (JED)", "Aéroport de Djeddah (JED)", "Bandara Jeddah (JED)"), 21.67944, 39.15667),
  place("med_airport", "airports", l("Madinah Airport (MED)", "مطار المدينة (MED)", "Aéroport de Médine (MED)", "Bandara Madinah (MED)"), 24.55333, 39.705),
  place("tif_airport", "airports", l("Taif Airport (TIF)", "مطار الطائف (TIF)", "Aéroport de Taëf (TIF)", "Bandara Taif (TIF)"), 21.48333, 40.54444),
  place("ynb_airport", "airports", l("Yanbu Airport (YNB)", "مطار ينبع (YNB)", "Aéroport de Yanbu (YNB)", "Bandara Yanbu (YNB)"), 24.14417, 38.06333),
  place("ula_airport", "airports", l("AlUla Airport (ULH)", "مطار العلا (ULH)", "Aéroport d'AlUla (ULH)", "Bandara AlUla (ULH)"), 26.48333, 38.12806),
  place("ruh_airport", "airports", l("Riyadh Airport (RUH)", "مطار الرياض (RUH)", "Aéroport de Riyad (RUH)", "Bandara Riyadh (RUH)"), 24.95764, 46.69878),
  place("dmm_airport", "airports", l("Dammam Airport (DMM)", "مطار الدمام (DMM)", "Aéroport de Dammam (DMM)", "Bandara Dammam (DMM)"), 26.47117, 49.79789),

  place("makkah", "cities", l("Makkah", "مكة المكرمة", "La Mecque", "Makkah"), 21.4225, 39.82611),
  place("madinah", "cities", l("Madinah", "المدينة المنورة", "Médine", "Madinah"), 24.46833, 39.61083),

  place("makkah_ziyarat", "makkah", l("Makkah Ziyarat tour", "مكة - مزارات", "Ziyarat à La Mecque", "Tur ziarah Makkah"), 21.4225, 39.82611),
  place("hudaybiyah", "makkah", l("Miqat al-Hudaybiyah", "مكة - ميقات الحديبية", "Miqat d'al-Hudaybiyah", "Miqat al-Hudaibiyah"), 21.43, 39.68),
  place("jiranah", "makkah", l("Miqat al-Ja'ranah", "مكة - ميقات الجعرانة", "Miqat d'al-Ja'ranah", "Miqat al-Ji'ranah"), 21.5333, 40.0),
  place("tanim", "makkah", l("Miqat al-Tan'im (Masjid Aisha)", "مكة - ميقات التنعيم", "Miqat d'al-Tan'im (mosquée Aïcha)", "Miqat Tan'im (Masjid Aisyah)"), 21.46771, 39.80137),
  place("taif_tour", "makkah", l("Taif tour", "مكة - جولة الطائف", "Excursion à Taëf", "Tur Taif"), 21.2703, 40.4158),
  place("hira", "makkah", l("Jabal al-Nour & Cave of Hira", "جبل النور وغار حراء", "Jabal al-Nour et grotte de Hira", "Jabal Nur & Gua Hira"), 21.45806, 39.86139),
  place("thawr", "makkah", l("Jabal Thawr", "جبل ثور", "Jabal Thawr", "Jabal Tsur"), 21.377, 39.84987),
  place("mina", "makkah", l("Mina", "منى", "Mina", "Mina"), 21.41333, 39.89333),
  place("muzdalifah", "makkah", l("Muzdalifah", "مزدلفة", "Muzdalifa", "Muzdalifah"), 21.3925, 39.93778),
  place("arafat", "makkah", l("Mount Arafat", "جبل عرفات", "Mont Arafat", "Jabal Arafah"), 21.35472, 39.98389),

  place("madinah_ziyarat", "madinah", l("Madinah Ziyarat tour", "المدينة - مزارات", "Ziyarat à Médine", "Tur ziarah Madinah"), 24.46833, 39.61083),
  place("mushaf", "madinah", l("Mushaf Printing Complex", "المدينة - مطبعة المصحف", "Complexe d'impression du Coran", "Kompleks Percetakan Al-Qur'an"), 24.563, 39.539),
  place("quba", "madinah", l("Quba Mosque", "مسجد قباء", "Mosquée de Quba", "Masjid Quba"), 24.43917, 39.61722),
  place("qiblatayn", "madinah", l("Masjid al-Qiblatayn", "مسجد القبلتين", "Mosquée al-Qiblatayn", "Masjid Qiblatain"), 24.48409, 39.57891),
  place("khandaq", "madinah", l("Seven Mosques (Al-Khandaq)", "المساجد السبعة (الخندق)", "Les Sept Mosquées (Al-Khandaq)", "Masjid Tujuh (Khandaq)"), 24.47673, 39.59602),
  place("ghamama", "madinah", l("Masjid al-Ghamama", "مسجد الغمامة", "Mosquée al-Ghamama", "Masjid Ghamamah"), 24.46581, 39.60696),
  place("baqi", "madinah", l("Al-Baqi Cemetery", "مقبرة البقيع", "Cimetière d'Al-Baqi", "Pemakaman Baqi"), 24.4669, 39.6164),
  place("uhud", "madinah", l("Mount Uhud & the Martyrs' Cemetery", "جبل أحد ومقبرة الشهداء", "Mont Uhud et cimetière des Martyrs", "Jabal Uhud & Makam Syuhada"), 24.5, 39.61),
  place("badr", "madinah", l("Badr (full-day trip)", "بدر (رحلة يوم كامل)", "Badr (excursion d'une journée)", "Badar (perjalanan sehari penuh)"), 23.73333, 38.76667),
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
  { id: "vip", label: l("VIP", "في آي بي", "VIP", "VIP"), hint: l("28 seats", "٢٨ مقعد", "28 places", "28 kursi") },
  {
    id: "premium_vip",
    label: l("Premium VIP", "بريميوم في آي بي", "VIP Premium", "VIP Premium"),
    hint: l("18 seats", "١٨ مقعد", "18 places", "18 kursi"),
  },
  { id: "standard", label: l("Coach", "كوتش", "Autocar", "Bus coach"), hint: l("49 seats", "٤٩ مقعد", "49 places", "49 kursi") },
  { id: "coach", label: l("City bus", "سيتي باص", "Bus urbain", "Bus kota"), hint: l("45 seats", "٤٥ مقعد", "45 places", "45 kursi") },
  {
    id: "city_large",
    label: l("City bus", "سيتي باص", "Bus urbain", "Bus kota"),
    hint: l("45 + standing", "٤٥ مع وقوف", "45 + places debout", "45 + berdiri"),
  },
  { id: "city", label: l("Coaster", "كوستر", "Coaster", "Coaster"), hint: l("28 seats", "٢٨ مقعد", "28 places", "28 kursi") },
  {
    id: "employee",
    label: l("V7 / staff", "V7 / موظفين", "V7 / personnel", "V7 / staf"),
    hint: l("41 seats", "٤١ مقعد", "41 places", "41 kursi"),
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

export const pick = (text: L10n, locale: string) => {
  if (locale === "ar") return text.ar
  if (locale === "fr") return text.fr ?? text.en
  if (locale === "id") return text.id ?? text.en
  return text.en
}

export const findOption = <T extends Option>(list: readonly T[], id: string) =>
  list.find((o) => o.id === id)

export const placeLabel = (id: string, locale: string) => {
  const p = places.find((x) => x.id === id)
  return p ? pick(p.label, locale) : id
}
