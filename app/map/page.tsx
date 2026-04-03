/// app/map/page.tsx
import { allBlogs } from 'contentlayer/generated'
import MapWrapper from '@/components/MapWrapper'

export default function MapPage() {
  return (
    <main>
      <h1>Blog Route Map</h1>
      <MapWrapper posts={allBlogs} />
    </main>
  )
}
