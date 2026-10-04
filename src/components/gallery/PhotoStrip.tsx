import { getPhotos } from "@/content"
import type { AppLocale } from "@/content/types"
import Image from "next/image"

type PhotoStripProps = {
  locale: AppLocale
  /** Photo ids from `photoManifest`, shown in this order. */
  ids: readonly string[]
  className?: string
}

/** A row of photos (three across, also on phones). Static, no client JS. */
export const PhotoStrip = ({ locale, ids, className }: PhotoStripProps) => {
  const all = getPhotos(locale)
  const photos = ids
    .map((id) => all.find((photo) => photo.id === id))
    .filter((photo) => photo !== undefined)

  return (
    <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${className ?? ""}`}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-muted"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 1024px) 33vw, 22rem"
            className="size-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}
