import { getTranslations } from "next-intl/server"

type MapEmbedProps = {
  address: string
  className?: string
}

export const MapEmbed = async ({ address, className }: MapEmbedProps) => {
  const t = await getTranslations("common")

  return (
    <div className={className} role="img" aria-label={address}>
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-xl bg-white px-8 py-16 text-center">
        <p className="text-lg font-medium tracking-tight text-ink">{address}</p>
        <p className="text-sm text-ink-muted">{t("mapPending")}</p>
      </div>
    </div>
  )
}
