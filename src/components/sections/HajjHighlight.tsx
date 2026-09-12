import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export const HajjHighlight = async () => {
  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")
  const tHajj = await getTranslations("hajj")

  const steps = [
    { title: tHajj("step1"), hint: t("hajjStepHint1") },
    { title: tHajj("step2"), hint: t("hajjStepHint2") },
    { title: tHajj("step3"), hint: t("hajjStepHint3") },
  ]

  return (
    <AnimatedSection className="bg-surface-mint px-4 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-[80rem] overflow-hidden rounded-xl bg-primary-deep px-6 py-14 text-center text-white shadow-md md:px-12 md:py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {t("hajjTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
          {t("hajjSubtitle")}
        </p>

        <ol className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center">
              <span className="font-label flex size-12 items-center justify-center rounded-md bg-orange text-lg font-semibold text-white shadow-sm">
                {index + 1}
              </span>
              <p className="mt-4 text-sm font-semibold text-white md:text-base">
                {step.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/55 md:text-sm">
                {step.hint}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Link
            href="/hajj-umrah"
            className="font-label inline-flex rounded-lg bg-orange px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-orange-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-soft"
          >
            {tCommon("learnMore")}
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
}
