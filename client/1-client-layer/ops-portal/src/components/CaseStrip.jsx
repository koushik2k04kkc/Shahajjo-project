import { ArrowUpRight } from 'lucide-react'
import Stepper from './Stepper'
import { Badge, EmptyState } from './ui'

export default function CaseStrip({ cases = [], onOpen, onRefresh }) {
  if (!cases.length) return <EmptyState title="No active cases" message="New cases will appear here when an alert is routed." onAction={onRefresh}/>
  const item = cases[0]
  return <div className="grid gap-6 lg:grid-cols-[260px_1fr_44px] lg:items-center"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-brand">{item.id}</span><Badge tone="high">{item.priority}</Badge></div><h3 className="mt-1 text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs text-slate-500">{item.owner} · {item.sla}</p></div><Stepper steps={item.steps} currentStep={item.currentStep}/><button onClick={onOpen} className="grid size-10 place-items-center justify-self-end rounded-xl border border-slate-200 text-slate-500 hover:border-brand hover:text-brand" aria-label="Open case"><ArrowUpRight className="size-4"/></button></div>
}

e