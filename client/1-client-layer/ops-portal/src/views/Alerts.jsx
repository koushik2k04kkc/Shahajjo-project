import AlertFeed from '../components/AlertFeed'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useCopy } from '../i18n'
export default function Alerts({ data }) { const t=useCopy();return <Page title={t.Alerts} subtitle={t.titleAlerts}><Card className="max-w-3xl p-5"><AlertFeed alerts={data.alerts} onRefresh={data.refresh}/></Card></Page> }
