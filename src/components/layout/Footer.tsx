import { SocialLinksRow } from "@/components/ui/SocialLinks"
import { getCompanies, getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { SiteImage as Image } from "@/components/ui/SiteImage"

export const Footer = async () => {
  const t = await getTranslations("footer")
  const tNav = await getTranslations("nav")
  const tMeta = await getTranslations("meta")
  const tCommon = await getTranslations("common")
  const locale = (await getLocale()) as AppLocale
  const companies = getCompanies(locale).filter((c) => c.contentReady)
  const config = getSiteConfig()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/6 bg-surface-elevated text-ink/70">
      <div className="mx-auto grid max-w-[80rem] gap-7 px-4 py-9 md:grid-cols-4 md:gap-12 md:px-10 md:py-16">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={605}
              height={491}
              className="h-9 w-auto object-contain"
            />
            <div>
              <p className="font-label text-sm font-semibold text-ink">
                {config.brandNameEn}
              </p>
              {locale === "ar" ? (
                <p className="text-sm text-ink/70">{tMeta("siteName")}</p>
              ) : null}
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed md:mt-5">{t("tagline")}</p>
        </div>

        <div>
          <p className="font-label mb-3 text-xs font-semibold tracking-wide text-ink md:mb-4">
            {t("quickLinks")}
          </p>
          {/* Mobile: three per row instead of one per line. */}
          <ul className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm md:block md:space-y-2">
            {(
              [
                ["/", "home"],
                ["/fleet", "fleet"],
                ["/companies", "companies"],
                ["/about", "about"],
                ["/contact", "contact"],
                ["/track", "track"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block py-1.5 transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:py-0"
                >
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-label mb-3 text-xs font-semibold tracking-wide text-ink md:mb-4">
            {t("companies")}
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm md:block md:space-y-2">
            {companies.map((company) => (
              <li key={company.slug}>
                <Link
                  href={`/companies/${company.slug}`}
                  className="inline-block py-1.5 leading-snug transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange md:py-0"
                >
                  {company.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/80 md:mt-6 md:block">
            <a href={`mailto:${config.email}`} className="transition hover:text-orange md:block">
              {config.email}
            </a>
            <a href={`tel:${config.phones[0]?.replace(/s+/g, "")}`} dir="ltr" className="transition hover:text-orange md:block">
              {config.phones[0]}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/6 px-4 pt-4 pb-[calc(8rem+env(safe-area-inset-bottom))] md:px-10 md:pt-5 md:pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-[80rem] flex-row items-center justify-between gap-4">
          <p className="text-xs text-start">
            © {year} {config.brandShort}. {t("rights")}
          </p>
          <SocialLinksRow
            links={config.social}
            twitterLabel={tCommon("socialTwitter")}
            facebookLabel={tCommon("socialFacebook")}
            instagramLabel={tCommon("socialInstagram")}
            snapchatLabel={tCommon("socialSnapchat")}
          />
        </div>
      </div>
    </footer>
  )
}
