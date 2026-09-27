import type { CareRevealContent } from "../types"

export const careReveal: CareRevealContent = {
  eyebrow: "منورة كير",
  headingLines: ["نسافر معاً.", "ونبقى على تواصل."],
  body:
    "منورة كير خدمة داعمة لضيوف الرحمن تشمل الإرشاد والمعلومات الصحية وطلب المساعدة ومشاركة الموقع وحفظ بيانات الفندق والغرفة بحسب نطاق البرنامج المتعاقد عليه — لتنسيق المجموعة من نقطة التجمع حتى العودة بأمان.",
  benefits: [
    {
      id: "aligned",
      icon: "group",
      label: "إرشاد وخطط مشتركة ليتحرك الجميع معاً",
    },
    {
      id: "reachable",
      icon: "signal",
      label: "طلب المساعدة وتحديثات في الوقت المناسب",
    },
    {
      id: "accounted",
      icon: "shield",
      label: "مشاركة الموقع والمحاسبة من التجمع حتى العودة",
    },
    {
      id: "journey",
      icon: "route",
      label: "بيانات الفندق والغرفة ضمن نطاق البرنامج",
    },
  ],
}
