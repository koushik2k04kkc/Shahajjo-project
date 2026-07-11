import { useEffect, useMemo, useState } from 'react'

export function useSlaTimer(deadline) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  return useMemo(() => {
    const remaining = Math.max(0, new Date(deadline).getTime() - now)
    const total = Math.floor(remaining / 1000)
    return { remaining, expired: remaining === 0, hours: Math.floor(total / 3600), minutes: Math.floor(total % 3600 / 60), seconds: total % 60 }
  }, [deadline, now])
}
