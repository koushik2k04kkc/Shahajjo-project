// Localization/UI audit changelog: localized All clear, filters-empty copy, incident/risk/confidence labels, Low/Medium/High/Critical and backend statuses, ownership/outcome text, step tooltips, relative/history times, and AI summary copy; added guarded feed skeleton and fade-slide summary motion.
import { useState } from 'react'
import { ChevronDown, ChevronRight, Clock3, Sparkles, UserRoundCheck } from 'lucide-react'
import { Badge, EmptyState, FeedSkeleton, ProviderBadge, StatusDot } from './ui'
import { useAppStore } from '../store/useAppStore'
import { translateEnum, useCopy } from '../i18n'
import { formatClock, formatPercent, formatRelativeTime, localizeField } from '../lib/formatters'
import { useDelayedLoading } from '../hooks/useDelayedLoading'
import Stepper from './Stepper'

const alertSteps = ['Detected', 'Assigned', 'Acknowledged', 'Human review', 'Resolved'].map((label) => ({ label }))

export default function AlertFeed({ alerts = [], onRefresh, loading = false }) {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  const [open, setOpen] = useState(alerts[0]?.id)
  const [normalOpen, setNormalOpen] = useState(null)
  const showSkeleton = useDelayedLoading(loading)
  if (showSkeleton) return <FeedSkeleton/>
  if (!alerts.length) return <EmptyState title={t.allClear} message={t.noMatchingAlerts} onAction={onRefresh}/>
  return <div className="transition-opacity duration-200"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">{t.alertFeed}</h2><p className="mt-0.5 text-xs text-slate-500">{t.alertHint}</p></div><Badge>{formatNumberSafe(alerts.length, language)} {t.active}</Badge></div><div className="divide-y divide-slate-100">{alerts.map((alert) => {
    const expanded = open === alert.id
    const lowConfidence = alert.confidence < 70
    const severity = String(alert.severity || 'medium').toLowerCase()
    const history = localizeField(alert, 'history', language) || []
    return <article key={alert.id} className="rounded-xl px-1 py-3 transition-colors duration-200 first:pt-0 last:pb-0 hover:bg-brand/[.025]"><button className="flex w-full items-start gap-3 text-left" onClick={() => setOpen(expanded ? null : alert.id)} aria-expanded={expanded}><span className="mt-1.5"><StatusDot status={severity}/></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3"><span className="text-sm font-semibold leading-5 text-slate-800">{localizeField(alert, 'title', language)}</span><span className="whitespace-nowrap text-[10px] text-slate-400">{formatRelativeTime(alert.time, language, t)}</span></span><span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500"><ProviderBadge provider={alert.provider}/><span>{localizeField(alert, 'area', language)} · {alert.id}</span><Badge tone={severity}>{t.riskScore}: {translateEnum(severity, language)}</Badge><em className={`rounded-full px-2 py-0.5 not-italic font-bold transition-colors duration-200 ${lowConfidence ? 'bg-slate-200 text-slate-700' : 'bg-emerald-50 text-emerald-700'}`}>{lowConfidence ? t.lowConfidence : t.confidence} · {formatPercent(alert.confidence, language)}</em></span></span>{expanded ? <ChevronDown className="mt-1 size-4 text-slate-400"/> : <ChevronRight className="mt-1 size-4 text-slate-400"/>}</button>{expanded && <div className="incident-enter ml-5 mt-3 rounded-xl bg-slate-50 p-4 text-xs leading-5"><div className="mb-3 rounded-xl border border-brand/10 bg-gradient-to-r from-brand/[.07] to-white p-3"><div className="mb-1 flex items-center gap-1.5 font-bold text-brand"><Sparkles className="size-3.5"/>{t.aiSummary}</div><p className="text-slate-700">{localizeField(alert, 'situation', language)}</p></div><Field label={t.evidence} value={localizeField(alert, 'evidence', language)}/><Field label={t.safeStep} value={localizeField(alert, 'action', language)}/><div className="mt-3 flex flex-wrap gap-2"><span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-bold"><UserRoundCheck className="size-3"/>{localizeOwner(alert, language)}</span><Badge tone={severity}>{translateEnum(alert.status, language)}</Badge></div><p className="mt-2 text-slate-500">{t.ownedBy} {translateEnum(alert.assignedBy, language)} · {t.assignedTo} {localizeOwner(alert, language)}</p><div className="mt-4"><Stepper steps={alert.steps || alertSteps} currentStep={alert.currentStep ?? (String(alert.status).toLowerCase().includes('review') ? 3 : 1)}/></div><div className="mt-3 border-l-2 border-slate-200 pl-3">{history.map((event) => <HistoryEvent key={event} event={event} language={language}/>)}</div><button className="mt-2 flex items-center gap-1 font-semibold text-slate-500" onClick={() => setNormalOpen(normalOpen === alert.id ? null : alert.id)}><ChevronRight className={`size-3 transition-transform duration-200 ${normalOpen === alert.id ? 'rotate-90' : ''}`}/>{t.whyNormal}</button>{normalOpen === alert.id && <p className="incident-enter mt-1 pl-4 text-slate-500">{localizeField(alert, 'normal', language)}</p>}<p className="mt-3 rounded-lg border border-slate-200 bg-white p-2 font-semibold text-slate-700"><b>{t.finalOutcome}:</b> {localizeField(alert, 'finalStatus', language) || translateEnum('pending_human_review', language)}</p></div>}</article>
  })}</div></div>
}

function Field({ label, value }) { return <p className="mb-1.5"><strong className="text-slate-700">{label}:</strong> <span className="text-slate-600">{value}</span></p> }
function localizeOwner(item, language) { return language === 'BN' ? item.ownerBn || translateEnum(item.owner, language) : item.owner }
function formatNumberSafe(value, language) { return new Intl.NumberFormat(language === 'BN' ? 'bn-BD' : 'en-BD').format(value) }
function HistoryEvent({ event, language }) { const [time, ...copy] = String(event).split(' · '); return <p className="flex items-center gap-2 py-0.5 text-slate-500"><Clock3 className="size-3"/>{copy.length ? `${formatClock(time, language)} · ${copy.join(' · ')}` : event}</p> }
