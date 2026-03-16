import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import StatusBar from './StatusBar'
import Weather from './Weather'
import BottomRectangle from './BottomRectangle'
import SearchPage from './SearchPage'
import { fetchWeatherByCoords } from '../services/weatherService'
import type { WeatherInfo } from '../models/Weather'

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function PhoneShell({ children }: { children: ReactNode }) {
  const [time, setTime]             = useState(() => formatTime(new Date()))
  const [weather, setWeather]       = useState<WeatherInfo | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(new Date())), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocalização não suportada.'); return }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await fetchWeatherByCoords(coords.latitude, coords.longitude)
          setWeather(data)
        } catch (err) {
          setError('Erro ao buscar clima.')
          console.error(err)
        }
      },
      () => setError('Permissão de localização negada.')
    )
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#2E335A_0%,#1C1B33_100%)]">
      <div
        style={{
          position: 'relative', width: 398, height: 932,
          borderRadius: 54,
          background: 'linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 40%, #2c2c2e 100%)',
          boxShadow: `0 0 0 1px #555, 0 0 0 2px #222, 4px 8px 24px rgba(0,0,0,0.8), -2px -2px 8px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)`,
          flexShrink: 0,
        }}
      >
        {/* Botões laterais */}
        <div style={{ position: 'absolute', left: -3, top: 160, width: 4, height: 34, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg,#4a4a4c,#2a2a2c)', boxShadow: '-1px 0 3px rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: -3, top: 204, width: 4, height: 64, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg,#4a4a4c,#2a2a2c)', boxShadow: '-1px 0 3px rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: -3, top: 278, width: 4, height: 64, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg,#4a4a4c,#2a2a2c)', boxShadow: '-1px 0 3px rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', right: -3, top: 220, width: 4, height: 80, borderRadius: '0 2px 2px 0', background: 'linear-gradient(180deg,#4a4a4c,#2a2a2c)', boxShadow: '1px 0 3px rgba(0,0,0,0.5)' }} />

        {/* Tela */}
        <div
          style={{
            position: 'absolute', top: 4, left: 4, right: 4, bottom: 4,
            borderRadius: 50, overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Dynamic Island — sempre por cima de tudo */}
          <div
            style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              width: 126, height: 37, borderRadius: 20, background: '#000',
              zIndex: 200, boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #1a3a5c, #0a0a0a)', boxShadow: '0 0 0 1.5px #1a2a3a, inset 0 0 4px rgba(0,0,0,0.8)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2, left: 2, width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </div>

          {/* StatusBar — sempre por cima de tudo */}
          <div style={{ position: 'relative', zIndex: 200 }}>
            <StatusBar time={time} />
          </div>

          {/* Tela principal */}
          <div style={{
            position:   'absolute',
            inset:      0,
            transform:  searchOpen ? 'translateX(-30%)' : 'translateX(0)',
            transition: 'transform 0.6s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #2E335A 0%, #1C1B33 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.40)' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              opacity: searchOpen ? 1 : 0,
              transition: searchOpen ? 'opacity 0.6s cubic-bezier(0.32,0.72,0,1)' : 'opacity 0s',
              zIndex: 30, pointerEvents: 'none',
            }} />
            <Weather weather={weather} error={error} />
            <BottomRectangle
              hourly={weather?.hourly ?? []}
              daily={weather?.daily ?? []}
              onSearchOpen={() => setSearchOpen(true)}
            />
          </div>

          {/* SearchPage */}
          <div style={{
            position:     'absolute',
            inset:        0,
            borderRadius: 50,
            transform:    searchOpen ? 'translateX(0)' : 'translateX(100%)',
            transition:   'transform 0.6s cubic-bezier(0.32,0.72,0,1)',
            zIndex:       50,
          }}>
            <SearchPage onClose={() => setSearchOpen(false)} weather={null} />
          </div>
        </div>
      </div>
    </div>
  )
}