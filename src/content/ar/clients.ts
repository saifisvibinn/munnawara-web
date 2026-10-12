import type { ClientCategory } from "../types"

/** تصنيفات قطاعية مطابقة لجدار شعارات العملاء الرسمي. */
export const clients: readonly ClientCategory[] = [
  {
    id: "hajj-umrah-operators",
    label: "مشغّلو الحج والعمرة",
    description: "حملات وشركات عمرة داخل المملكة وفي الأسواق الدولية.",
  },
  {
    id: "corporate",
    label: "الشركات والمؤسسات",
    description: "شركاء نقل الموظفين والمدارس والقوى العاملة والقطاع الخاص.",
  },
  {
    id: "government",
    label: "الجهات الحكومية والتعليم",
    description:
      "ترتيبات نقل رسمية تشمل برامج وزارة التعليم والتكليفات المؤسسية.",
  },
] as const
