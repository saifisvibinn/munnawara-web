import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "شركة درة المنورة لنقل الحجاج والمعتمرين",
    summary:
      "أسطول حديث لنقل الحجاج والمعتمرين والموظفين والطلاب، مع خدمات الاستقبال من المطار والنقل بين المدن ورحلة المشاعر.",
    services: [
      "الاستقبال من المطار",
      "النقل بين المدن",
      "رحلة المشاعر المقدسة",
      "النقل الدولي",
      "نقل الموظفين والطلاب",
    ],
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
    heroImage: "/hero/cover.png",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "شركة درة المنورة للخدمات السياحية",
    // TODO(content): Tourism subsidiary — blocked until client provides real services copy
    summary: null,
    services: [],
    heroImage: "/hero/cover.png",
    contentReady: false,
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
    heroImage: "/fleet/premium-vip-2026/exterior/pv-col.webp",
    contentReady: true,
  },
] as const
