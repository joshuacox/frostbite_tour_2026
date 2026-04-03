'use client'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'

// 1. Define the Props interface
interface RoutingProps {
  waypoints: L.LatLng[]
}

// 2. Apply the interface to the component
export default function Routing({ waypoints }: RoutingProps) {
  const map = useMap()

  useEffect(() => {
    // Basic check to ensure we have a map and enough points
    if (!map || !waypoints || waypoints.length < 2) return

    // Create the control
    const routingControl = L.Routing.control({
      waypoints: waypoints,
      lineOptions: {
        styles: [{ color: '#6366f1', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Set to true if you want the text directions sidebar
      addWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map)

    // 3. Fix the "Destructor" error from earlier by using curly braces
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl)
      }
    }
  }, [map, waypoints])

  return null
}
