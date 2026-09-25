import type { HomeContent } from "../types"

export const home: HomeContent = {
  landingHero: {
    eyebrow: "درة المنورة للنقل",
    line1: "ننقلك",
    line2: "إلى الأمام",
    sub: "رحلات راقية، تُقاد بعناية في كل ميل.",
    cta: "استكشف خدماتنا",
    scrollHint: "مرّر للدخول",
    brandWords: ["DURRAH", "AL", "MUNAWWARA", "TRANSPORTATION"],
    backTop: "درة المنورة — العودة للأعلى",
    chatAria: "محادثة مع درة المنورة",
    chatWith: "تحدث مع",
    chatAi: "الذكاء",
    brand: "DMTC",
  },
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
  howStepPrefix: "الخطوة",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "اطلب رحلتك وانتظر المتابعة،",
      description:
        "شاركونا نوع الرحلة والمدن والتواريخ وعدد الركاب عبر نموذج العرض أو واتساب. يراجع فريقنا الطلب ويعدّ خيارات واضحة.",
      ctaLabel: "اطلب عرض سعر",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "اختر الأنسب لمجموعتك.",
      description:
        "نرسل عرضاً وخطة مؤكدة تشمل الأسطول والتوقيت والخدمات المساندة لتقرروا بثقة.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "تأكيد الرحلة.",
      description:
        "بعد الموافقة نعيّن الحافلة والسائق ونبقي التنسيق مفتوحاً حتى المغادرة.",
      ctaLabel: "تواصل معنا",
      ctaHref: "/contact",
    },
  ],
  aboutEyebrow: "عن المجموعة",
  aboutCta: "اقرأ قصتنا",
  aboutSecondaryCta: "تواصل معنا",
  aboutSocialCta: "تابعوا @dmtcSA",
  aboutImage: "/hero/landing-sky.jpg",
  aboutHeadlineLines: [
    "رحلات آمنة ومريحة.",
    "أسطول منظم. معايير واضحة.",
  ],
  quoteEyebrow: "خطّط لرحلتك",
  quoteHeadline: "استرخوا. نحن نرتّب الباقي.",
  quoteBody:
    "شاركوا نوع الرحلة والمدن والتواريخ وعدد الركاب. يتابعكم فريقنا بخيارات واضحة.",
  testimonialsTitle: "شركاؤنا",
  testimonialsSubtitle:
    "نقل منظم للحملات والمؤسسات والمهام الرسمية.",
  testimonialsCta: "تواصل معنا",
  // TODO(content): replace once client provides approved testimonials
  testimonialsEmpty: "ستظهر شهادات العملاء هنا بعد اعتمادها للنشر.",
  newsTitle: "اقرأ عن المجموعة",
  newsSubtitle:
    "ملاحظات موسمية وتحديثات الأسطول وإعلانات من درة المنورة.",
  newsEmpty: "لا توجد أخبار منشورة حالياً — تابعونا قريباً.",
  faqTitle: "الأسئلة الشائعة",
  faqSubtitle: "إجابات على أكثر ما تسأله المجموعات والمؤسسات.",
  faqCta: "تواصل معنا",
  ctaBandEyebrow: "تجربة نقل منظم لم تعهدوها من قبل",
  ctaBandTitle: "استرخوا، نحن نرتّب الباقي.",
  ctaBandSubtitle:
    "شاركوا تفاصيل رحلتكم وسيتابعكم فريقنا بخيارات واضحة.",
}
