import { Footer } from "@/components/layout/Footer"
import { FloatingActions } from "@/components/layout/FloatingActions"
import { FloatingQuoteCta } from "@/components/layout/FloatingQuoteCta"
import { Header } from "@/components/layout/Header"
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider"
import { routing } from "@/i18n/routing"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import {
  Amiri,
  Cairo,
  Noto_Sans,
  Noto_Sans_Arabic,
  Noto_Serif,
} from "next/font/google"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { LogoRouteTransition } from "@/components/landing/LogoRouteTransition"
import "../globals.css"
import "@/styles/dam-landing.css"

export const metadata: Metadata = {
  title: "DMTC | Durrah Al-Munawwara",
  description: "Durrah Al-Munawwara Group — transport and pilgrimage services",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

const fontArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
})

const fontLatin = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-latin",
  display: "swap",
})

const fontDisplay = Noto_Serif({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: false,
})

const fontDisplayAr = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700"],
  variable: "--font-display-ar",
  display: "swap",
  preload: false,
})

const fontNumeralAr = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["700"],
  variable: "--font-numeral-ar",
  display: "swap",
  preload: false,
})

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }))

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
      suppressHydrationWarning
      className={`${fontArabic.variable} ${fontLatin.variable} ${fontDisplay.variable} ${fontDisplayAr.variable} ${fontNumeralAr.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname.replace(/\\/+$/,"")||"/";if(p==="/"||p==="/en"||p==="/ar"){if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}}catch(e){}})();`,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Header />
            <main id="main" className="min-h-[60dvh]">{children}</main>
            <Footer />
            <FloatingActions />
            <FloatingQuoteCta />
            <LogoRouteTransition />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
