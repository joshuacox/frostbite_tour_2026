'use client'

import { useEffect, useState } from 'react'
import { Snowfall } from '@namnguyenthanhwork/react-snowfall-effect'

export default function SnowfallWrapper() {
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('snowfall_enabled')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (stored !== null) {
      setEnabled(stored === 'true')
    } else {
      setEnabled(!prefersReducedMotion)
    }

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>
      if (customEvent.detail) {
        setEnabled(customEvent.detail.enabled)
      }
    }

    window.addEventListener('snowfall:toggle', handleToggle)
    return () => {
      window.removeEventListener('snowfall:toggle', handleToggle)
    }
  }, [])

  if (!mounted || !enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      <Snowfall
        colors={['#ffffff', '#dfdbe0', '#ddf0ff', '#dfe6ff']}
        snowflakeShape="dot"
        size={{ min: 1, max: 12 }}
        followMouse={true}
        snowflakeCount={50}
        wind={{ min: -0.6, max: 0.6 }}
        accumulate={false}
        melt={true}
      />
    </div>
  )
}
