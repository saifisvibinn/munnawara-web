import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { TextLink } from "@/components/ui/TextLink"
import { getCompanies } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"

export const CompanyCards = async () => {
  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")
  const locale = (await getLocale()) as AppLocale
  const companies = getCompanies(locale)

  return (
    <AnimatedSection className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {t("companiesTitle")}
        </h2>
        <p className="mt-4 text-base text-ink-muted md:text-lg">
          {t("companiesSubtitle")}
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-[80rem] gap-5 px-4 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        {companies.map((company) => (
          <article
            key={company.slug}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm transition hover:shadow-md"
          >
            <div className="relative flex aspect-[16/11] items-center justify-center bg-ink px-5 py-6">
              <Image
                src={company.logo}
                alt=""
                width={480}
                height={320}
                className="h-full max-h-36 w-auto max-w-full object-contain"
                sizes="(max-width:768px) 100vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col border-t-2 border-orange px-5 py-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {company.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                {company.summary ?? tCommon("contentPending")}
              </p>
              <div className="mt-4">
                <TextLink href={`/companies/${company.slug}`}>
                  {tCommon("learnMore")}
                </TextLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}
