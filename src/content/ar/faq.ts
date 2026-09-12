import type { FaqItem } from "../types"

export const faq: readonly FaqItem[] = [
  {
    id: "group-size",
    question: "ما هو الحد الأدنى لحجم المجموعة؟",
    answer:
      // TODO(content): confirm commercial minimums with client
      "تختلف حسب نوع الخدمة والموسم. تواصلوا معنا عبر النموذج أو واتساب لتحديد التفاصيل.",
  },
  {
    id: "fleet-types",
    question: "ما أنواع الحافلات المتوفرة؟",
    answer:
      "يتوفر أسطول يشمل بريميوم VIP وVIP وكوتش وسيتي وباص العمال والميني باص وفق كتالوج المعرض.",
  },
  {
    id: "safety",
    question: "ما معايير السلامة؟",
    answer:
      "تشمل الحافلات أنظمة سلامة وGPS وأنظمة فرامل متقدمة وفق مواصفات كل فئة.",
  },
] as const
