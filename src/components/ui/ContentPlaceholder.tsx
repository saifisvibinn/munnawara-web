import { useTranslations } from "next-intl"

type ContentPlaceholderProps = {
  note?: string
}

export const ContentPlaceholder = ({ note }: ContentPlaceholderProps) => {
  const t = useTranslations("common")

  return (
    <div role="status" className="px-4 py-10 text-center">
      <p className="text-lg text-ink-muted">{t("contentPending")}</p>
      {note ? <p className="mt-2 text-sm text-ink-muted">{note}</p> : null}
    </div>
  )
}
