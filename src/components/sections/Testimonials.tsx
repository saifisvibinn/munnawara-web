import { TestimonialsClient } from "@/components/sections/TestimonialsClient"
import { getHome, getTestimonials } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale, getTranslations } from "next-intl/server"

export const Testimonials = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const items = getTestimonials(locale)
  const t = await getTranslations("home")

  return (
    <TestimonialsClient
      title={home.testimonialsTitle}
      emptyMessage={home.testimonialsEmpty}
      items={items}
      previousLabel={t("previousTestimonial")}
      nextLabel={t("nextTestimonial")}
    />
  )
}
