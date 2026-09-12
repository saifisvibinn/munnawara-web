import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { ParallaxImage } from "@/components/motion/ParallaxImage"
import { getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const ValueProposition = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)

  return (
    <AnimatedSection className="bg-white pt-14 pb-16 sm:pt-20 sm:pb-20 md:pt-28 md:pb-28">
      <div className="mx-auto grid max-w-[80rem] items-center gap-10 px-4 md:grid-cols-2 md:gap-20 md:px-10">
        <div className="min-w-0">
          <h2 className="text-3xl font-semibold tracking-tight break-words text-ink sm:text-4xl md:text-5xl">
            {home.valueTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/60 sm:mt-5 sm:text-lg">
            {home.valueIntro}
          </p>
          <ul className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
            {home.valueBullets.map((bullet) => (
              <li key={bullet.id} className="flex gap-4 border-s-2 border-orange ps-4">
                <div className="min-w-0">
                  <p className="font-label text-sm font-semibold text-ink">
                    {bullet.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/55">
                    {bullet.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ParallaxImage
          src={home.valueImage}
          className="aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] md:aspect-[4/3]"
        />
      </div>
    </AnimatedSection>
  )
}
