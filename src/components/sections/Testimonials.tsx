import { TestimonialsClient } from "@/components/sections/TestimonialsClient"
import { getClients, getHome, getTestimonials } from "@/content"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const Testimonials = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const items = getTestimonials(locale)
  const clients = getClients(locale)

  return (
    <TestimonialsClient
      title={home.testimonialsTitle}
      subtitle={home.testimonialsSubtitle}
      ctaLabel={home.testimonialsCta}
      emptyMessage={home.testimonialsEmpty}
      items={items}
      clients={clients}
    />
  )
}
