import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { PageIntro } from "@/components/ui/PageIntro"
import { getAbout } from "@/content"
import type { AppLocale } from "@/content/types"
import { setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

const AboutPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const about = getAbout(locale as AppLocale)

  return (
    <AnimatedSection className="pb-28 pt-20">
      <PageIntro title={about.title} subtitle={about.intro} />
      <div className="mx-auto mt-20 max-w-2xl space-y-16 px-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            {about.historyTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            {about.history}
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            {about.missionTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            {about.mission}
          </p>
        </div>
        {about.licensingNote ? (
          <p className="text-sm text-ink-muted">{about.licensingNote}</p>
        ) : null}
      </div>
    </AnimatedSection>
  )
}

export default AboutPage
