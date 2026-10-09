import { getPhotos } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import Image from "next/image"

type PhotoStripProps = {
  locale: AppLocale
  /** Photo ids from `photoManifest`, shown in this order. */
  ids: readonly string[]
  className?: string
  /** `editorial` = featured + stack (home). `row` = equal three-up. */
  variant?: "row" | "editorial"
  /** Accessible label for each photo link into the gallery. */
  openLabel?: string
}

/** Photo preview strip. Links into `/gallery?p=` so the lightbox opens high-res. */
export const PhotoStrip = ({
  locale,
  ids,
  className,
  variant = "row",
  openLabel = "Open photo",
}: PhotoStripProps) => {
  const all = getPhotos(locale)
  const photos = ids
    .map((id) => all.find((photo) => photo.id === id))
    .filter((photo) => photo !== undefined)

  if (photos.length === 0) return null

  if (variant === "editorial" && photos.length >= 3) {
    const [hero, second, third] = photos
    return (
      <div
        className={cn(
          "grid gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5",
          className,
        )}
      >
        <StripFrame
          photo={hero}
          openLabel={openLabel}
          className="lg:col-span-7 lg:aspect-[4/5]"
          sizes="(max-width: 1023px) 100vw, 48vw"
          priority
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
          <StripFrame
            photo={second}
            openLabel={openLabel}
            className="lg:aspect-[5/4]"
            sizes="(max-width: 1023px) 50vw, 28vw"
          />
          <StripFrame
            photo={third}
            openLabel={openLabel}
            className="lg:aspect-[5/4]"
            sizes="(max-width: 1023px) 50vw, 28vw"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:gap-3", className)}>
      {photos.map((photo, index) => (
        <StripFrame
          key={photo.id}
          photo={photo}
          openLabel={openLabel}
          className="aspect-[3/4]"
          sizes="(max-width: 1024px) 33vw, 22rem"
          priority={index === 0}
        />
      ))}
    </div>
  )
}

type StripFrameProps = {
  photo: {
    id: string
    src: string
    alt: string
    width: number
    height: number
  }
  openLabel: string
  className?: string
  sizes: string
  priority?: boolean
}

const StripFrame = ({
  photo,
  openLabel,
  className,
  sizes,
  priority = false,
}: StripFrameProps) => (
  <Link
    href={`/gallery?p=${encodeURIComponent(photo.id)}`}
    aria-label={`${openLabel}: ${photo.alt}`}
    className={cn(
      "group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
      className,
    )}
  >
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      quality={90}
      priority={priority}
      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
    />
  </Link>
)
