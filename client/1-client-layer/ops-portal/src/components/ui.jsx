export function Card({ children, className = '' }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-card ${className}`}>{children}</section>
}

const badgeStyles = { healthy: 'bg-emerald-50 text-emerald-700', watch: 'bg-amber-50 text-amber-700', high: 'bg-orange-50 text-orange-700', critical: 'bg-red-50 text-red-700', unreliable: 'bg-slate-100 text-slate-600', default: 'bg-slate-100 text-slate-600' }
export function Badge({ children, tone = 'default', className = '' }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyles[tone] || badgeStyles.default} ${className}`}>{children}</span>
}

const dotStyles = { healthy: 'bg-emerald-500', watch: 'bg-amber-500', high: 'bg-orange-500', critical: 'bg-red-500', stale: 'bg-slate-400', unreliable: 'bg-slate-400' }
export function StatusDot({ status = 'healthy' }) {
  return <span aria-label={status} className={`inline-block size-2 rounded-full ${dotStyles[status] || dotStyles.stale}`} />
}

export function EmptyState({ title = 'Nothing to review', message = 'There are no active scenarios right now.', action = 'Refresh', onAction }) {
  return <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><div className="mb-4 grid size-11 place-items-center rounded-full bg-slate-100 text-lg">✓</div><h3 className="font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p><button onClick={onAction} className="mt-5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">{action}</button></div>
}
