// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function MyMap(props: any) {
	const { position, zoom } = props

	return <MapContainer
		style={{ height: '1000px', width: '100%' }}
		center={position}
		zoom={zoom}
		scrollWheelZoom={false}
	>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<Marker position={position}>
			popup
		</Marker>
	</MapContainer>
}
