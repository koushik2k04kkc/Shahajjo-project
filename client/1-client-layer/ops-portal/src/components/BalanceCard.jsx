// Localization/UI audit changelog: localized provider/shared wallet descriptors, balances, low-confidence text, delay/shortage times, Bangla numerals, and BDT formatting; provider brands remain Latin by policy.
import { StatusDot } from './ui'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'
import { formatCurrency, formatPercent, formatRelativeTime } from '../lib/formatters'

const brands = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket' }

export default function BalanceCard({ item }) {
  const language = useAppStore((state) => state.language)
  const t = useCopy()
  const stale = item.status === 'stale' || item.amount == null
  const label = item.kind === 'shared' ? t.sharedReserve : `${brands[item.id] || item.label} ${t.wallet}`
  const change = item.change || '+0.0%'
  return <article className={`card-lift min-w-0 rounded-2xl border bg-white p-4 shadow-card lg:p-5 ${item.kind === 'shared' ? 'border-slate-400 ring-2 ring-slate-100' : 'border-slate-200/80'}`}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-medium text-slate-500"><span className="size-2.5 rounded-full transition-transform duration-200 hover:scale-125" style={{ backgroundColor: item.color }}/>{label}</div><span className="text-[11px] text-slate-400">{formatRelativeTime(item.updatedAt, language, t)}</span></div><p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.kind === 'shared' ? t.pooledReserve : t.providerWallet}</p>{stale ? <div className="mt-4"><div className="text-lg font-semibold text-slate-400">{t.unavailable}</div><div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500"><StatusDot status="stale"/>{t.delayed} {formatRelativeTime(`${item.delayedMinutes}m`, language, t)}</div><span className="mt-2 inline-flex rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 transition-colors duration-200">{t.lowConfidence} · {formatPercent(item.confidence, language)}</span></div> : <div className="mt-4"><div className="flex items-end justify-between gap-3"><div className="truncate text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(item.amount, language)}</div><div className={`pb-0.5 text-xs font-semibold ${change.startsWith('+') ? 'text-emerald-600' : 'text-orange-600'}`}>{language === 'BN' ? change.replace(/\d+(?:\.\d+)?/, (value) => formatPercent(value, language).replace('%', '')) : change}</div></div>{item.shortageIn && <span className="mt-2 inline-flex rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-800">{formatRelativeTime(item.shortageIn.replace('~', ''), language, t)}</span>}</div>}</article>
}
