import { cn } from "@/lib/cn"
import type { ReactNode } from "react"
import { pick, placeGroups, type Option, type Place } from "./quoteWizardConfig"
import { Dropdown } from "./QuoteFields"
import { CheckBadge, choiceIcon } from "./QuoteChoiceIcons"

export const fieldClass =
  "w-full min-w-0 rounded-xl border border-border bg-surface-elevated px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink-muted hover:border-ink/20 focus:border-orange/60 focus:ring-2 focus:ring-orange/20 sm:text-[0.9375rem]"
export const fieldErrorRing = "ring-2 ring-red-400/50 focus:ring-red-400/60 bg-red-50/60 dark:bg-red-950/40"
export const btnPrimary =
  "font-label inline-flex min-w-[9.5rem] items-center justify-center rounded-full bg-orange px-8 py-3 text-sm font-semibold text-black shadow-[0_10px_24px_-14px_rgb(243_112_33/0.9)] transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-orange-soft active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-orange disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100"
export const btnGhost =
  "font-label inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-ink-muted transition-[transform,background-color,color] duration-100 ease-out hover:bg-surface-muted hover:text-ink active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"

export function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("block min-w-0", className)}>
      <label
        htmlFor={htmlFor}
        className="font-label mb-1.5 block text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm leading-snug text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Choices({
  options,
  value,
  onPick,
  locale,
  columns = 2,
}: {
  options: readonly Option[]
  value: string
  onPick: (id: string) => void
  locale: string
  columns?: 1 | 2
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-[repeat(auto-fit,minmax(min(100%,15.5rem),1fr))]",
      )}
      role="radiogroup"
    >
      {options.map((o) => {
        const selected = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onPick(o.id)}
            className={cn(
              "relative flex items-start gap-3 rounded-2xl border bg-surface-elevated px-3.5 py-3.5 text-start transition-[transform,border-color,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/60 motion-reduce:transition-none motion-reduce:active:scale-100 sm:px-4 sm:py-4",
              selected
                ? "border-orange bg-orange/[0.06] shadow-[0_0_0_1px_var(--brand-orange)]"
                : "border-border text-ink hover:border-ink/20 hover:shadow-[0_10px_24px_-18px_rgb(0_0_0/0.45)]",
            )}
          >
            {selected ? <CheckBadge /> : null}
            <span
              className={cn(
                "mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-150",
                selected
                  ? "bg-orange/15 text-orange-text"
                  : "bg-surface-muted text-ink-muted",
              )}
            >
              {choiceIcon(o.id)}
            </span>
            <span className="min-w-0 pe-5">
              <span className="block text-sm font-semibold text-ink">
                {pick(o.label, locale)}
              </span>
              {o.hint ? (
                <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
                  {pick(o.hint, locale)}
                </span>
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function StepProgress({
  current,
  total,
  name,
  counter,
  label,
  toolbar,
}: {
  current: number
  total: number
  name: string
  counter: string
  label: string
  toolbar?: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      {toolbar ? <div className="flex min-h-11 items-center">{toolbar}</div> : null}
      <div className="flex items-center justify-between gap-3">
        <p className="font-label text-[0.7rem] font-semibold tracking-[0.12em] text-orange-text uppercase rtl:tracking-normal">
          {name}
        </p>
        <p className="font-label shrink-0 text-xs font-semibold text-ink-muted tabular-nums">
          {counter}
        </p>
      </div>
      <div
        className="flex gap-1"
        role="progressbar"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300 ease-out motion-reduce:transition-none",
              i < current ? "bg-orange" : "bg-surface-container",
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function PlaceSelect({
  id,
  value,
  onChange,
  options,
  locale,
  placeholder,
  error,
}: {
  id: string
  value: string
  onChange: (id: string) => void
  options: readonly Place[]
  locale: string
  placeholder: string
  error?: string
}) {
  return (
    <Dropdown
      id={id}
      value={value}
      locale={locale}
      placeholder={placeholder}
      error={error}
      options={options.map((o) => ({
        id: o.id,
        label: pick(o.label, locale),
        group: pick(placeGroups[o.group], locale),
      }))}
      onChange={onChange}
    />
  )
}
