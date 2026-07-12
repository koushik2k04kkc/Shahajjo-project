import { useEffect, useState } from 'react'
import { getSocket } from '../../../sockets/socketClient'
import { normalizeAlertPayload } from './normalizeAlertPayload'

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState([])
  const [latest, setLatest] = useState(null)
  useEffect(() => {
    const socket = getSocket()
    const receive = (payload) => {
      const alert = normalizeAlertPayload(payload)
      if (!alert) return
      setAlerts((current) => [alert, ...current.filter((item) => item.id !== alert.id)])
      setLatest(alert)
    }
    socket.on('alert:new', receive)
    socket.connect()
    return () => {
      socket.off('alert:new', receive)
      socket.disconnect()
    }
  }, [])
  return { alerts, latest, dismiss: (id) => setAlerts((items) => items.filter((item) => item.id !== id)), clearLatest: () => setLatest(null) }
}
