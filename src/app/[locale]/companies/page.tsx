import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import { PageIntro } from "@/components/ui/PageIntro"
import { TextLink } from "@/components/ui/TextLink"
import { getCompanies } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Image from "next/image"
import { buildPageMetadata } from "@/lib/seo"

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
    <AnimatedSection className="pt-20">
      <PageIntro title={t("companies")} subtitle={tHome("companiesSubtitle")} align="start" />
      <Stagger className="mx-auto mt-16 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        {companies.map((company) => (
          <StaggerItem
            as="article"
            key={company.slug}
            className="group relative overflow-hidden rounded-2xl bg-surface-elevated ring-1 ring-ink/6 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_48px_-28px_rgb(32_29_26/0.45)] hover:ring-orange/25 focus-within:ring-orange/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className="relative flex aspect-[16/11] items-center justify-center bg-white px-8 py-10">
              <Image
                src={company.logo}
                alt=""
                width={720}
                height={480}
                className="h-full max-h-[14rem] w-auto max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
                {/* The link covers the whole card so any part of it opens the company. */}
                <TextLink
                  href={`/companies/${company.slug}`}
                  className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                >
                  {tCommon("learnMore")}
                </TextLink>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "companies")

export default CompaniesPage
