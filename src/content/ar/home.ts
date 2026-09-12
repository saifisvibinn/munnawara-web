import type { HomeContent } from "../types"

export const home: HomeContent = {
  valueTitle: "نقل مصمم للرحلات المقدسة",
  valueIntro:
    "تنسّق مجموعة درة المنورة أسطولاً حديثاً وتشغيلاً دقيقاً وتواصلاً واضحاً ليشعر الحجاج والمؤسسات بالثقة في كل رحلة.",
  valueImage: "/fleet/premium-vip-2026/exterior/pv-out-1.webp",
  valueBullets: [
    {
      id: "safety",
      title: "السلامة أولاً",
      description: "تشغيل منضبط وسائقون مدربون لكل مهمة.",
    },
    {
      id: "licensed",
      title: "مجموعة منظمة",
      description: "شركات تابعة تحت مظلة علامة واحدة مسؤولة.",
    },
    {
      id: "fleet",
      title: "أسطول حديث",
      description: "حافلات حديثة عبر فئات VIP والمجموعات.",
    },
    {
      id: "tracked",
      title: "وضوح الرحلة",
      description: "تنسيق واضح من طلب العرض حتى تأكيد الرحلة.",
    },
  ],
  passbyEyebrow: "درة المنورة",
  passbyTitle: "كل رحلة… بترتيب وعناية",
  passbyTitleAfter: "من العرض إلى تأكيد المغادرة",
  howTitle: "كيف نعمل",
  howSubtitle: "ثلاث خطوات واضحة من الطلب إلى تأكيد النقل.",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "اطلب رحلتك",
      description:
        "شاركونا نوع الرحلة والمدن والتواريخ وعدد الركاب عبر نموذج العرض أو واتساب.",
      ctaLabel: "اطلب عرض سعر",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "احصل على عرض وخطة مؤكدة",
      description:
        "يعدّ فريقنا خطة واضحة للأسطول والتوقيت والخدمات المساندة.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "تأكيد الرحلة وتعيين الحافلة والسائق",
      description:
        "بعد الموافقة نعيّن المركبة ونبقي التنسيق مفتوحاً حتى المغادرة.",
      ctaLabel: "تواصل معنا",
      ctaHref: "/contact",
    },
  ],
  aboutEyebrow: "عن المجموعة",
  aboutCta: "اقرأ قصتنا",
  aboutImage: "/fleet/coach-2025-2026/cover.webp",
  testimonialsTitle: "ماذا يقول الشركاء",
  // TODO(content): replace once client provides approved testimonials
  testimonialsEmpty: "ستظهر شهادات العملاء هنا بعد اعتمادها للنشر.",
  newsTitle: "المستجدات",
  newsSubtitle: "ملاحظات موسمية وإعلانات المجموعة.",
  newsEmpty: "لا توجد أخبار منشورة حالياً — تابعونا قريباً.",
  faqTitle: "الأسئلة الشائعة",
  faqSubtitle: "إجابات سريعة للمجموعات والمؤسسات التي تخطط للنقل.",
}
