'use client'

import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Routing from './Routing'
import RouteDownload from './RouteDownload'
import ElevationProfile from './ElevationProfile'

interface MapPost {
  title?: string
  date: string
  lonlat?: number[] | string
  [key: string]: unknown
}

export default function MapComponent({ posts }: { posts: MapPost[] }) {
  // Extract lonlat from all blog posts sorted by date
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const waypoints = sortedPosts
    .filter((post): post is MapPost & { lonlat: number[] | string } => Boolean(post.lonlat))
    .map((post) => {
      const raw = post.lonlat
      const coords = Array.isArray(raw) ? raw : String(raw).split(',').map(Number)
      return L.latLng(coords[0], coords[1])
    })

  const rawWaypoints: [number, number][] = waypoints.map((w) => [w.lat, w.lng])
  const initialCenter: [number, number] = rawWaypoints.length > 0 ? rawWaypoints[0] : [39.5, -106.0]

  return (
    <div className="space-y-4">
      <div
        style={{ height: '500px' }}
        className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-800"
      >
        <MapContainer center={initialCenter} zoom={7} style={{ height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {waypoints.length >= 2 && <Routing waypoints={waypoints} />}
        </MapContainer>
      </div>

      {rawWaypoints.length >= 2 && (
        <div className="flex flex-col gap-2">
          <RouteDownload waypoints={rawWaypoints} title="Frostbite Tour 2026 Complete Route" />
          <ElevationProfile waypoints={rawWaypoints} />
        </div>
      )}
    </div>
  )
}
