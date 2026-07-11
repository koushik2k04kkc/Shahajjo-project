import DashboardLayout from './layouts/DashboardLayout'
import './styles/ops-theme.css'
import { useDashboardData } from './hooks/useDashboardData'
import { useAppStore } from './store/useAppStore'
import Overview from './views/Overview'
import Liquidity from './views/Liquidity'
import Alerts from './views/Alerts'
import Cases from './views/Cases'
import Metrics from './views/Metrics'
import Settings from './views/Settings'
import Help from './views/Help'

const views = { Overview, Liquidity, Alerts, Cases, Metrics, Settings, Help }

export default function App({ onSwitchRole }) {
  const activeView = useAppStore((state) => state.activeView)
  const data = useDashboardData()
  const View = views[activeView] || Overview
  return <DashboardLayout onSwitchRole={onSwitchRole}><div key={activeView} className="incident-enter"><View data={data}/></div></DashboardLayout>
}
