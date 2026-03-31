"use client";
// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet-defaulticon-compatibility"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function MyMap(props: any) {
	const { style, position, zoom } = props

	return <MapContainer
		style={style}
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
