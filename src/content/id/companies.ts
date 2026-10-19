import type { Company } from "../types"

export const companies: readonly Company[] = [
  {
    slug: "transport",
    name: "Durrat Almunawwara Transport for Pilgrims",
    summary:
      "Melayani Tamu Allah adalah prioritas utama kami. Kami menyediakan transportasi darat terpadu untuk jemaah, pelajar, dan lembaga, penerimaan di bandara dan pelabuhan, antar-jemput salat, perjalanan ke Tempat Suci, serta rute staf, dengan armada modern dan standar operasional tinggi. Transportasi jemaah musim haji dikontrak melalui misi yang bertanggung jawab dan jalur elektronik.",
    services: [
      "Penerimaan di bandara & pelabuhan dari Bandara King Abdulaziz di Jeddah dan Bandara Prince Mohammad bin Abdulaziz di Madinah",
      "Antar-jemput salat ke Dua Masjid Suci sepanjang waktu",
      "Ziarah dan tur sejarah di Makkah dan Madinah",
      "Antar-jemput Tempat Suci antara Arafat, Muzdalifah, dan Mina",
      "Transportasi antarkota dan rute internasional ke Yaman (Marib, Mukalla, Aden)",
      "Mitra andal bagi Kementerian Pendidikan, sekolah, dan universitas, sabuk pengaman, pelacakan GPS langsung, dan pengemudi berkualifikasi",
      "Transportasi korporat dan karyawan dengan jadwal shift fleksibel, armada sesuai ukuran tim, serta cakupan kota industri dan kompleks residensial terpencil",
      "Kontrak misi haji melalui jalur elektronik",
    ],
    logo: "/brand/company-group.png",
    heroImage: "/fleet/coach-2025-2026/side.webp",
    contentReady: true,
  },
  {
    slug: "umrah-services",
    name: "Durrat Almunawwara Umrah Services",
    summary:
      "Dukungan umrah menyeluruh yang menyatukan visa, pemesanan hotel, dan transportasi premium agar kelompok bergerak melalui perjalanan yang jelas dan terkoordinasi.",
    services: [
      "Dukungan penerbitan visa umrah",
      "Pemesanan hotel dan akomodasi",
      "Transportasi dan logistik premium untuk program umrah",
      "Koordinasi program kelompok dengan transportasi dan perhotelan",
    ],
    logo: "/brand/company-umrah.png",
    heroImage: "/fleet/vip-2026/side.webp",
    contentReady: true,
  },
  {
    slug: "tourism",
    name: "Durrat Almunawwara Tourism Services",
    summary:
      "Pariwisata kelompok, konferensi, acara, dan transportasi VIP mewah untuk klien elite, delegasi diplomatik, dan eksekutif bisnis, dengan privasi, kapasitas cadangan, dan rencana penerimaan yang jelas.",
    services: [
      "Transportasi kelompok wisata",
      "Konferensi dan acara",
      "Acara pribadi dan pernikahan",
      "Transportasi mewah dan VIP dengan fitur kenyamanan premium",
      "Transfer bandara VIP",
      "Armada multi-bus untuk acara",
    ],
    logo: "/brand/company-tourism.png",
    heroImage: "/fleet/vip-2026/front.webp",
    contentReady: true,
  },
  {
    slug: "hospitality-catering",
    name: "Durrat Almunawwara Hospitality & Catering",
    summary:
      "Dukungan perhotelan dan katering untuk program haji dan umrah serta acara kelembagaan.",
    services: [
      "Katering kelompok",
      "Perhotelan lapangan",
      "Dukungan program haji dan umrah",
    ],
    logo: "/brand/company-hospitality.png",
    heroImage: "/fleet/vip-2026/interior-aisle.jpeg",
    contentReady: true,
  },
] as const
