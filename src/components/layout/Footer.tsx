import { SocialLinksRow } from "@/components/ui/SocialLinks"
import { getCompanies, getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"

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
    <footer className="border-t border-ink/6 bg-white text-ink/55">
      <div className="mx-auto grid max-w-[80rem] gap-12 px-4 py-16 md:grid-cols-4 md:px-10">
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
                {tMeta("siteNameEn")}
              </p>
              <p className="text-sm text-ink/70">{tMeta("siteName")}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{t("tagline")}</p>
        </div>

        <div>
          <p className="font-label mb-4 text-xs font-semibold tracking-wide text-ink">
            {t("quickLinks")}
          </p>
          <ul className="space-y-2 text-sm">
            {(
              [
                ["/", "home"],
                ["/fleet", "fleet"],
                ["/companies", "companies"],
                ["/about", "about"],
                ["/contact", "contact"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                >
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-label mb-4 text-xs font-semibold tracking-wide text-ink">
            {t("companies")}
          </p>
          <ul className="space-y-2 text-sm">
            {companies.map((company) => (
              <li key={company.slug}>
                <Link
                  href={`/companies/${company.slug}`}
                  className="transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                >
                  {company.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink/80">{config.email}</p>
          <p className="text-sm text-ink/80" dir="ltr">
            {config.phones[0]}
          </p>
        </div>
      </div>

      <div className="border-t border-ink/6 px-4 py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:px-10">
        <div className="mx-auto flex max-w-[80rem] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs sm:text-start">
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
