'use client'
import dynamic from 'next/dynamic'

// Move the dynamic import with ssr: false HERE
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false, 
  loading: () => <div style={{ height: '500px' }}>Loading Map...</div>
})

export default function MapWrapper({ posts }: { posts: any[] }) {
  return <MapComponent posts={posts} />
}
