import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { TextLink } from "@/components/ui/TextLink"
import { getAbout, getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"
import Image from "next/image"

export const AboutPreview = async () => {
  const locale = (await getLocale()) as AppLocale
  const about = getAbout(locale)
  const home = getHome(locale)

  return (
    <AnimatedSection className="bg-surface-muted py-16 sm:py-24 md:py-32">
      <div className="mx-auto grid max-w-[80rem] items-center gap-10 px-4 md:grid-cols-2 md:gap-20 md:px-10">
        <div className="relative order-2 aspect-[5/4] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:order-1">
          <Image
            src={home.aboutImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="order-1 min-w-0 md:order-2">
          <p className="font-label text-[11px] font-semibold tracking-[0.2em] text-orange uppercase sm:text-xs sm:tracking-[0.24em]">
            {home.aboutEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight break-words text-ink sm:mt-4 sm:text-4xl md:text-5xl">
            {about.missionTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/60 sm:mt-5 sm:text-lg">
            {about.mission}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink/50 sm:text-base">
            {about.intro}
          </p>
          <div className="mt-7 sm:mt-8">
            <TextLink href="/about">{home.aboutCta}</TextLink>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
