'use client'

import Snowfall from 'react-snowfall';

export default function SnowEffect() {
  return (
    <Snowfall
      color="white"
      snowflakeCount={150}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        pointerEvents: 'none' // Ensures snow doesn't block clicks
      }}
    />
  );
}

