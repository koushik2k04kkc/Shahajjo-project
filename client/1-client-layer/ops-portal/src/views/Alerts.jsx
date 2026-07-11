import { useState } from 'react'
import AlertFeed from '../components/AlertFeed'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useCopy } from '../i18n'

export default function Alerts({ data }) {
  const t = useCopy(); const [filters, setFilters] = useState({ provider: 'All', agent: 'All', area: 'All', time: 'All' }); const alerts = data.alerts.filter((alert) => Object.entries(filters).every(([key, value]) => value === 'All' || alert[key === 'time' ? 'timeBucket' : key] === value))
  return <Page title={t.Alerts} subtitle={t.titleAlerts}><FilterBar alerts={data.alerts} value={filters} onChange={setFilters}/><Card className="max-w-4xl p-5"><AlertFeed alerts={alerts} onRefresh={data.refresh}/></Card></Page>
}

function FilterBar({ alerts, value, onChange }) { const choices = (key) => ['All', ...new Set(alerts.map((alert) => alert[key]).filter(Boolean))]; return <div className="mb-4 flex max-w-4xl flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">{[['provider', 'Provider'], ['agent', 'Agent'], ['area', 'Area']].map(([key, label]) => <label key={key} className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}<select value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} className="mt-1 block min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">{choices(key).map((item) => <option key={item}>{item}</option>)}</select></label>)}<label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Time<select value={value.time} onChange={(event) => onChange({ ...value, time: event.target.value })} className="mt-1 block min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"><option value="All">Any time</option><option value="1h">Last hour</option></select></label><button onClick={() => onChange({ provider: 'All', agent: 'All', area: 'All', time: 'All' })} className="ml-auto self-end rounded-xl px-3 py-2 text-xs font-bold text-brand">Clear filters</button></div> }
