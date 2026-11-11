import { useEffect, useState } from 'react'

export const MOBILE_MAX_WIDTH = 768

function readWidth(): number {
  return typeof window === 'undefined' ? 1280 : window.innerWidth
}

// current viewport width — updates on resize and rotation
export function useViewportWidth(): number {
  const [width, setWidth] = useState(readWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return width
}

// true on phone-sized screens; only re-renders when crossing the breakpoint
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => readWidth() <= MOBILE_MAX_WIDTH)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}