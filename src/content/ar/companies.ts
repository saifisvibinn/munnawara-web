import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "شركة درة المنورة لنقل الحجاج والمعتمرين",
    summary:
      "أسطول حديث لنقل الحجاج والمعتمرين والموظفين والطلاب، مع الاستقبال من المطار والنقل بين المدن ورحلة المشاعر والنقل الدولي إلى اليمن (مأرب والمكلا وعدن). تعاقد نقل الحجاج في موسم الحج يتم عبر البعثة والمسار الإلكتروني.",
    services: [
      "الاستقبال من المطار",
      "النقل بين المدن",
      "رحلة المشاعر المقدسة",
      "النقل الدولي (اليمن: مأرب، المكلا، عدن)",
      "نقل الموظفين والطلاب",
      "تعاقد بعثات الحج عبر المسار الإلكتروني",
    ],
    logo: "/brand/company-group.png",
    heroImage: "/fleet/coach-2025-2026/cover.webp",
    contentReady: true,
  },
  {
    slug: "umrah-services",
    name: "شركة درة المنورة لخدمات العمرة",
    summary:
      "خدمات مساندة لرحلة العمرة بالتنسيق مع النقل والضيافة لتسهيل تجربة المعتمرين.",
    services: [
      "تنسيق برامج العمرة",
      "الدعم اللوجستي للمجموعات",
      "التنسيق مع الفنادق والنقل",
    ],
    logo: "/brand/company-umrah.png",
    heroImage: "/hero/cover.png",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "شركة درة المنورة للخدمات السياحية",
    summary:
      "نقل المجموعات السياحية والمؤتمرات والفعاليات والحجوزات الخاصة، مع خطط استقبال وحافلات احتياط وخيارات VIP للمطار حسب السعة.",
    services: [
      "نقل المجموعات السياحية",
      "المؤتمرات والفعاليات",
      "المناسبات والحفلات الخاصة",
      "نقل مطار VIP",
      "أسطول متعدد الحافلات للفعاليات",
    ],
    logo: "/brand/company-tourism.png",
    heroImage: "/hero/cover.png",
    contentReady: true,
  },
  {
    slug: "hospitality-catering",
    name: "شركة درة المنورة للضيافة والتموين",
    summary:
      "خدمات ضيافة وتموين مساندة لبرامج الحج والعمرة والمناسبات المؤسسية.",
    services: [
      "تموين المجموعات",
      "خدمات ضيافة ميدانية",
      "دعم برامج الحج والعمرة",
    ],
    logo: "/brand/company-hospitality.png",
    heroImage: "/fleet/premium-vip-2026/exterior/pv-col.webp",
    contentReady: true,
  },
] as const
