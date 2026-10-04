'use client'

import { useEffect, useState } from 'react'

interface ElevationProfileProps {
  waypoints?: Array<[number, number] | { lat: number; lng: number }>
  position?: [number, number]
}

interface ElevationPoint {
  latitude: number
  longitude: number
  elevation: number
  distanceKm: number
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function ElevationProfile({ waypoints, position }: ElevationProfileProps) {
  const [data, setData] = useState<ElevationPoint[]>([])
  const [loading, setLoading] = useState(true)

  const pointsKey = JSON.stringify(waypoints || position || [])

  useEffect(() => {
    const points: [number, number][] = []
    if (waypoints && waypoints.length > 0) {
      waypoints.forEach((pt) => {
        if (Array.isArray(pt)) points.push(pt)
        else if (pt && typeof pt.lat === 'number' && typeof pt.lng === 'number') {
          points.push([pt.lat, pt.lng])
        }
      })
    } else if (position && position.length === 2) {
      points.push(position)
    }

    if (points.length < 2) {
      setLoading(false)
      return
    }

    let isMounted = true
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${points.map((p) => p[0]).join(',')}&longitude=${points.map((p) => p[1]).join(',')}`

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (!isMounted) return
        if (result && Array.isArray(result.elevation)) {
          let totalDist = 0
          const pts: ElevationPoint[] = result.elevation.map((elev: number, idx: number) => {
            if (idx > 0) {
              totalDist += haversineDistance(
                points[idx - 1][0],
                points[idx - 1][1],
                points[idx][0],
                points[idx][1]
              )
            }
            return {
              latitude: points[idx][0],
              longitude: points[idx][1],
              elevation: Math.round(elev * 3.28084), // convert meters to feet
              distanceKm: Math.round(totalDist * 0.621371 * 10) / 10, // miles
            }
          })
          setData(pts)
        }
        setLoading(false)
      })
      .catch(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [pointsKey, waypoints, position])

  if (loading) {
    return (
      <div className="my-4 text-xs text-gray-500 dark:text-gray-400">
        Loading elevation profile...
      </div>
    )
  }
  if (data.length < 2) return null

  const elevations = data.map((d) => d.elevation)
  const minElev = Math.min(...elevations)
  const maxElev = Math.max(...elevations)
  const totalGain = elevations.reduce((acc, curr, idx) => {
    if (idx === 0) return 0
    const diff = curr - elevations[idx - 1]
    return diff > 0 ? acc + diff : acc
  }, 0)

  // Generate SVG path points
  const width = 600
  const height = 140
  const padding = 20
  const maxDist = data[data.length - 1].distanceKm || 1
  const elevRange = maxElev - minElev || 1

  const svgPoints = data.map((d) => {
    const x = padding + (d.distanceKm / maxDist) * (width - padding * 2)
    const y = height - padding - ((d.elevation - minElev) / elevRange) * (height - padding * 2)
    return `${x},${y}`
  })

  const polylineStr = svgPoints.join(' ')
  const polygonStr = `${padding},${height - padding} ${polylineStr} ${width - padding},${height - padding}`

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mb-3 flex flex-wrap items-center justify-between text-xs">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          Route Elevation Profile
        </span>
        <div className="flex gap-4 text-gray-600 dark:text-gray-400">
          <span>
            Min:{' '}
            <strong className="text-gray-900 dark:text-gray-200">
              {minElev.toLocaleString()} ft
            </strong>
          </span>
          <span>
            Max:{' '}
            <strong className="text-gray-900 dark:text-gray-200">
              {maxElev.toLocaleString()} ft
            </strong>
          </span>
          <span>
            Gain:{' '}
            <strong className="text-cyan-600 dark:text-cyan-400">
              +{totalGain.toLocaleString()} ft
            </strong>
          </span>
          <span>
            Dist: <strong className="text-gray-900 dark:text-gray-200">{maxDist} mi</strong>
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full">
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon points={polygonStr} fill="url(#elevGrad)" />
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#0891b2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
