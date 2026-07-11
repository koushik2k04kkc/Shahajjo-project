import { useState } from 'react'
import { ChevronDown, Clock3, UserRoundCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AlertStageTracker from './AlertStageTracker'

export default function AlertList({ alerts = [] }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(alerts[0]?.id)
  if (!alerts.length) return <p className="py-10 text-center text-sm text-slate-500">{t('noAlerts')}</p>
  return <div className="divide-y divide-slate-100">{alerts.map((alert) => {
    const expanded = open === alert.id
    const bn = i18n.language === 'bn'
    const low = alert.confidence < 70
    return <article key={alert.id} className="py-4 first:pt-0"><button onClick={() => setOpen(expanded ? null : alert.id)} className="flex w-full items-start gap-3 text-left"><span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${alert.severity === 'high' ? 'bg-orange-500' : 'bg-slate-400'}`}/><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{bn ? alert.titleBn : alert.title}</span><span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">{alert.provider} · {alert.time}<em className={`rounded-full px-2 py-0.5 not-italic font-bold ${low ? 'bg-slate-200 text-slate-700' : 'bg-emerald-50 text-emerald-700'}`}>{low ? 'Low confidence' : 'Confidence'} · {alert.confidence}%</em></span></span><ChevronDown className={`size-4 text-slate-400 transition ${expanded ? 'rotate-180' : ''}`}/></button>
      {expanded && <div className="ml-5 mt-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600"><p>{bn ? alert.situationBn : alert.situation}</p><p className="mt-2"><b className="text-slate-800">Evidence:</b> {bn ? alert.evidenceBn : alert.evidence}</p><p className="mt-2"><b className="text-slate-800">{t('safeStep')}:</b> {bn ? alert.actionBn : alert.action}</p><div className="mt-3 flex flex-wrap gap-2"><span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-bold text-slate-700"><UserRoundCheck className="size-3"/>{alert.owner}</span><span className="rounded-full bg-amber-100 px-2.5 py-1 font-bold text-amber-800">{alert.status}</span></div><AlertStageTracker status={alert.status} currentStep={alert.currentStep}/><div className="mt-3 border-l-2 border-slate-200 pl-3">{alert.history?.map((event) => <p key={event} className="flex items-center gap-2 py-0.5 text-slate-500"><Clock3 className="size-3"/>{event}</p>)}</div><p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700"><b>Final outcome:</b> {alert.finalStatus || 'Not finalized — human review pending'}</p></div>}
    </article>
  })}</div>
}
