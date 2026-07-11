import { mockMetrics } from '../data/mockData'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useCopy } from '../i18n'
export default function Metrics() { const t=useCopy();return <Page title={t.Metrics} subtitle={t.titleMetrics}><div className="grid gap-4 sm:grid-cols-3">{mockMetrics.map(metric => <Card className="p-5" key={metric.label}><p className="text-sm text-slate-500">{metric.label}</p><p className="mt-3 text-3xl font-bold">{metric.value}</p><p className="mt-2 text-xs font-semibold text-emerald-600">{metric.hint}</p></Card>)}</div></Page> }
