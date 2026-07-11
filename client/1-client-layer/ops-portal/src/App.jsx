import DashboardLayout from './layouts/DashboardLayout'
import { useDashboardData } from './hooks/useDashboardData'
import { useAppStore } from './store/useAppStore'
import Overview from './views/Overview'
import Liquidity from './views/Liquidity'
import Alerts from './views/Alerts'
import Cases from './views/Cases'
import Metrics from './views/Metrics'
import Settings from './views/Settings'

const views = { Overview, Liquidity, Alerts, Cases, Metrics, Settings }

export default function App() {
  const activeView = useAppStore((state) => state.activeView)
  const data = useDashboardData()
  const View = views[activeView] || Overview
  return <DashboardLayout><View data={data}/></DashboardLayout>
}
