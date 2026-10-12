import { TestimonialsClient } from "@/components/sections/TestimonialsClient"
import { getHome, getTestimonials } from "@/content"
import { partners } from "@/content/partners"
import type { AppLocale } from "@/content/types"
import { getLocale } from "next-intl/server"

export const Testimonials = async () => {
  const locale = (await getLocale()) as AppLocale
  const home = getHome(locale)
  const items = getTestimonials(locale)

  return (
    <TestimonialsClient
      title={home.testimonialsTitle}
      subtitle={home.testimonialsSubtitle}
      ctaLabel={home.testimonialsCta}
      viewMoreLabel={home.testimonialsViewMore}
      emptyMessage={home.testimonialsEmpty}
      items={items}
      partners={partners}
    />
  )
}
