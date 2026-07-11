import { useEffect, useRef, useState } from 'react'

// Prevents a skeleton flash for instant replay responses, then keeps a displayed skeleton stable long enough to read as intentional.
export function useDelayedLoading(loading, delay = 140, minimum = 360) {
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    let timer
    if (loading && !visible) {
      timer = setTimeout(() => { shownAt.current = Date.now(); setVisible(true) }, delay)
    } else if (!loading && visible) {
      timer = setTimeout(() => setVisible(false), Math.max(0, minimum - (Date.now() - shownAt.current)))
    }
    return () => clearTimeout(timer)
  }, [delay, loading, minimum, visible])

  return visible
}
