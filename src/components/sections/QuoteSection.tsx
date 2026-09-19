import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm"
import { getSiteConfig } from "@/content"
import { getTranslations } from "next-intl/server"

export const QuoteSection = async () => {
  const tWhatsapp = await getTranslations()
  const config = getSiteConfig()

  return (
    <section
      id="quote-section"
      className="relative z-10 bg-white px-4 pb-16 sm:px-6 sm:pb-20 md:px-10 md:pb-24"
      aria-label="Request a quote"
    >
      <div className="mx-auto max-w-[80rem]">
        <QuoteRequestForm
          whatsappNumber={config.whatsappNumber}
          whatsappPrefill={tWhatsapp("whatsappPrefill")}
        />
      </div>
    </section>
  )
}
