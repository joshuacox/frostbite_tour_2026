// src/components/Map.tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

export default function Map({ pos, zoom = 13 }: { pos: [number, number], zoom?: number }) {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={pos} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pos}>
          <Popup>Post location!</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
