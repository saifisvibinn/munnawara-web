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
      <PageIntro title={t("companies")} subtitle={tHome("companiesSubtitle")} />
      <div className="mx-auto mt-16 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        {companies.map((company) => (
          <article key={company.slug} className="overflow-hidden rounded-xl bg-white">
            <div className="relative aspect-[16/10]">
              <Image
                src={company.heroImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div className="px-7 py-8">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
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
