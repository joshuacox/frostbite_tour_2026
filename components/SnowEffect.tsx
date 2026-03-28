'use client'

import { useState, useEffect } from 'react'
import Snowfall from 'react-snowfall'

export default function SnowEffect() {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Snowfall
      color="white"
      snowflakeCount={150}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  )
}
