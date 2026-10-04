import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PhotoStrip } from "@/components/gallery/PhotoStrip"
import { PageIntro } from "@/components/ui/PageIntro"
import { getCareers } from "@/content"
import type { AppLocale } from "@/content/types"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

const CareersPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("nav")
  const tCommon = await getTranslations("common")
  const roles = getCareers(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={t("careers")} align="start" />
      <div className="mx-auto mt-12 max-w-4xl px-4 sm:px-6">
        <PhotoStrip
          locale={locale as AppLocale}
          ids={["workshop-0205", "people-0486", "people-0467"]}
        />
      </div>
      <div className="mx-auto mt-16 max-w-2xl px-6 text-center">
        {roles.length === 0 ? (
          <p className="text-lg text-ink-muted">{tCommon("noOpenRoles")}</p>
        ) : (
          <ul className="space-y-8 text-start">
            {roles.map((role) => (
              <li key={role.id} className="border-b border-ink/8 pb-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {role.title}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {role.location} · {role.type}
                </p>
                <p className="mt-3 text-ink-muted">{role.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AnimatedSection>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "careers")

export default CareersPage
