import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Badge, EmptyState, StatusDot } from './ui'
import { useCopy } from '../i18n'

export default function AlertFeed({ alerts = [], onRefresh }) {
  const t = useCopy()
  const [open, setOpen] = useState(alerts[0]?.id)
  const [normalOpen, setNormalOpen] = useState(null)
  if (!alerts.length) return <EmptyState title="All clear" message="No alerts require review." onAction={onRefresh} />
  return <div>
    <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">{t.alertFeed}</h2><p className="mt-0.5 text-xs text-slate-500">{t.alertHint}</p></div><Badge>{alerts.length} {t.active}</Badge></div>
    <div className="divide-y divide-slate-100">{alerts.map((alert) => {
      const expanded = open === alert.id
      return <article key={alert.id} className="py-3 first:pt-0 last:pb-0">
        <button className="flex w-full items-start gap-3 text-left" onClick={() => setOpen(expanded ? null : alert.id)} aria-expanded={expanded}>
          <span className="mt-1.5"><StatusDot status={alert.severity} /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3"><span className="text-sm font-semibold leading-5 text-slate-800">{alert.title} <span className="whitespace-nowrap text-[10px] text-slate-400">{alert.confidence}%</span></span><span className="whitespace-nowrap text-[10px] text-slate-400">{alert.time}</span></span><span className="mt-1 block text-xs text-slate-500">{alert.provider} · {alert.id}</span></span>{expanded ? <ChevronDown className="mt-1 size-4 text-slate-400"/> : <ChevronRight className="mt-1 size-4 text-slate-400"/>}
        </button>
        {expanded && <div className="ml-5 mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5"><Field label={t.situation} value={alert.situation}/><Field label={t.evidence} value={alert.evidence}/><Field label={t.safeStep} value={alert.action}/><button className="mt-2 flex items-center gap-1 font-semibold text-slate-500" onClick={() => setNormalOpen(normalOpen === alert.id ? null : alert.id)}><ChevronRight className={`size-3 transition ${normalOpen === alert.id ? 'rotate-90' : ''}`}/>{t.whyNormal}</button>{normalOpen === alert.id && <p className="mt-1 pl-4 text-slate-500">{alert.normal}</p>}</div>}
      </article>
    })}</div>
  </div>
}

function Field({ label, value }) { return <p className="mb-1.5"><strong className="text-slate-700">{label}:</strong> <span className="text-slate-600">{value}</span></p> }
