// Localization/UI audit changelog: localized Provider, Agent, Area, Time, All, Any time, Last hour, Clear filters, and area option labels while preserving filter/API values.
import { useState } from 'react'
import AlertFeed from '../components/AlertFeed'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'
import { localizeField } from '../lib/formatters'

const initialFilters = { provider: 'All', agent: 'All', area: 'All', time: 'All' }

export default function Alerts({ data }) {
  const t = useCopy()
  const [filters, setFilters] = useState(initialFilters)
  const alerts = data.alerts.filter((alert) => Object.entries(filters).every(([key, value]) => value === 'All' || alert[key === 'time' ? 'timeBucket' : key] === value))
  return <Page title={t.Alerts} subtitle={t.titleAlerts}><FilterBar alerts={data.alerts} value={filters} onChange={setFilters}/><Card className="max-w-4xl p-5"><AlertFeed alerts={alerts} onRefresh={data.refresh} loading={data.loading}/></Card></Page>
}

function FilterBar({ alerts, value, onChange }) {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  const choices = (key) => ['All', ...new Set(alerts.map((alert) => alert[key]).filter(Boolean))]
  const optionLabel = (key, item) => {
    if (item === 'All') return t.all
    if (key === 'area') return localizeField(alerts.find((alert) => alert.area === item) || { area: item }, 'area', language)
    return item
  }
  return <div className="mb-4 flex max-w-4xl flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">{[['provider', t.provider], ['agent', t.agent], ['area', t.area]].map(([key, label]) => <label key={key} className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}<select value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} className="mt-1 block min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors duration-200">{choices(key).map((item) => <option key={item} value={item}>{optionLabel(key, item)}</option>)}</select></label>)}<label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{t.time}<select value={value.time} onChange={(event) => onChange({ ...value, time: event.target.value })} className="mt-1 block min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"><option value="All">{t.anyTime}</option><option value="1h">{t.lastHour}</option></select></label><button onClick={() => onChange(initialFilters)} className="ml-auto self-end rounded-xl px-3 py-2 text-xs font-bold text-brand">{t.clearFilters}</button></div>
}
