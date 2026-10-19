import type { FaqItem } from "../types"

export const faq: readonly FaqItem[] = [
  {
    id: "hajj-contract",
    question: "Bagaimana transportasi haji dipesan?",
    answer:
      "Selama musim haji, transportasi jemaah dikontrak melalui misi yang bertanggung jawab dan didaftarkan pada jalur elektronik, bukan sebagai pemesanan langsung jemaah ke perusahaan. Pembayaran untuk kontrak tersebut melalui jalur itu.",
  },
  {
    id: "yemen",
    question: "Apakah Anda mengoperasikan rute internasional?",
    answer:
      "Ya. Layanan internasional saat ini mencakup destinasi Yaman: Marib, Mukalla, dan Aden. Sampaikan asal, tanggal, dan jumlah penumpang untuk ketersediaan.",
  },
  {
    id: "fleet-types",
    question: "Jenis bus apa yang tersedia?",
    answer:
      "Kelas profil resmi mencakup bus VIP (18 atau 28 kursi mewah), bus coach (49), bus kota (45 dengan berdiri), bus V7 (41), dan coaster (29). Kami mengonfirmasi bus yang ditugaskan untuk tanggal Anda dalam penawaran.",
  },
  {
    id: "quote",
    question: "Apa yang Anda butuhkan untuk penawaran?",
    answer:
      "Nama, kontak, jumlah penumpang, asal dan tujuan, tanggal dan waktu, kelas bus jika diketahui, serta catatan aksesibilitas atau bagasi. Nomor permintaan bukan pemesanan yang dikonfirmasi hingga penawaran resmi diterbitkan.",
  },
  {
    id: "baggage",
    question: "Bagaimana kebijakan bagasi?",
    answer:
      "Kuota bervariasi menurut rute, tiket, dan jenis bus. Kami mengonfirmasi kebijakan saat ini bersama pemesanan Anda sebelum pembayaran. Kami tidak mengarang bobot tetap dalam obrolan.",
  },
  {
    id: "safety",
    question: "Standar keselamatan apa yang Anda ikuti?",
    answer:
      "Inspeksi, perawatan berkala, pelacakan GPS, pemantauan pengemudi, dan prosedur respons darurat sesuai persyaratan regulasi.",
  },
] as const
