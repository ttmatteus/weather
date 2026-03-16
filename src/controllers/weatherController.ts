import type { WeatherInfo } from '../models/Weather'

const GEO_API = 'https://api.openweathermap.org/geo/1.0/direct'
const ONE_CALL_API = 'https://api.openweathermap.org/data/2.5/onecall'

function getApiKey() {
  const key = import.meta.env.VITE_OPENWEATHER_KEY
  if (!key) {
    throw new Error('Missing OpenWeather API key. Set VITE_OPENWEATHER_KEY in your .env file.')
  }
  return key
}

export async function fetchWeatherByCity(city: string): Promise<WeatherInfo> {
  const apiKey = getApiKey()

  const geoRes = await fetch(
    `${GEO_API}?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  )
  if (!geoRes.ok) {
    throw new Error('Failed to look up location')
  }

  const geoData = await geoRes.json()
  const place = geoData?.[0]
  if (!place) {
    throw new Error('Location not found')
  }

  const units = import.meta.env.VITE_OPENWEATHER_UNITS ?? 'metric'
  const oneCallRes = await fetch(
    `${ONE_CALL_API}?lat=${place.lat}&lon=${place.lon}&units=${units}&exclude=minutely,hourly,alerts&appid=${apiKey}`
  )

  if (!oneCallRes.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const weatherData = await oneCallRes.json()
  const current = weatherData.current

  return {
    name: `${place.name}${place.state ? `, ${place.state}` : ''}${place.country ? `, ${place.country}` : ''}`,
    temp: current.temp,
    description: current.weather?.[0]?.description ?? '—',
    humidity: current.humidity,
    windSpeed: current.wind_speed,
    icon: current.weather?.[0]?.icon ?? '01d',
  }
}
