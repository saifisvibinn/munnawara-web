import { IMAGE_QUALITY } from "@/lib/media"
import Image, { type ImageProps } from "next/image"

/**
 * next/image with the site default quality. Pass `quality` only to override
 * (e.g. tiny thumbs). Must match `images.qualities` in next.config.
 */
export const SiteImage = ({ quality = IMAGE_QUALITY, ...props }: ImageProps) => (
  <Image {...props} quality={quality} />
)
