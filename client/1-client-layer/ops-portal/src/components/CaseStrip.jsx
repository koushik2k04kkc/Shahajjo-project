// Localization/UI audit changelog: localized No active cases, routed-case empty copy, Open case, priority/status values, case title/owner, and SLA numerals/time.
import { ArrowUpRight } from 'lucide-react'
import Stepper from './Stepper'
import { Badge, EmptyState } from './ui'
import { useAppStore } from '../store/useAppStore'
import { translateEnum, useCopy } from '../i18n'
import { formatRelativeTime, localizeField } from '../lib/formatters'

export default function CaseStrip({ cases = [], onOpen, onRefresh }) {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  if (!cases.length) return <EmptyState title={t.noActiveCases} message={t.noCasesMessage} onAction={onRefresh}/>
  const item = cases[0]
  const tone = String(item.priority || '').toLowerCase()
  return <div className="grid gap-6 lg:grid-cols-[260px_1fr_44px] lg:items-center"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-brand">{item.id}</span><Badge tone={tone}>{translateEnum(item.priority, language)}</Badge></div><h3 className="mt-1 text-sm font-semibold">{localizeField(item, 'title', language)}</h3><p className="mt-1 text-xs text-slate-500">{localizeField(item, 'owner', language)} · {formatRelativeTime(item.sla, language, t)}</p></div><Stepper steps={item.steps} currentStep={item.currentStep}/>{onOpen && <button onClick={onOpen} className="grid size-10 place-items-center justify-self-end rounded-xl border border-slate-200 text-slate-500 hover:border-brand hover:text-brand" aria-label={t.openCase}><ArrowUpRight className="size-4"/></button>}</div>
}
