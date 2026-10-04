import type { AboutContent } from "../types"

export const about: AboutContent = {
  title: "نبذة عن مجموعة درة المنورة",
  intro:
    "مجموعة درة المنورة تمثل واحدة من الشركات البارزة في المملكة العربية السعودية، حيث تتمتع بخبرة تزيد عن 10 سنوات في تقديم مجموعة شاملة من خدمات قطاع السفر والسياحة، تهدف الشركة إلى تلبية احتياجات ورغبات الأفراد والمجموعات في التنقل والاستمتاع بتجارب سياحية ودينية متكاملة",
  historyTitle: "مسيرتنا",
  history:
    // TODO(content): replace with client-approved history / years narrative
    "نعمل على تقديم أسطول حديث وخدمات تشغيل موثوقة لخدمة الحجاج والمعتمرين والمؤسسات.",
  missionTitle: "رسالتنا",
  mission:
    "تمكين رحلة آمنة ومريحة عبر أسطول منظم ومعايير سلامة وتشغيل عالية.",
  licensingNote: null,
  film: {
    brandName: "درة المنورة",
    journeyHeadline: "كل رحلة أجمل حين لا يسافر أحد بمفرده.",
    journeySupport:
      "قصة متصلة لتنقل منظم، من الطريق المفتوح إلى المجموعات التي تسير معنا.",
    worldHeadline: "رحلات منظمة على مسارات مقدسة.",
    worldBody:
      "يتحرك الحجاج والمؤسسات والمسافرون معاً عبر المملكة. التنسيق ليس خياراً. إنه الرحلة نفسها.",
    problemHeadline: "إبقاء المجموعة معاً أصعب مما يبدو.",
    problemLines: [
      "أين الجميع؟",
      "أين نلتقي؟",
      "هل الأسطول جاهز؟",
      "ماذا يحدث عند تغيّر الخطط؟",
    ],
    connectionHeadline: "ثم يجد كل شيء مكانه.",
    connectionBody:
      "تجمع درة المنورة النقل وخدمات العمرة والسياحة والضيافة تحت مجموعة واحدة مسؤولة، لتبقى الرحلات واضحة من الطلب حتى العودة.",
    fleetHeadline: "أسطول حديث، بقيادة واعية.",
    fleetBody:
      "حافلات VIP ونقل جماعي ونقل مدني، مركبات حديثة مهيأة للمسارات المقدسة والتنقل المؤسسي.",
    fleetBeats: [
      { id: "vip", line: "حافلات VIP فاخرة" },
      { id: "group", line: "نقل جماعي للحجاج" },
      { id: "city", line: "مسارات المدينة والموظفين" },
      { id: "ops", line: "تشغيل منضبط" },
    ],
    sidesLeft: "الحجاج والضيوف",
    sidesRight: "المشغّلون والمؤسسات",
    sidesMerge: "مجموعة واحدة. معيار واحد من العناية.",
    detailsHeadline: "ما نحمله مع كل رحلة",
    detailsImageNote: "صور توضيحية مؤقتة.",
    details: [
      { id: "airport", line: "استقبال المطار، جاهز." },
      { id: "holy", line: "رحلات المشاعر، مرتبة." },
      { id: "intercity", line: "مسارات بين المدن، واضحة." },
      { id: "events", line: "الفعاليات والمجموعات، مغطاة." },
    ],
    humanLine1: "المركبات يجب ألا تكون محور الرحلة.",
    humanLine2: "الناس هم المحور.",
    videoHeadline: "نظرة من وراء الكواليس",
    videoLabel: "فيديو: الورشة ومستودع قطع الغيار ومقصورات الحافلات والفريق.",
    brandLine: "درة المنورة",
    futureHeadline: "صُممت لما يأتي من الرحلة.",
    futureBody:
      "تشغيل هادئ لسفر حقيقي، لتتحرك كل مجموعة بثقة في كل ميل.",
    ctaHeadline: "أينما أخذتك الرحلة،\nسافر بعناية.",
    ctaBody: "ابدأ بطلب هادئ، ونتولى الباقي.",
    ctaLabel: "اطلب عرض سعر",
    ctaHref: "/quote",
    companies: [
      {
        id: "transport",
        name: "النقل",
        logo: "/brand/company-group.png",
      },
      {
        id: "umrah",
        name: "خدمات العمرة",
        logo: "/brand/company-umrah.png",
      },
      {
        id: "tourism",
        name: "السياحة",
        logo: "/brand/company-tourism.png",
      },
      {
        id: "hospitality",
        name: "الضيافة",
        logo: "/brand/company-hospitality.png",
      },
    ],
  },
}
