'use client'

import { useEffect, useState } from 'react'

interface MountainWeatherProps {
  position?: [number, number]
  lat?: number
  lon?: number
  name?: string
}

interface WeatherData {
  temperature: number
  apparentTemperature: number
  snowfall: number
  windSpeed: number
  weatherCode: number
}

function getWeatherDescription(code: number): { label: string; icon: string } {
  if (code >= 71 && code <= 77) return { label: 'Snowing', icon: '❄️' }
  if (code >= 85 && code <= 86) return { label: 'Snow Showers', icon: '🌨️' }
  if (code >= 61 && code <= 67) return { label: 'Rain', icon: '🌧️' }
  if (code >= 51 && code <= 55) return { label: 'Drizzle', icon: '🌦️' }
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: '⛅' }
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' }
  if (code >= 45 && code <= 48) return { label: 'Foggy / Freezing Fog', icon: '🌫️' }
  if (code >= 95) return { label: 'Storm', icon: '⛈️' }
  return { label: 'Overcast', icon: '☁️' }
}

export default function MountainWeather({ position, lat, lon, name }: MountainWeatherProps) {
  const latitude = position ? position[0] : lat
  const longitude = position ? position[1] : lon

  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!latitude || !longitude) {
      setLoading(false)
      return
    }

    let isMounted = true
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,snowfall,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data && data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            apparentTemperature: Math.round(data.current.apparent_temperature),
            snowfall: data.current.snowfall || 0,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
          })
        }
        setLoading(false)
      })
      .catch(() => {
        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [latitude, longitude])

  if (!latitude || !longitude || error) return null

  if (loading) {
    return (
      <div className="my-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        Loading live mountain weather...
      </div>
    )
  }

  if (!weather) return null
  const condition = getWeatherDescription(weather.weatherCode)

  return (
    <div className="my-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 p-4 shadow-sm backdrop-blur dark:border-cyan-500/20 dark:from-cyan-950/20 dark:to-blue-950/20">
      <div className="flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label={condition.label}>
          {condition.icon}
        </span>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {name ? `${name} Conditions` : 'Live Summit Conditions'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {condition.label} • Feels like {weather.apparentTemperature}°F
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {weather.temperature}°F
          </div>
          <div className="text-gray-500 dark:text-gray-400">Temp</div>
        </div>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
        <div className="text-center">
          <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
            {weather.snowfall}&quot;
          </div>
          <div className="text-gray-500 dark:text-gray-400">Snow</div>
        </div>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {weather.windSpeed} mph
          </div>
          <div className="text-gray-500 dark:text-gray-400">Wind</div>
        </div>
      </div>
    </div>
  )
}
