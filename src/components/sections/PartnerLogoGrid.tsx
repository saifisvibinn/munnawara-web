import { partners } from "@/content/partners"
import { cn } from "@/lib/cn"

/** Data-driven partner logo grid: uniform box, grayscale until hover. */
export const PartnerLogoGrid = ({ className }: { className?: string }) => {
  if (partners.length === 0) return null

  return (
    <ul
      className={cn(
        "grid grid-cols-2 items-center gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6",
        className,
      )}
    >
      {partners.map((partner) => {
        const logo = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            className="h-full w-full object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
        )
        return (
          <li key={partner.name}>
            {partner.url ? (
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-20 items-center justify-center rounded-xl border border-border bg-surface-muted p-4 sm:h-24"
              >
                {logo}
              </a>
            ) : (
              <div className="group flex h-20 items-center justify-center rounded-xl border border-border bg-surface-muted p-4 sm:h-24">
                {logo}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
