// Localization/UI audit changelog: localized demo agent/location fields and kept Refresh accessibility copy locale-bound; wired guarded chart/feed skeletons into replay loading.
import { RefreshCw } from 'lucide-react'
import AlertFeed from '../components/AlertFeed'
import BalanceCard from '../components/BalanceCard'
import CaseStrip from '../components/CaseStrip'
import ContinuityChart from '../components/ContinuityChart'
import { Card } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'
import { localizeField } from '../lib/formatters'

export default function Overview({ data }) {
  const setActiveView = useAppStore((state) => state.setActiveView)
  const language = useAppStore((state) => state.language)
  const t = useCopy()
  const d = data || {}
  const overview = d.overview || {}
  const agent = overview.agent || { name: 'Loading...', location: '' }
  const balances = overview.balances || overview.providers || []
  return <>
    <div className="mb-6 flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{localizeField(agent, 'name', language)}</h1>{d.isDemo && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">{t.demo}</span>}</div><p className="mt-1 text-sm text-slate-500">{localizeField(agent, 'location', language)} · {t.healthy}</p></div><button onClick={d.refresh} className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-brand" aria-label={t.refresh}><RefreshCw className={`size-4 ${d.loading ? 'animate-spin' : ''}`}/></button></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{balances.map((item) => <BalanceCard key={item.id} item={item}/>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(350px,2fr)]"><Card className="p-4 sm:p-5"><ContinuityChart data={d.liquidity} loading={d.loading}/></Card><Card className="p-4 sm:p-5"><AlertFeed alerts={d.alerts} onRefresh={d.refresh} loading={d.loading}/></Card></div>
    <Card className="mt-5 p-4 sm:p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">{t.activeCase}</h2><p className="mt-0.5 text-xs text-slate-500">{t.caseHint}</p></div><button onClick={() => setActiveView('Cases')} className="text-xs font-semibold text-brand">{t.viewAll}</button></div><CaseStrip cases={d.cases} onOpen={() => setActiveView('Cases')} onRefresh={d.refresh}/></Card>
  </>
}
