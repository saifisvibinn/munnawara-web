"use client"

import CircularCarousel from "@/components/CircularCarousel"
import type { CircularCarouselItem } from "@/components/CircularCarousel"
import {
  FleetBusFlipCard,
  FleetMoreImagesModal,
} from "@/components/fleet/FleetBusFlipCard"
import type { FleetCategory } from "@/content/types"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

type FleetShowcaseProps = {
  categories: readonly FleetCategory[]
}

const CARD_WIDTH = 440
const ASPECT_RATIO = 1.7

export const FleetShowcase = ({ categories }: FleetShowcaseProps) => {
  const t = useTranslations("fleetViewer")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [activeIndex, setActiveIndex] = useState(0)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const items = useMemo<CircularCarouselItem[]>(
    () =>
      categories.map((bus) => ({
        src: bus.coverImage,
        alt: bus.name,
        title: bus.name,
        subtitle: `${tCommon("seats")}: ${bus.seatsLabel}`,
      })),
    [categories, tCommon],
  )

  const active = categories[activeIndex]

  useEffect(() => {
    setGalleryOpen(false)
  }, [activeIndex])

  const handleChange = (index: number) => {
    setActiveIndex(index)
    if (flippedIndex !== null && flippedIndex !== index) {
      setFlippedIndex(null)
    }
  }

  const handleItemClick = (_item: CircularCarouselItem, index: number) => {
    setActiveIndex(index)
    setFlippedIndex((current) => (current === index ? null : index))
  }

  if (!active || items.length === 0) return null

  return (
    <div className="space-y-6">
      <div
        className="relative mx-auto h-[min(62vw,720px)] w-full max-w-none overflow-visible px-6 pt-3 sm:px-10"
        aria-label={t("carouselLabel")}
      >
        <CircularCarousel
          items={items}
          preset="cylinder"
          intro="rise"
          cardWidth={CARD_WIDTH}
          aspectRatio={ASPECT_RATIO}
          gap={72}
          curve={0}
          autoplay={flippedIndex !== null || galleryOpen ? "off" : "drift"}
          speed={10}
          direction={locale === "ar" ? "right" : "left"}
          captions
          fadeColor="#000000"
          cornerRadius={28}
          depthFade={0.3}
          perspective={3400}
          onChange={handleChange}
          onItemClick={handleItemClick}
          className="text-ink"
          renderCard={(_item, index, meta) => {
            const bus = categories[index]
            if (!bus) return null
            return (
              <div
                className={
                  meta.active
                    ? "box-border h-full w-full rounded-[1.75rem] border-[3px] border-orange p-0"
                    : "box-border h-full w-full rounded-[1.75rem] border-[3px] border-transparent"
                }
              >
                <FleetBusFlipCard
                  bus={bus}
                  flipped={flippedIndex === index}
                  width={meta.width}
                  height={meta.height}
                  onShowMore={() => {
                    setActiveIndex(index)
                    setGalleryOpen(true)
                  }}
                />
              </div>
            )
          }}
        />
      </div>

      <p className="mx-auto max-w-md px-4 text-center text-xs text-ink-muted">
        {t("scrollHint")}
      </p>

      <FleetMoreImagesModal
        bus={active}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  )
}
