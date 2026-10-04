'use client'

import dynamic from 'next/dynamic'

interface MapPost {
  title?: string
  date: string
  lonlat?: number[] | string
  [key: string]: unknown
}

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div style={{ height: '500px' }}>Loading Map...</div>,
})

export default function MapWrapper({ posts }: { posts: MapPost[] }) {
  return <MapComponent posts={posts} />
}
