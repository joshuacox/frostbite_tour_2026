'use client'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Routing from './Routing' // Your leaflet-routing-machine component

export default function MapComponent({ posts }: { posts: any[] }) {
  // Extract lonlat from all blog posts
  const waypoints = posts
    .filter(post => post.lonlat)
    .map(post => {
      // Assuming lonlat is [lat, lon] or a comma-string
      const coords = Array.isArray(post.lonlat) 
        ? post.lonlat 
        : post.lonlat.split(',').map(Number)
      return L.latLng(coords[0], coords[1])
    })

  return (
    <div style={{ height: '500px' }}>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {waypoints.length >= 2 && <Routing waypoints={waypoints} />}
      </MapContainer>
    </div>
  )
}
