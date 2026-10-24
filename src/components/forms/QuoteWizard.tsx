"use client"

import { submitQuoteRequest, updateQuoteRequest } from "@/app/actions/quote"
import { quoteRequestSchema } from "@/components/forms/formSchemas"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/lib/cn"
import { useLocale } from "next-intl"
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import { SiteImage as Image } from "@/components/ui/SiteImage"
import { Link } from "@/i18n/navigation"
import {
  busClassImages,
  busClassOptions,
  pick,
  resolveQuoteBusClass,
  type L10n,
} from "./quoteWizardConfig"
import dynamic from "next/dynamic"
import { COPY } from "./quoteWizardCopy"
import {
  buildQuotePayload,
  buildSummaryRows,
  computeSteps,
  getMapView,
  getRouteStops,
  getServiceType,
  getTodayISO,
  validateStep,
  type MapView,
} from "./quoteWizardLogic"
import { initialState, type StepId, type WizardProps, type WizardState } from "./quoteWizardTypes"
import { StepProgress, btnGhost, btnPrimary } from "./quoteWizardUi"
import {
  clearSavedQuote,
  loadSavedQuote,
  storeSavedQuote,
  type SavedQuote,
} from "./quoteEditStore"

const QuoteMap = dynamic(() => import("./QuoteMap"), {
  ssr: false,
  loading: () => <div className="qmap animate-pulse bg-surface-muted" aria-hidden="true" />,
})

/** Heavy step UI (pickers, choices) — keep out of the quote route's critical First Load JS. */
const StepBody = dynamic(
  () => import("./QuoteWizardSteps").then((m) => m.StepBody),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[12rem] animate-pulse rounded-xl bg-surface-muted" aria-hidden="true" />
    ),
  },
)

export const QuoteWizard = ({
  className,
  formId = "quote",
  layout = "stack",
  heading,
  toolbar,
  preselectBus,
}: WizardProps) => {
  const locale = useLocale()
  const isAr = locale === "ar"
  const tx = (text: L10n) => pick(text, locale)
  const split = layout === "split"
  const reducedMotion = useReducedMotion()
  const draftStorageKey = `quote-wizard:${formId}`
  const [draftReady, setDraftReady] = useState(false)
  // Map tiles are only fetched where the sidebar is shown (matches the 1024px CSS breakpoint).
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const sync = () => setDesktop(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])
  const [state, setState] = useState<WizardState>(initialState)
  const [stepIndex, setStepIndex] = useState(0)
  const [dir, setDir] = useState<"fwd" | "back">("fwd")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error" | "rateLimited" | "locked">("idle")
  const [result, setResult] = useState<{ leadId?: string; sla: number; edited?: boolean } | null>(
    null,
  )
  // Last request sent from this browser (editable until staff pick it up),
  // and whether the wizard is currently editing it.
  const [saved, setSaved] = useState<SavedQuote | null>(null)
  const [editing, setEditing] = useState<SavedQuote | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const fleetBusClass = resolveQuoteBusClass(preselectBus)

  useEffect(() => {
    const record = loadSavedQuote()
    setSaved(record)
    // /quote?edit=1 (from the tracking page) opens the saved request straight away.
    if (record && new URLSearchParams(window.location.search).get("edit") === "1") {
      const next = { ...initialState, ...record.state }
      setEditing(record)
      setState(next)
      setStepIndex(computeSteps(next.customer).length - 1)
    }
  }, [])

  useEffect(() => {
    try {
      const serialized = sessionStorage.getItem(draftStorageKey)
      if (serialized) {
        const draft = JSON.parse(serialized) as {
          version?: number
          state?: WizardState
          stepIndex?: number
        }
        if (
          (draft.version === 1 || draft.version === 2) &&
          draft.state &&
          Array.isArray(draft.state.trips) &&
          draft.state.busCounts &&
          typeof draft.stepIndex === "number" &&
          Number.isInteger(draft.stepIndex)
        ) {
          const previousNotesIndex = draft.state.customer === "company" ? 5 : 4
          const restoredStepIndex =
            draft.version === 1 && draft.stepIndex >= previousNotesIndex
              ? draft.stepIndex - 1
              : draft.stepIndex
          // Fleet deep-link wins over a stale draft bus mix.
          setState({
            ...initialState,
            ...draft.state,
            ...(fleetBusClass ? { busCounts: { [fleetBusClass]: "1" } } : {}),
          })
          setStepIndex(Math.max(0, restoredStepIndex))
          setDraftReady(true)
          return
        }
      }
    } catch {
      try {
        sessionStorage.removeItem(draftStorageKey)
      } catch {}
    }
    if (fleetBusClass) {
      setState((s) => ({ ...s, busCounts: { [fleetBusClass]: "1" } }))
    }
    setDraftReady(true)
  }, [draftStorageKey, fleetBusClass])

  useEffect(() => {
    if (!draftReady || editing) return
    try {
      if (status === "done") {
        sessionStorage.removeItem(draftStorageKey)
        return
      }
      sessionStorage.setItem(
        draftStorageKey,
        JSON.stringify({ version: 2, state, stepIndex }),
      )
    } catch {}
  }, [draftReady, draftStorageKey, editing, state, stepIndex, status])

  const patch = (p: Partial<WizardState>) => {
    setState((s) => ({ ...s, ...p }))
    setErrors({})
  }

  const needsOrg = state.customer !== ""

  const steps = useMemo<StepId[]>(() => computeSteps(state.customer), [state.customer])

  // Bring the first validation message into view (e.g. consent below the fold on phones).
  useEffect(() => {
    if (!Object.keys(errors).length) return
    topRef.current
      ?.querySelector<HTMLElement>('[role="alert"]')
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [errors])

  const stepIndexSafe = Math.min(stepIndex, steps.length - 1)
  const step = steps[stepIndexSafe]

  /* ---- derived trip data ---- */

  const todayISO = getTodayISO()
  const mapView = () => getMapView(state)
  const finalStops = () => getRouteStops(state)
  const serviceType = getServiceType(state)
  const summaryRows = () => buildSummaryRows(state, locale, tx)

  /* ---- navigation ---- */

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }

  const goTo = (index: number, direction: "fwd" | "back") => {
    setDir(direction)
    setErrors({})
    setStepIndex(index)
    scrollTop()
  }

  const goNext = () => {
    const e = validateStep(step, state, tx, needsOrg)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    if (stepIndexSafe < steps.length - 1) goTo(stepIndexSafe + 1, "fwd")
  }

  const goBack = () => {
    if (stepIndexSafe > 0) goTo(stepIndexSafe - 1, "back")
  }

  const jumpTo = (id: StepId) => {
    const i = steps.indexOf(id)
    if (i >= 0) goTo(i, "back")
  }

  /* ---- submit ---- */

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (step !== "review") {
      goNext()
      return
    }
    const e = validateStep("review", state, tx, needsOrg)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setStatus("submitting")
    const parsed = quoteRequestSchema.safeParse(
      buildQuotePayload(state, serviceType, isAr, honeypot),
    )
    if (!parsed.success) {
      setStatus("error")
      return
    }
    // A network drop, or an old tab calling an action from a previous deploy, throws.
    const failed = { ok: false, messageKey: "error" } as const
    if (editing) {
      const response = await updateQuoteRequest(
        { quoteId: editing.quoteId, editToken: editing.editToken },
        parsed.data,
      ).catch(() => failed)
      if (response.ok) {
        setSaved(
          storeSavedQuote({
            quoteId: editing.quoteId,
            editToken: editing.editToken,
            leadId: response.leadId || editing.leadId,
            state,
          }),
        )
        setResult({ leadId: response.leadId || editing.leadId, sla: result?.sla || 24, edited: true })
        setEditing(null)
        setStatus("done")
        scrollTop()
      } else if (response.messageKey === "locked") {
        clearSavedQuote()
        setSaved(null)
        setStatus("locked")
      } else {
        setStatus(response.messageKey === "rateLimited" ? "rateLimited" : "error")
      }
      return
    }
    const response = await submitQuoteRequest(parsed.data).catch(() => failed)
    if (response.ok) {
      if (response.edit) {
        setSaved(storeSavedQuote({ ...response.edit, leadId: response.leadId, state }))
      }
      setResult({ leadId: response.leadId, sla: response.quoteSlaHours || 24 })
      setStatus("done")
      scrollTop()
    } else {
      setStatus(response.messageKey === "rateLimited" ? "rateLimited" : "error")
    }
  }

  const reset = () => {
    setState(initialState)
    setStepIndex(0)
    setErrors({})
    setResult(null)
    setEditing(null)
    setStatus("idle")
  }

  /** Reopens the last request at the review step, where every section has an Edit link. */
  const startEdit = (record: SavedQuote) => {
    const next = { ...initialState, ...record.state }
    setEditing(record)
    setState(next)
    setErrors({})
    setDir("back")
    setStepIndex(computeSteps(next.customer).length - 1)
    setStatus("idle")
    scrollTop()
  }

  /* ---- layout bits ---- */

  const shell = (children: ReactNode, mv?: MapView) => {
    if (split) {
      const view = mv ?? mapView()
      // The map only earns its space while the visitor is choosing the route.
      const showMap = desktop && step === "route" && status !== "done"
      // Live summary only shows what the visitor has reached — except a bus
      // chosen from the fleet page, which should appear in the details card right away.
      const rows =
        status === "done"
          ? []
          : summaryRows().filter((row) => {
              const i = steps.indexOf(row.id)
              if (i === -1) return false
              if (i <= stepIndexSafe) return true
              return Boolean(fleetBusClass) && row.id === "vehicle"
            })
      return (
        <div
          id={formId}
          ref={topRef}
          dir={isAr ? "rtl" : "ltr"}
          className={cn("qw-split text-start", className)}
        >
          <section className="qw-split__panel">
            {heading ? <h1 className="sr-only">{heading.title}</h1> : null}
            {children}
          </section>
          <aside className="qw-split__side">
            {status === "done" ? null : (
              <div data-lenis-prevent className={cn("qw-split__summary", !showMap && "qw-split__summary--solo")} aria-live="polite">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {tx(COPY.summaryTitle)}
                </h2>
                {rows.length ? (
                  <dl className="mt-3 divide-y divide-border">
                    {rows.map((row) => (
                      <div key={row.id + row.label.en} className="py-2.5 first:pt-0 last:pb-0">
                        <dt className="text-xs text-ink-muted">{tx(row.label)}</dt>
                        <dd className="mt-0.5 text-sm leading-snug font-medium text-ink">
                          {row.id === "vehicle" ? (
                            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                              {busClassOptions.map((option) => {
                                const count = Number(state.busCounts[option.id] ?? 0)
                                if (!count) return null
                                return (
                                  <div key={option.id} className="flex min-w-0 items-center gap-2">
                                    <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
                                      <Image
                                        src={busClassImages[option.id]}
                                        alt=""
                                        fill
                                        sizes="56px"
                                        className="object-contain"
                                      />
                                    </span>
                                    <span className="min-w-0 text-xs leading-snug">
                                      <span className="block font-semibold tabular-nums">{count} ×</span>
                                      <span className="block text-ink-muted">{tx(option.label)}</span>
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            row.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-3 text-sm text-ink-muted">{tx(COPY.summaryEmpty)}</p>
                )}
              </div>
            )}
            {showMap ? (
              <div className="qw-split__map qw-step qw-step--fwd" aria-label={tx({ en: "Route map", ar: "الخريطة", fr: "Carte de l'itinéraire", id: "Peta rute" })}>
                <QuoteMap
                  stops={view.stops}
                  context={view.context}
                  locale={locale}
                  still={reducedMotion}
                  className="qmap qmap--fill"
                />
              </div>
            ) : null}
          </aside>
        </div>
      )
    }
    return (
      <div
        id={formId}
        ref={topRef}
        dir={isAr ? "rtl" : "ltr"}
        className={cn(
          "rounded-2xl bg-surface-elevated/90 p-4 text-start ring-1 ring-border backdrop-blur-md sm:p-6 md:p-8",
          className,
        )}
      >
        {children}
      </div>
    )
  }

  /* ---- finished ---- */

  if (status === "done" && result) {
    return shell(
      <div data-lenis-prevent className={cn("qw-step qw-step--fwd", split && "min-h-0 flex-1 overflow-y-auto overscroll-contain")} role="status">
        {!split && finalStops().length > 1 ? (
          <QuoteMap stops={finalStops()} locale={locale} className="qmap mb-4" />
        ) : null}
        <p className="font-label text-[0.7rem] font-semibold tracking-[0.14em] text-orange uppercase">
          {tx(result.edited ? COPY.editRequest.savedEyebrow : COPY.done.eyebrow)}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
          {tx(result.edited ? COPY.editRequest.savedTitle : COPY.done.title)}
        </h3>
        {result.leadId ? (
          <p className="mt-3 rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink">
            {tx(COPY.done.number)}:{" "}
            <span className="font-mono font-semibold" dir="ltr">
              {result.leadId}
            </span>
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {tx(COPY.done.eta(result.sla))}
        </p>
        <dl className="mt-4 space-y-1.5 rounded-xl bg-surface-muted/60 px-4 py-3 text-sm">
          {summaryRows().map((row) => (
            <div key={row.id + row.value} className="flex flex-wrap gap-x-2">
              <dt className="text-ink-muted">{tx(row.label)}:</dt>
              <dd className="text-ink/80">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-ink/70">{tx(COPY.done.note)}</p>
        {saved ? <p className="mt-2 text-sm text-ink/70">{tx(COPY.editRequest.hint)}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {saved ? (
            <button type="button" className={btnPrimary} onClick={() => startEdit(saved)}>
              {tx(COPY.editRequest.open)}
            </button>
          ) : null}
          {result.leadId && !result.leadId.startsWith("DM-LOCAL") && result.leadId !== "DM-PREVIEW" ? (
            <Link href={{ pathname: "/track", query: { id: result.leadId } }} className={btnGhost}>
              {tx(COPY.done.track)}
            </Link>
          ) : null}
          <button type="button" className={btnGhost} onClick={reset}>
            {tx(COPY.done.another)}
          </button>
        </div>
      </div>,
      { stops: finalStops(), context: [] },
    )
  }

  /* ---- step bodies ---- */

  const mapData = step === "route" && !split ? mapView() : null

  const body = (
    <StepBody
      step={step}
      state={state}
      errors={errors}
      locale={locale}
      tx={tx}
      patch={patch}
      jumpTo={jumpTo}
      needsOrg={needsOrg}
      todayISO={todayISO}
      summaryRows={summaryRows}
    />
  )

  const isLast = stepIndexSafe === steps.length - 1
  const isChoiceStep = step === "customer" || step === "service"
  const choiceValue = step === "customer" ? state.customer : step === "service" ? state.service : ""
  const showContinue = !isChoiceStep || Boolean(choiceValue)
  const stepName = tx(COPY.stepNames[step])
  const stepLabel = tx(COPY.stepOf(stepIndexSafe + 1, steps.length, stepName))

  return shell(
    <>
      <div className={split ? "mb-[clamp(0.75rem,3vh,2.5rem)] shrink-0" : "mb-5"}>
        <StepProgress
          current={stepIndexSafe + 1}
          total={steps.length}
          counter={tx(COPY.stepCount(stepIndexSafe + 1, steps.length))}
          label={stepLabel}
          toolbar={toolbar}
        />
        <div className="sr-only" aria-live="polite">
          {stepLabel}
        </div>
      </div>

      {editing ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-orange/10 px-3.5 py-2.5 text-sm text-ink ring-1 ring-orange/25">
          <span className="font-medium">
            {tx(COPY.editRequest.editing(editing.leadId || ""))}
          </span>
          <button type="button" className="font-semibold text-orange underline-offset-4 hover:underline" onClick={reset}>
            {tx(COPY.editRequest.cancel)}
          </button>
        </div>
      ) : saved && stepIndexSafe === 0 && status !== "locked" ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted px-3.5 py-2.5 text-sm text-ink/80">
          <span>{tx(COPY.editRequest.banner(saved.leadId || ""))}</span>
          <button type="button" className="font-semibold text-orange underline-offset-4 hover:underline" onClick={() => startEdit(saved)}>
            {tx(COPY.editRequest.open)}
          </button>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        noValidate
        className={split ? "flex min-h-0 flex-1 flex-col gap-3" : "space-y-5"}
      >
        <div data-lenis-prevent className={split ? "qw-scroll @container flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain" : "@container space-y-5"}>
        <div key={step} className={cn("qw-step flex flex-col gap-[clamp(0.5rem,1.8vh,1rem)]", split && "min-h-0 flex-1", dir === "fwd" ? "qw-step--fwd" : "qw-step--back")}>
          <h2 className="shrink-0 font-display text-[clamp(1.125rem,3.4vh,1.5rem)] leading-[1.2] font-semibold tracking-[-0.015em] text-balance text-ink sm:text-[clamp(1.5rem,4.4vh,2.5rem)] sm:leading-[1.15] rtl:tracking-normal">
            {tx(COPY.titles[step])}
          </h2>

          {mapData ? (
            <QuoteMap
              stops={mapData.stops}
              context={mapData.context}
              locale={locale}
              still={reducedMotion}
              className="qmap"
            />
          ) : null}

          {body}

          {errors.choice ? (
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {errors.choice}
            </p>
          ) : null}
        </div>

        {/* honeypot */}
        <input
          type="text"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />

        {status === "error" || status === "rateLimited" ? (
          <div
            className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-800 ring-1 ring-red-200/80 dark:bg-red-950/60 dark:text-red-200 dark:ring-red-400/30"
            role="alert"
          >
            {tx(status === "rateLimited" ? COPY.rateLimited : COPY.error)}
          </div>
        ) : status === "locked" ? (
          <div
            className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-900 ring-1 ring-amber-200/80 dark:bg-amber-950/60 dark:text-amber-100 dark:ring-amber-400/30"
            role="alert"
          >
            {tx(COPY.editRequest.locked)}
          </div>
        ) : null}
        </div>

        <div className={split ? "flex shrink-0 flex-wrap items-center gap-2 border-t border-border pt-[clamp(0.5rem,1.6vh,1rem)]" : "flex flex-wrap items-center gap-2 pt-1"}>
          {stepIndexSafe > 0 ? (
            <button type="button" className={btnGhost} onClick={goBack}>
              {tx(COPY.back)}
            </button>
          ) : null}
          {isLast ? (
            <button
              type="submit"
              className={cn(btnPrimary, "ms-auto")}
              disabled={status === "submitting" || status === "locked"}
            >
              {editing
                ? tx(status === "submitting" ? COPY.editRequest.saving : COPY.editRequest.save)
                : status === "submitting"
                  ? tx(COPY.sending)
                  : tx(COPY.submit)}
            </button>
          ) : (
            <button
              type="submit"
              className={cn(btnPrimary, "ms-auto")}
              disabled={!showContinue}
            >
              {tx(COPY.next)}
            </button>
          )}
        </div>
      </form>
    </>,
  )
}
