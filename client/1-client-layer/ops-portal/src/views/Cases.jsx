import CaseStrip from '../components/CaseStrip'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useCopy } from '../i18n'
export default function Cases({ data }) { const t=useCopy();return <Page title={t.Cases} subtitle={t.titleCases}><div className="space-y-4">{data.cases.length ? data.cases.map(item => <Card key={item.id} className="p-5"><CaseStrip cases={[item]} onRefresh={data.refresh}/></Card>) : <Card><CaseStrip cases={[]} onRefresh={data.refresh}/></Card>}</div></Page> }
