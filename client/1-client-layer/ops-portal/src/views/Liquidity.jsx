import ContinuityChart from '../components/ContinuityChart'
import BalanceCard from '../components/BalanceCard'
import { Card } from '../components/ui'
import { useCopy } from '../i18n'
export default function Liquidity({ data }) { const t=useCopy();return <Page title={t.Liquidity} subtitle={t.titleLiquidity}><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{data.overview.balances.map(item => <BalanceCard item={item} key={item.id}/>)}</div><Card className="mt-5 p-5"><ContinuityChart data={data.liquidity}/></Card></Page> }
export function Page({ title, subtitle, children }) { return <><div className="mb-6"><h1 className="text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{children}</> }
