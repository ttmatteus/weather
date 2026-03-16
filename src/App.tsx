import { useState } from 'react'
import PhoneShell from './components/PhoneShell'
import Weather from './components/Weather'
import House from './components/House';
import { fetchWeatherByCity } from './controllers/weatherController'
import type { WeatherInfo } from './models/Weather'

function App() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    setError(null)
    setWeather(null)

    if (!query.trim()) {
      setError('Please enter a city name.')
      return
    }

    setLoading(true)
    try {
      const result = await fetchWeatherByCity(query.trim())
      setWeather(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PhoneShell>
        <Weather />
        <House />
      </PhoneShell>
    </>
  )
}

export default App
