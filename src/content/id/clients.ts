import type { ClientCategory } from "../types"

/** Pengelompokan sektor yang sesuai dengan siapa yang tampil di dinding logo klien resmi. */
export const clients: readonly ClientCategory[] = [
  {
    id: "hajj-umrah-operators",
    label: "Operator haji & umrah",
    description:
      "Kampanye dan perusahaan umrah di seluruh Kerajaan serta pasar internasional.",
  },
  {
    id: "corporate",
    label: "Korporat & lembaga",
    description: "Mitra transportasi staf, sekolah, tenaga kerja, dan sektor swasta.",
  },
  {
    id: "government",
    label: "Pemerintah & pendidikan",
    description:
      "Pengaturan transportasi formal termasuk program Kementerian Pendidikan dan penugasan kelembagaan.",
  },
] as const
