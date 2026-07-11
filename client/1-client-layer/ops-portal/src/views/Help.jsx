// Localization audit changelog: localized Help & FAQ title/subtitle and all confidence, unusual-signal, history, and operations-support questions/answers.
import { BookOpenCheck, CircleHelp, Headphones, ShieldCheck } from 'lucide-react'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useCopy } from '../i18n'

export default function Help() {
  const t = useCopy()
  const items = [[CircleHelp, 'text-brand', t.helpConfidenceQ, t.helpConfidenceA], [ShieldCheck, 'text-emerald-600', t.helpSignalQ, t.helpSignalA], [BookOpenCheck, 'text-sky-600', t.helpHistoryQ, t.helpHistoryA], [Headphones, 'text-purple-600', t.helpSupportQ, t.helpSupportA]]
  return <Page title={t.Help} subtitle={t.helpSubtitle}><div className="grid max-w-4xl gap-4 md:grid-cols-2">{items.map(([Icon, color, title, copy]) => <Card className="p-5" key={title}><Icon className={`size-6 ${color}`}/><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></Card>)}</div></Page>
}
