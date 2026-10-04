'use client'

interface RouteDownloadProps {
  title?: string
  waypoints?: Array<[number, number] | { lat: number; lng: number }>
  position?: [number, number]
  filename?: string
}

export default function RouteDownload({
  title = 'Frostbite Tour Route',
  waypoints,
  position,
  filename,
}: RouteDownloadProps) {
  const points: [number, number][] = []

  if (waypoints && waypoints.length > 0) {
    waypoints.forEach((pt) => {
      if (Array.isArray(pt)) {
        points.push(pt)
      } else if (pt && typeof pt.lat === 'number' && typeof pt.lng === 'number') {
        points.push([pt.lat, pt.lng])
      }
    })
  } else if (position && position.length === 2) {
    points.push(position)
  }

  if (points.length === 0) return null

  const handleDownload = () => {
    const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_')
    const outFilename = filename || `${safeTitle}.gpx`

    const trkpts = points
      .map(
        ([lat, lon], idx) =>
          `      <trkpt lat="${lat}" lon="${lon}">\n        <name>Waypoint ${idx + 1}</name>\n      </trkpt>`
      )
      .join('\n')

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Frostbite Tour 2026 - https://joshuacox.github.io/frostbite_tour_2026" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${title}</name>
    <desc>GPS track for ${title} - Frostbite Tour 2026</desc>
  </metadata>
  <trk>
    <name>${title}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = outFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="my-4 inline-block">
      <button
        type="button"
        onClick={handleDownload}
        className="border-primary-500/30 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-400/20 dark:bg-primary-950/30 dark:text-primary-300 dark:hover:bg-primary-900/40 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 0 1 .75.75v7.69l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V3.75A.75.75 0 0 1 10 3ZM3.75 13a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75v-1.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        Download GPX ({points.length} {points.length === 1 ? 'waypoint' : 'waypoints'})
      </button>
    </div>
  )
}
