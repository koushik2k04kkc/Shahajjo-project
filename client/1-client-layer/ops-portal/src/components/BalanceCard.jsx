import { StatusDot } from './ui'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'

const money = new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })

export default function BalanceCard({ item }) {
  const bn = useAppStore((state) => state.language === 'BN')
  const t = useCopy()
  const stale = item.status === 'stale' || item.amount == null
  return <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card lg:p-5">
    <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-medium text-slate-500"><span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />{bn&&item.labelBn?item.labelBn:item.label}</div><span className="text-[11px] text-slate-400">{item.updatedAt==='Now'?t.now:item.updatedAt}</span></div>
    {stale ? <div className="mt-5"><div className="text-lg font-semibold text-slate-400">{t.unavailable}</div><div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500"><StatusDot status="stale" />{t.delayed} {item.delayedMinutes}m</div></div> : <div className="mt-5 flex items-end justify-between gap-3"><div className="truncate text-2xl font-bold tracking-tight text-slate-900">{money.format(item.amount).replace('BDT', '৳')}</div><div className={`pb-0.5 text-xs font-semibold ${item.change.startsWith('+') ? 'text-emerald-600' : 'text-orange-600'}`}>{item.change}</div></div>}
  </article>
}
