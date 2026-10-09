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
        "grid min-h-0 flex-1 gap-2.5 sm:max-h-[26rem] sm:gap-4",
        columns === 2 &&
          "auto-rows-[minmax(2.5rem,1fr)] grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]",
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
              "group relative flex min-h-0 items-center gap-3 rounded-2xl border bg-surface-elevated px-3.5 py-0.5 text-start transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated motion-reduce:transition-none sm:min-h-[6rem] sm:rounded-[1.25rem] sm:p-4",
              selected
                ? "border-orange bg-orange/[0.05] shadow-[0_18px_36px_-26px_rgb(243_112_33/0.65)]"
                : "border-border text-ink hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_32px_-24px_rgb(0_0_0/0.4)] motion-reduce:hover:translate-y-0 active:translate-y-0",
            )}
          >
            {selected ? <CheckBadge /> : null}
            <span
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 sm:size-11 [&_svg]:size-4 sm:[&_svg]:size-5",
                selected
                  ? "border-orange/30 bg-orange/10 text-orange-text"
                  : "border-border bg-surface text-ink-muted group-hover:text-ink",
              )}
            >
              {choiceIcon(o.id)}
            </span>
            <span className="min-w-0">
              <span className="block text-[0.9375rem] leading-tight font-semibold tracking-[-0.005em] text-ink sm:text-[1.0625rem] sm:leading-snug rtl:tracking-normal">
                {pick(o.label, locale)}
              </span>
              {o.hint ? (
                <span className="mt-0.5 line-clamp-1 block text-xs leading-snug text-ink-muted sm:mt-1 sm:text-sm">
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
  counter,
  label,
  toolbar,
}: {
  current: number
  total: number
  counter: string
  label: string
  toolbar?: ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-9 items-center justify-between gap-3">
        {toolbar ?? <span />}
        <p className="font-label shrink-0 text-xs font-semibold tracking-[0.04em] text-ink-muted tabular-nums">
          {counter}
        </p>
      </div>
      <div
        className="flex gap-1.5"
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
              "h-[3px] flex-1 rounded-full transition-colors duration-300 ease-out motion-reduce:transition-none",
              i < current ? "bg-orange" : "bg-border",
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
