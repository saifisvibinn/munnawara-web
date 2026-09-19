import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { ContentPlaceholder } from "@/components/ui/ContentPlaceholder"
import { TextLink } from "@/components/ui/TextLink"
import { getCompany } from "@/content"
import type { AppLocale, CompanySlug } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Image from "next/image"

type PageProps = {
  params: Promise<{ locale: string }>
}

const CompanyDetailPage = async ({
  params,
  slug,
}: PageProps & { slug: CompanySlug }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const company = getCompany(locale as AppLocale, slug)
  if (!company) notFound()

  const tCommon = await getTranslations("common")

  return (
    <AnimatedSection className="pb-28 pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <TextLink href="/companies">{tCommon("backToCompanies")}</TextLink>
      </div>

      <div className="relative mx-auto mt-8 flex min-h-[min(52vw,28rem)] max-w-6xl items-center justify-center overflow-hidden rounded-2xl bg-ink px-8 py-14 sm:px-14">
        <Image
          src={company.logo}
          alt={company.name}
          width={900}
          height={600}
          className="h-auto max-h-[22rem] w-full max-w-xl object-contain"
          sizes="(max-width:768px) 90vw, 36rem"
          priority
        />
      </div>

      <div className="mx-auto mt-14 max-w-3xl px-6 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {company.name}
        </h1>
        {!company.contentReady ? (
          <div className="mt-10">
            <ContentPlaceholder />
          </div>
        ) : (
          <>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              {company.summary}
            </p>
            <ul className="mt-12 space-y-4 text-start">
              {company.services.map((service) => (
                <li
                  key={service}
                  className="border-b border-ink/8 py-4 text-lg text-ink"
                >
                  {service}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AnimatedSection>
  )
}

export default CompanyDetailPage
