import { useTranslation } from 'react-i18next'
import BalanceCard from '../features/balance/components/BalanceCard'
import BalanceHistoryChart from '../features/balance/components/BalanceHistoryChart'
export default function BalanceRoute({balance}){const{t}=useTranslation();return <><h1 className="text-2xl font-bold">{t('balance')}</h1><div className="mt-5 grid gap-3 sm:grid-cols-3">{balance.providers.map(p=><BalanceCard key={p.id} item={p}/>)}</div><section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><h2 className="font-bold">{t('continuity')}</h2><p className="text-xs text-slate-500">{t('continuityHint')}</p><BalanceHistoryChart/></section></>}
