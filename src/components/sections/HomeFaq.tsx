import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { Accordion } from "@/components/ui/Accordion"
import { getFaq, getHome } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const HomeFaq = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const faq = getFaq(locale)

  return (
    <AnimatedSection className="bg-surface-muted px-4 py-16 sm:py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight break-words text-ink sm:text-4xl md:text-5xl">
            {home.faqTitle}
          </h2>
          <p className="mt-3 text-sm text-ink/55 sm:mt-4 sm:text-base">
            {home.faqSubtitle}
          </p>
        </div>
        <div className="mt-8 sm:mt-12">
          <Accordion
            items={faq.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
