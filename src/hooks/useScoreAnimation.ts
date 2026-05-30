// hooks/useScoreAnimation.ts
// animates a number from its current value to a new target — eased, 60fps

import { useState, useEffect, useRef } from 'react'

// ease out — fast start, slows near the end
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function useScoreAnimation(target: number, duration = 800): number {
  const [displayed, setDisplayed] = useState(target)
  const startRef    = useRef<number | null>(null)
  const startValRef = useRef(target)
  const rafRef      = useRef<number | null>(null)

  useEffect(() => {
    startRef.current    = null
    startValRef.current = displayed

    function animate(timestamp: number) {
      if (startRef.current === null) {
        startRef.current = timestamp
      }
      const elapsed  = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased    = easeOutQuart(progress)
      const current  = Math.round(startValRef.current + (target - startValRef.current) * eased)
      setDisplayed(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return displayed
}