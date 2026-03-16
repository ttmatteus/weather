import type { WeatherInfo, HourlyForecast, DailyForecast } from '../models/Weather'

const GEO_API      = 'https://api.openweathermap.org/geo/1.0/direct'
const CURRENT_API  = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_API = 'https://api.openweathermap.org/data/2.5/forecast'

const DEFAULT_CITIES = [
  'Maceió,BR',
  'São Paulo,BR',
  'New York,US',
  'London,GB',
  'Tokyo,JP',
]

function getApiKey() {
  const key = import.meta.env.VITE_OPENWEATHER_KEY
  if (!key) throw new Error('Missing OpenWeather API key.')
  return key
}

export async function fetchWeatherByCity(city: string): Promise<WeatherInfo> {
  const apiKey = getApiKey()
  const geoRes = await fetch(`${GEO_API}?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`)
  if (!geoRes.ok) throw new Error('Failed to look up location')
  const geoData = await geoRes.json()
  const place = geoData?.[0]
  if (!place) throw new Error('Location not found')
  return fetchWeatherByCoords(place.lat, place.lon)
}

export async function fetchDefaultCities(): Promise<WeatherInfo[]> {
  return Promise.all(DEFAULT_CITIES.map(city => fetchWeatherByCity(city)))
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherInfo> {
  const apiKey = getApiKey()
  const units  = import.meta.env.VITE_OPENWEATHER_UNITS ?? 'metric'

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${CURRENT_API}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`),
    fetch(`${FORECAST_API}?lat=${lat}&lon=${lon}&units=${units}&cnt=40&appid=${apiKey}`),
  ])

  if (!currentRes.ok)  throw new Error('Failed to fetch current weather')
  if (!forecastRes.ok) throw new Error('Failed to fetch forecast')

  const current  = await currentRes.json()
  const forecast = await forecastRes.json()
  const now      = Math.floor(Date.now() / 1000)

  const hourly: HourlyForecast[] = forecast.list
    .filter((e: any) => e.dt >= now - 5400)
    .slice(0, 8)
    .map((e: any) => ({
      dt:          e.dt,
      temp:        e.main.temp,
      icon:        e.weather?.[0]?.icon ?? '01d',
      description: e.weather?.[0]?.description ?? '—',
      pop:         Math.round((e.pop ?? 0) * 100),
    }))

  const dayMap = new Map<string, any[]>()
  for (const e of forecast.list) {
    const key = new Date(e.dt * 1000).toDateString()
    if (!dayMap.has(key)) dayMap.set(key, [])
    dayMap.get(key)!.push(e)
  }

  const daily: DailyForecast[] = Array.from(dayMap.values()).map((entries) => {
    const temps  = entries.map((e: any) => e.main.temp)
    const midday = entries.find((e: any) => new Date(e.dt * 1000).getHours() === 12) ?? entries[0]
    return {
      dt:      entries[0].dt,
      tempMax: Math.max(...temps),
      tempMin: Math.min(...temps),
      icon:    midday.weather?.[0]?.icon ?? '01d',
      pop:     Math.round(Math.max(...entries.map((e: any) => e.pop ?? 0)) * 100),
    }
  })

  const allTemps: number[] = forecast.list.map((e: any) => e.main.temp)

  return {
    name:        current.name ?? `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    temp:        current.main.temp,
    feelsLike:   current.main.feels_like,
    description: current.weather?.[0]?.description ?? '—',
    humidity:    current.main.humidity,
    windSpeed:   current.wind.speed,
    icon:        current.weather?.[0]?.icon ?? '01d',
    tempMax:     Math.max(...allTemps),
    tempMin:     Math.min(...allTemps),
    hourly,
    daily,
  }
}