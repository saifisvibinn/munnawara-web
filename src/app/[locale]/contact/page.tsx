import { AnimatedSection } from "@/components/motion/AnimatedSection"
import { MapEmbed } from "@/components/ui/MapEmbed"
import { SocialLinksRow, WhatsAppIcon } from "@/components/ui/SocialLinks"
import { getContact, getSiteConfig } from "@/content"
import type { AppLocale } from "@/content/types"
import { Link } from "@/i18n/navigation"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { ComponentType } from "react"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ locale: string }>
}

type Channel = {
  id: string
  label: string
  value: string
  note: string
  href: string
  external: boolean
  Icon: ComponentType<{ className?: string }>
}

const actionBase =
  "inline-flex min-h-12 touch-manipulation items-center justify-center gap-3 rounded-full px-7 text-[0.95rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
const primaryAction = `${actionBase} bg-orange text-black hover:bg-orange-soft active:bg-orange-soft`
const secondaryAction = `${actionBase} border border-border bg-surface-elevated text-ink hover:border-ink-muted active:bg-surface-muted`
const arrowClass = "size-[1.125rem] shrink-0 rtl:-scale-x-100"
const sectionTitle =
  "font-display text-3xl leading-tight font-semibold text-balance text-ink sm:text-4xl"

const formatPhone = (phone: string) =>
  phone.replace(/^\+?966(\d{2})(\d{3})(\d{4})$/, "+966 $1 $2 $3")

const ContactPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const currentLocale = locale as AppLocale
  const t = await getTranslations()
  const tCommon = await getTranslations("common")
  const content = getContact(currentLocale)
  const config = getSiteConfig()
  const address = config.address[currentLocale]
  const hours = config.workingHours[currentLocale]
  const whatsappHref = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(t("whatsappPrefill"))}`
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address.en)}`

  const channels: Channel[] = [
    {
      id: "whatsapp",
      label: tCommon("whatsapp"),
      value: formatPhone(config.whatsappNumber),
      note: content.whatsappNote,
      href: whatsappHref,
      external: true,
      Icon: WhatsAppIcon,
    },
    ...config.phones.map((phone) => ({
      id: phone,
      label: content.phoneLabel,
      value: formatPhone(phone),
      note: hours,
      href: `tel:${phone}`,
      external: false,
      Icon: Phone,
    })),
    {
      id: "email",
      label: tCommon("email"),
      value: config.email,
      note: content.emailNote,
      href: `mailto:${config.email}`,
      external: false,
      Icon: Mail,
    },
  ]

  return (
    <div className="text-start">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-20 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <h1 className="font-display text-[2.5rem] leading-[1.1] font-semibold text-balance text-ink sm:text-5xl lg:text-6xl">
            {content.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            {content.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryAction}
            >
              <WhatsAppIcon className="size-5" />
              {content.whatsappCta}
            </a>
            <Link href={content.quoteHref} className={secondaryAction}>
              {tCommon("requestQuote")}
              <ArrowUpRight aria-hidden className={arrowClass} />
            </Link>
          </div>
        </div>
        <figure className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted lg:aspect-[4/5] lg:max-h-[38rem]">
          <Image
            src="/photos/interior/0222.webp"
            alt={content.heroImageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="object-cover"
          />
        </figure>
      </section>

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <h2 className={sectionTitle}>{content.channelsTitle}</h2>
        <ul className="mt-10 border-t border-border">
          {channels.map(({ id, label, value, note, href, external, Icon }) => (
            <li key={id} className="border-b border-border">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group grid gap-3 rounded-md px-1 py-7 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-8 sm:px-4"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-ink-muted">
                  <Icon aria-hidden className="size-5 text-orange" />
                  {label}
                </span>
                <span className="grid min-w-0 gap-1">
                  <span className="text-2xl font-medium break-words text-ink sm:text-3xl">
                    <bdi dir="ltr">{value}</bdi>
                  </span>
                  <span className="text-sm text-ink-muted">{note}</span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="hidden size-6 text-ink-muted transition-colors group-hover:text-orange sm:block rtl:-scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </AnimatedSection>

      <AnimatedSection className="bg-surface-muted">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-28">
          <div>
            <h2 className={sectionTitle}>{content.officeTitle}</h2>
            <dl className="mt-10 grid gap-8">
              <div>
                <dt className="flex items-center gap-3 text-sm font-semibold text-ink-muted">
                  <MapPin aria-hidden className="size-5 text-orange" />
                  {tCommon("address")}
                </dt>
                <dd className="mt-2 ps-8 text-lg leading-relaxed text-ink">{address}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 text-sm font-semibold text-ink-muted">
                  <Clock aria-hidden className="size-5 text-orange" />
                  {tCommon("workingHours")}
                </dt>
                <dd className="mt-2 ps-8 text-lg text-ink">{hours}</dd>
              </div>
            </dl>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-12 items-center gap-2 font-semibold text-ink underline decoration-orange decoration-2 underline-offset-[6px] transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
            >
              {content.mapsLink}
              <ArrowUpRight aria-hidden className={arrowClass} />
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-surface-elevated">
            <MapEmbed
              query={config.address.en}
              title={content.mapTitle}
              className="h-[22rem] lg:h-full lg:min-h-[28rem]"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="font-display text-4xl leading-tight font-semibold text-balance text-ink sm:text-5xl">
              {content.quoteTitle}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
              {content.quoteBody}
            </p>
          </div>
          <Link href={content.quoteHref} className={`${primaryAction} justify-self-start`}>
            {tCommon("requestQuote")}
            <ArrowUpRight aria-hidden className={arrowClass} />
          </Link>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <p className="text-sm text-ink-muted">{tCommon("followUs")}</p>
          <SocialLinksRow
            links={config.social}
            twitterLabel={tCommon("socialTwitter")}
            facebookLabel={tCommon("socialFacebook")}
            instagramLabel={tCommon("socialInstagram")}
            snapchatLabel={tCommon("socialSnapchat")}
            className="-me-2"
          />
        </div>
      </AnimatedSection>
    </div>
  )
}

export const generateMetadata = async ({ params }: PageProps) =>
  buildPageMetadata((await params).locale, "contact")

export default ContactPage
