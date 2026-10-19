import type { HomeContent } from "../types"

export const home: HomeContent = {
  landingHero: {
    eyebrow: "Durrat Almunawwara Co.",
    lines: ["Bergerak", "dengan penuh perhatian", "bagi para tamu"],
    sub: "Solusi operasional dan transportasi terpadu di dalam dan di luar Kerajaan, untuk jemaah dan lembaga, didukung armada modern dan jaringan operasional lengkap.",
    primaryCta: "Minta transportasi",
    secondaryCta: "Jelajahi armada kami",
    brandWords: ["Durrat", "Almunawwara", "Co."],
    backTop: "Durrat Almunawwara Co., kembali ke atas",
    chatAria: "Obrolan dengan Durrat Almunawwara Co.",
  },
  valueTitle: "Transportasi untuk perjalanan suci",
  valueIntro:
    "Durrat Almunawwara Co. mengoordinasikan bus modern, operasional yang cermat, dan komunikasi yang jelas agar jemaah dan lembaga bepergian dengan percaya diri.",
  valueImage: "/fleet/vip-2026/side.webp",
  valueBullets: [
    {
      id: "safety",
      title: "Keselamatan utama",
      description: "Setiap penugasan dimulai dengan kendaraan aman, pengemudi terlatih, dan operasional yang disiplin.",
    },
    {
      id: "commitment",
      title: "Komitmen & kualitas",
      description: "Standar yang jelas dan pengiriman andal bagi mitra pemerintah dan swasta.",
    },
    {
      id: "hospitality",
      title: "Keramahtamahan & profesionalisme",
      description: "Layanan penuh hormat bagi Tamu Allah, karyawan, pelajar, dan delegasi formal.",
    },
    {
      id: "innovation",
      title: "Inovasi & operasional",
      description: "Teknologi cerdas dan perbaikan berkelanjutan di seluruh armada dan ruang kontrol.",
    },
  ],
  passbyEyebrow: "Durrat Almunawwara Co.",
  passbyTitle: "Anda pilih tujuan",
  passbyTitleAfter: "kami antar Anda dengan selamat",
  howTitle: "Cara kerjanya",
  howSubtitle: "Tiga langkah jelas dari permintaan hingga transportasi terkonfirmasi.",
  howStepPrefix: "Langkah",
  howSteps: [
    {
      id: "request",
      number: "01",
      title: "Ceritakan perjalanan Anda… dan kami yang mengurus sisanya",
      description:
        "Sampaikan jenis perjalanan, tujuan, tanggal, dan jumlah penumpang melalui formulir “Minta penawaran” atau via WhatsApp. Tim kami akan menghubungi Anda dengan opsi yang paling sesuai untuk perjalanan Anda.",
      ctaLabel: "Minta penawaran",
      ctaHref: "#quote",
    },
    {
      id: "quote",
      number: "02",
      title: "Kami siapkan opsi yang paling cocok untuk Anda",
      description:
        "Kami menawarkan berbagai opsi dan layanan istimewa, sehingga Anda dapat memilih yang paling sesuai dengan perjalanan Anda.",
      ctaLabel: null,
      ctaHref: null,
    },
    {
      id: "confirm",
      number: "03",
      title: "Kami konfirmasi perjalanan Anda dan atur setiap detail",
      description:
        "Setelah Anda menyetujui penawaran, kami menyiapkan bus yang tepat dan mengoordinasikan detail perjalanan agar semuanya siap pada waktu yang dijadwalkan.",
      ctaLabel: "Hubungi kami",
      ctaHref: "/contact",
    },
  ],
  aboutEyebrow: "Tentang grup",
  aboutCta: "Baca kisah kami",
  aboutSecondaryCta: "Hubungi kami",
  aboutSocialCta: "Ikuti @dmtcSA",
  aboutImage: "/hero/landing-sky.jpg",
  aboutHeadlineLines: [
    "Perjalanan aman dan nyaman.",
    "Armada terorganisir. Standar jelas.",
  ],
  quoteEyebrow: "Ceritakan jalannya.",
  quoteHeadline: "Duduk tenang. Kami yang mengoordinasikan sisanya.",
  quoteBody:
    "Sampaikan jenis perjalanan, kota, tanggal, dan jumlah penumpang. Tim kami menindaklanjuti dengan opsi yang jelas.",
  testimonialsTitle: "Mitra yang kami layani",
  testimonialsSubtitle:
    "Transportasi terorganisir untuk kampanye, lembaga, dan penugasan formal.",
  testimonialsCta: "Hubungi kami",
  testimonialsViewMore: "Lihat selengkapnya",
  // TODO(content): ganti setelah klien menyediakan testimoni yang disetujui
  testimonialsEmpty: "Testimoni klien akan muncul di sini setelah disetujui untuk dipublikasikan.",
  newsTitle: "Baca tentang grup",
  newsSubtitle:
    "Catatan musiman, pembaruan armada, dan pengumuman dari Durrat Almunawwara Co.",
  newsEmpty: "Belum ada berita. Silakan cek lagi nanti.",
  faqTitle: "FAQ",
  faqSubtitle: "Jawaban atas pertanyaan yang paling sering diajukan kelompok dan lembaga.",
  faqCta: "Hubungi kami",
  ctaBandEyebrow: "Dari permintaan ke jalan.",
  ctaBandTitle: "Duduk tenang, kami yang mengoordinasikan sisanya.",
  ctaBandSubtitle:
    "Bagikan detail perjalanan Anda dan tim kami akan menindaklanjuti dengan opsi yang jelas.",
}
