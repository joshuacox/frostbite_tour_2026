'use client'

import { useEffect, useState } from 'react'

export default function SnowSwitch() {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('snowfall_enabled')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (stored !== null) {
      setEnabled(stored === 'true')
    } else {
      setEnabled(!prefersReducedMotion)
    }
  }, [])

  const toggleSnow = () => {
    const nextState = !enabled
    setEnabled(nextState)
    localStorage.setItem('snowfall_enabled', String(nextState))
    window.dispatchEvent(
      new CustomEvent('snowfall:toggle', {
        detail: { enabled: nextState },
      })
    )
  }

  if (!mounted) {
    return <div className="h-6 w-6" />
  }

  return (
    <button
      aria-label="Toggle Snowfall Animation"
      type="button"
      className={`rounded p-1.5 transition-colors ${
        enabled
          ? 'text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300'
          : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
      }`}
      onClick={toggleSnow}
      title={enabled ? 'Turn off snowfall animation' : 'Turn on snowfall animation'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M12 2a1 1 0 0 1 1 1v2.071a7.001 7.001 0 0 1 2.828 1.172l1.465-1.464a1 1 0 0 1 1.414 1.414l-1.464 1.465A7.001 7.001 0 0 1 18.929 11H21a1 1 0 1 1 0 2h-2.071a7.001 7.001 0 0 1-1.172 2.828l1.464 1.465a1 1 0 0 1-1.414 1.414l-1.465-1.464A7.001 7.001 0 0 1 13 18.929V21a1 1 0 1 1-2 0v-2.071a7.001 7.001 0 0 1-2.828-1.172l-1.465 1.464a1 1 0 0 1-1.414-1.414l1.464-1.465A7.001 7.001 0 0 1 5.071 13H3a1 1 0 1 1 0-2h2.071a7.001 7.001 0 0 1 1.172-2.828L4.779 6.707a1 1 0 0 1 1.414-1.414l1.465 1.464A7.001 7.001 0 0 1 11 5.071V3a1 1 0 0 1 1-1zm0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      </svg>
    </button>
  )
}
