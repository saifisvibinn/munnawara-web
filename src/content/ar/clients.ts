import type { ClientCategory } from "../types"

// Category-level only until client permits named logos
export const clients: readonly ClientCategory[] = [
  {
    id: "hajj-umrah-operators",
    label: "منظمو حملات الحج والعمرة",
    description: "نقل ودعم تشغيلي للمجموعات والحملات.",
  },
  {
    id: "corporate",
    label: "الشركات والمؤسسات",
    description: "نقل الموظفين والطلاب والفرق العاملة.",
  },
  {
    id: "government",
    label: "الجهات الحكومية والدبلوماسية",
    description: "ترتيبات نقل رسمية وفق الطلب.",
  },
] as const
