import { QuoteBackLink, QuotePageLock } from "@/components/forms/QuotePageChrome"

/** Instant shell while the quote wizard chunk streams in. */
const QuoteLoading = () => (
  <div className="qpage" aria-busy="true" aria-live="polite">
    <QuotePageLock />
    <div className="qw-split">
      <aside className="qw-split__map animate-pulse bg-surface-muted" aria-hidden="true" />
      <section className="qw-split__panel space-y-4">
        <QuoteBackLink />
        <div className="h-1 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full w-1/6 rounded-full bg-orange/70" />
        </div>
        <div className="h-7 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-14 animate-pulse rounded-xl bg-surface-muted" />
          <div className="h-14 animate-pulse rounded-xl bg-surface-muted" />
          <div className="h-14 animate-pulse rounded-xl bg-surface-muted" />
          <div className="h-14 animate-pulse rounded-xl bg-surface-muted" />
        </div>
      </section>
    </div>
  </div>
)

export default QuoteLoading
