// Localization audit changelog: replaced Real-time provider feed alerts, SLA escalation reminders, and Daily continuity summary with locale keys.
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useCopy } from '../i18n'

export default function Settings() {
  const t = useCopy()
  return <Page title={t.Settings} subtitle={t.titleSettings}><Card className="max-w-2xl divide-y divide-slate-100 p-5">{[t.settingRealtime, t.settingSla, t.settingDaily].map((label, index) => <label key={label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0"><span className="text-sm font-medium">{label}</span><input type="checkbox" defaultChecked={index < 2} className="size-4 accent-brand"/></label>)}</Card></Page>
}
