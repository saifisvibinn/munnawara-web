import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { TextLink } from "@/components/ui/TextLink"
import { getCompanies } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Image from "next/image"

type PageProps = {
  params: Promise<{ locale: string }>
}

const CompaniesPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tHome = await getTranslations("home")
  const tCommon = await getTranslations("common")
  const companies = getCompanies(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("companies")} subtitle={tHome("companiesSubtitle")} align="start" />
      <div className="mx-auto mt-16 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        {companies.map((company) => (
          <article
            key={company.slug}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/6"
          >
            <div className="relative flex aspect-[16/11] items-center justify-center bg-ink px-8 py-10">
              <Image
                src={company.logo}
                alt=""
                width={720}
                height={480}
                className="h-full max-h-[14rem] w-auto max-w-full object-contain"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div className="px-7 py-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {company.name}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                {company.summary ?? tCommon("contentPending")}
              </p>
              <div className="mt-5">
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

export default CompaniesPage
