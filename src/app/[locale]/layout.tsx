import { Footer } from "@/components/layout/Footer"
import { FloatingActions } from "@/components/layout/FloatingActions"
import { FloatingQuoteCta } from "@/components/layout/FloatingQuoteCta"
import { Header } from "@/components/layout/Header"
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { routing } from "@/i18n/routing"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { LogoRouteTransition } from "@/components/landing/LogoRouteTransition"
import { SiteCursor } from "@/components/layout/SiteCursor"
import { buildOrganizationSchema, serializeJsonLd } from "@/lib/schema"
import { siteOrigin } from "@/lib/seo"
import "../globals.css"
import "@/styles/dam-landing.css"

// Self-hosted at build time; the CSS @import for Google Fonts is not emitted
// by the bundler, so this is what actually loads Cairo.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
})

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const [tMeta, tSeo] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getTranslations({ locale, namespace: "seo" }),
  ])
  const siteName = tMeta("siteName")
  const description = tSeo("site")

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: `${tMeta("siteNameEn")} | ${siteName}`,
      template: `%s | ${siteName}`,
    },
    description,
    applicationName: siteName,
    icons: {
      icon: "/icon.png",
      apple: "/icon.png",
    },
    openGraph: {
      type: "website",
      siteName,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      description,
    },
  }
}

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }))

// Light is the default; only an explicit saved "dark" choice switches theme.
const THEME_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme")==="dark"?"dark":"light";d.classList.add(t);d.style.colorScheme=t}catch(e){}})();`

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <html
      lang={locale}
      dir={dir}
      className={cairo.variable}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname.replace(/\\/+$/,"")||"/";if(p==="/"||p==="/en"||p==="/ar"){if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(buildOrganizationSchema()),
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <SmoothScrollProvider>
              <Header />
              <main
                id="main"
                className="min-h-[60dvh] pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-16"
              >
                {children}
              </main>
              <Footer />
              <FloatingActions />
              <FloatingQuoteCta />
              <LogoRouteTransition />
              <SiteCursor />
            </SmoothScrollProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
