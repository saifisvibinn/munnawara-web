import { Footer } from "@/components/layout/Footer"
import { FloatingActions } from "@/components/layout/FloatingActions"
import { FloatingQuoteCta } from "@/components/layout/FloatingQuoteCta"
import { Header } from "@/components/layout/Header"
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { routing } from "@/i18n/routing"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
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

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }))

const THEME_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){d.classList.add(t);d.style.colorScheme=t}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){d.classList.add("dark");d.style.colorScheme="dark"}else{d.classList.add("light");d.style.colorScheme="light"}}catch(e){}})();`

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname.replace(/\\/+$/,"")||"/";if(p==="/"||p==="/en"||p==="/ar"){if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
