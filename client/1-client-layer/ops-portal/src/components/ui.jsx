// Localization/UI audit changelog: localized Nothing to review, no-active-scenarios, Refresh, and status accessibility text; added smooth severity colors, card lift, provider-badge hover, and reusable skeletons.
import { useAppStore } from '../store/useAppStore'
import { translateEnum, useCopy } from '../i18n'

export function Card({ children, className = '' }) {
  return <section className={`card-lift rounded-2xl border border-slate-200/80 bg-white shadow-card ${className}`}>{children}</section>
}

const badgeStyles = { healthy: 'bg-emerald-50 text-emerald-700', low: 'bg-emerald-50 text-emerald-700', watch: 'bg-amber-50 text-amber-700', medium: 'bg-amber-50 text-amber-700', high: 'bg-orange-50 text-orange-700', critical: 'bg-red-50 text-red-700', unreliable: 'bg-slate-100 text-slate-600', default: 'bg-slate-100 text-slate-600' }
export function Badge({ children, tone = 'default', className = '' }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-200 ease-in-out ${badgeStyles[tone] || badgeStyles.default} ${className}`}>{children}</span>
}

const dotStyles = { healthy: 'bg-emerald-500', low: 'bg-emerald-500', watch: 'bg-amber-500', medium: 'bg-amber-500', high: 'bg-orange-500', critical: 'bg-red-500', stale: 'bg-slate-400', unreliable: 'bg-slate-400' }
export function StatusDot({ status = 'healthy' }) {
  const language = useAppStore((state) => state.language)
  return <span aria-label={translateEnum(status, language)} className={`inline-block size-2 rounded-full transition-colors duration-200 ease-in-out ${dotStyles[status?.toLowerCase?.()] || dotStyles.stale}`} />
}

const providerStyles = { bkash: 'border-pink-200 bg-pink-50 text-[#9b0056]', nagad: 'border-orange-200 bg-orange-50 text-orange-700', rocket: 'border-purple-200 bg-purple-50 text-purple-700' }
export function ProviderBadge({ provider }) {
  const key = String(provider || '').toLowerCase()
  return <span className={`inline-flex rounded-full border px-2 py-0.5 font-semibold transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:brightness-95 hover:shadow-sm ${providerStyles[key] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>{provider}</span>
}

export function EmptyState({ title, message, action, onAction }) {
  const t = useCopy()
  return <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><div className="mb-4 grid size-11 place-items-center rounded-full bg-slate-100 text-lg">✓</div><h3 className="font-semibold">{title || t.nothingToReview}</h3><p className="mt-1 max-w-sm text-sm text-slate-500">{message || t.noScenarios}</p>{onAction && <button onClick={onAction} className="mt-5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">{action || t.refresh}</button>}</div>
}

export function FeedSkeleton() {
  return <div aria-hidden="true"><div className="mb-5 space-y-2"><div className="skeleton h-4 w-32 rounded"/><div className="skeleton h-3 w-52 rounded"/></div>{[0, 1, 2].map((item) => <div key={item} className="flex gap-3 border-t border-slate-100 py-4 first:border-0 first:pt-0"><div className="skeleton size-2 shrink-0 rounded-full"/><div className="flex-1 space-y-2"><div className="skeleton h-4 w-3/4 rounded"/><div className="skeleton h-3 w-1/2 rounded"/></div></div>)}</div>
}

export function ChartSkeleton() {
  return <div aria-hidden="true"><div className="mb-5 space-y-2"><div className="skeleton h-4 w-48 rounded"/><div className="skeleton h-3 w-64 max-w-full rounded"/></div><div className="flex h-[250px] items-end gap-3 rounded-xl border border-slate-100 p-5">{[35, 62, 48, 74, 56, 82, 64, 76, 50].map((height, index) => <div key={index} className="skeleton flex-1 rounded-t" style={{ height: `${height}%` }}/>)}</div></div>
}
