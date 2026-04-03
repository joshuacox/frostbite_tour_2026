'use client'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

export default function Routing({ waypoints }: { waypoints: L.LatLng[] }) {
  const map = useMap()

  useEffect(() => {
    if (!map || waypoints.length < 2) return

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#6366f1', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      }
    }).addTo(map)

    return () => map.removeControl(routingControl)
  }, [map, waypoints])

  return null
}
