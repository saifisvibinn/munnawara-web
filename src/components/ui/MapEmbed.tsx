import { cn } from "@/lib/cn"

type MapEmbedProps = {
  query: string
  title: string
  className?: string
}

export const MapEmbed = ({ query, title, className }: MapEmbedProps) => (
  <iframe
    src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
    title={title}
    loading="eager"
    referrerPolicy="no-referrer-when-downgrade"
    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    className={cn("block w-full border-0 bg-surface-muted", className)}
  />
)
