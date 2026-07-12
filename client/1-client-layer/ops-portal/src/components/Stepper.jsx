// Localization/UI audit changelog: localized Pending tooltip, backend step enums, clock tooltips, and step numerals.
import { useAppStore } from '../store/useAppStore'
import { translateEnum, useCopy } from '../i18n'
import { formatClock, formatNumber } from '../lib/formatters'

export default function Stepper({ steps = [], currentStep = 0 }) {
  const language = useAppStore((state) => state.language)
  const t = useCopy()
  return <div className="relative flex justify-between"><div className="absolute left-3 right-3 top-3 h-px bg-slate-200" />{steps.map((step, index) => {
    const complete = index <= currentStep
    return <div key={`${step.label}-${index}`} className="group relative z-10 flex flex-1 flex-col items-center text-center"><button type="button" title={step.time ? formatClock(step.time, language) : t.pending} className={`grid size-6 place-items-center rounded-full border-2 text-[10px] font-bold transition-all duration-200 ${complete ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-slate-400'}`}>{complete ? '✓' : formatNumber(index + 1, language)}</button><span className={`mt-2 text-[10px] font-semibold transition-colors duration-200 sm:text-xs ${complete ? 'text-slate-700' : 'text-slate-400'}`}>{translateEnum(step.label, language)}</span>{step.time && <span className="pointer-events-none absolute top-8 z-20 hidden whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block group-focus-within:block">{formatClock(step.time, language)}</span>}</div>
  })}</div>
}
