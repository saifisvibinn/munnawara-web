import Image from "next/image"
import { cn } from "@/lib/cn"

type MediaImageProps = {
  src?: string | null
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

/** Renders an image, or a branded gradient placeholder when src is missing */
export const MediaImage = ({
  src,
  alt,
  className,
  fill = true,
  sizes,
  priority,
}: MediaImageProps) => {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-wordmark via-blue to-orange text-center",
          className,
        )}
      >
        <span className="px-4 text-sm font-medium text-white/90">{alt}</span>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
    />
  )
}
