import { useEffect, useState } from 'react'
import StatusBar from './StatusBar'
import Weather from './Weather'
import BottomRectangle from './BottomRectangle'
import SearchPage from './SearchPage'
import { fetchWeatherByCoords } from '../services/weatherService'
import type { WeatherInfo } from '../models/Weather'

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function PhoneShell() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sheetOffset, setSheetOffset] = useState(377)

  const CLOSED_OFFSET = 377
  const progress           = Math.max(0, Math.min(1, (CLOSED_OFFSET - sheetOffset) / CLOSED_OFFSET))
  const lockedFullyVisible = progress >= 1

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
        } catch { setError('Erro ao buscar clima.') }
      },
      () => setError('Permissão de localização negada.')
    )
  }, [])

  const handleDragClose = (dragOffset: number) => {
    setSheetOffset(dragOffset)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div style={{
        position: 'relative', width: 398, height: 932, borderRadius: 54,
        background: 'linear-gradient(145deg,#3a3a3c 0%,#1c1c1e 40%,#2c2c2e 100%)',
        boxShadow: '0 0 0 1px #555, 0 0 0 2px #222, 0 20px 50px rgba(0,0,0,0.8)',
        flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, borderRadius: 50, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', width: '200%',
            transform: searchOpen ? 'translateX(-50%)' : 'translateX(0)',
            transition: 'transform 0.6s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <div style={{ position: 'relative', width: '50%', height: '100%', flexShrink: 0 }}>

              {/* FUNDO */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <img src="/background.png" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  transform: `translateY(${-progress * 100}%)`, willChange: 'transform',
                  transition: sheetOffset === 0 || sheetOffset === CLOSED_OFFSET ? 'transform 0.5s ease-out' : 'none',
                }} />

                {/* Background roxo base */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg,#3B267B 0%,#2E335A 45%,#1C1B33 100%)',
                  transform: `translateY(${(1 - progress) * 100}%)`, willChange: 'transform',
                  transition: sheetOffset === 0 || sheetOffset === CLOSED_OFFSET ? 'transform 0.5s ease-out' : 'none',
                }} />

                {/* Radial roxo de iluminação — mesma posição/transform do fundo */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(140,60,255,0.45) 0%, transparent 100%)',
                  transform: `translateY(${(1 - progress) * 100}%)`, willChange: 'transform',
                  transition: sheetOffset === 0 || sheetOffset === CLOSED_OFFSET ? 'transform 0.5s ease-out' : 'none',
                  pointerEvents: 'none',
                }} />

                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
              </div>

              {/* SHEET ROXO */}
              <div style={{
                position: 'absolute', inset: 0, opacity: progress, zIndex: 41,
                pointerEvents: lockedFullyVisible ? 'auto' : 'none',
              }}>
                <BottomRectangle
                  hourly={weather?.hourly ?? []}
                  daily={weather?.daily ?? []}
                  onSearchOpen={() => setSearchOpen(true)}
                  offset={0}
                  setOffset={() => {}}
                  locked
                  onDragClose={handleDragClose}
                  interactiveDrag={false}
                  interactiveButtons={lockedFullyVisible}
                />
              </div>

              {/* SHEET PRINCIPAL */}
              <div style={{
                position: 'absolute', inset: 0,
                opacity: Math.max(0, 1 - progress), zIndex: 40,
                pointerEvents: lockedFullyVisible ? 'none' : 'auto',
              }}>
                <BottomRectangle
                  hourly={weather?.hourly ?? []}
                  daily={weather?.daily ?? []}
                  onSearchOpen={() => setSearchOpen(true)}
                  offset={sheetOffset}
                  setOffset={setSheetOffset}
                  interactiveDrag={true}
                  interactiveButtons={progress < 1}
                />
              </div>

              <Weather weather={weather} error={error} progress={progress} />
            </div>

            <div style={{ position: 'relative', width: '50%', height: '100%', flexShrink: 0 }}>
              <SearchPage onClose={() => setSearchOpen(false)} weather={weather} />
            </div>
          </div>

          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            width: 126, height: 37, borderRadius: 20, background: '#000', zIndex: 200,
          }}>
            <div style={{
              position: 'absolute', right: 10, top: 12, width: 12, height: 12, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%,#1a3a5c,#0a0a0a)', boxShadow: '0 0 0 1.5px #1a2a3a',
            }} />
          </div>

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200 }}>
            <StatusBar time={time} />
          </div>
        </div>
      </div>
    </div>
  )
}