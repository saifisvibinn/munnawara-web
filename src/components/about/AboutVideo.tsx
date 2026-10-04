type AboutVideoProps = {
  headline: string
  label: string
}

/** Company film. Nothing loads until the visitor presses play (poster only). */
export const AboutVideo = ({ headline, label }: AboutVideoProps) => (
  <section className="bg-surface px-4 py-20 sm:px-6 lg:py-28" data-about-video>
    <div className="mx-auto max-w-5xl">
      <h2 className="about-film__display about-film__display--md mb-8 text-center">
        {headline}
      </h2>
      <video
        controls
        playsInline
        preload="none"
        poster="/about/film-poster.jpg"
        aria-label={label}
        className="aspect-video w-full rounded-2xl bg-black object-cover shadow-lg"
      >
        <source src="/about/film.mp4" type="video/mp4" />
      </video>
      <p className="mt-4 text-center text-sm text-ink-muted">{label}</p>
    </div>
  </section>
)
