import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

// Use dynamic import with ssr: false to prevent Leaflet from breaking the build
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Map, // This makes <Map /> available in all MDX files
  }
}
