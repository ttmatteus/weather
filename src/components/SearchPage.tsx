import { useState, useEffect, useRef } from 'react'
import type { WeatherInfo } from "../models/Weather"
import WeatherCard from "./WeatherCard"
import { fetchDefaultCities, fetchWeatherByCity } from '../services/weatherService'

interface Props {
  onClose: () => void
  weather: WeatherInfo | null
}

export default function SearchPage({ onClose }: Props) {
  const [cities, setCities]       = useState<WeatherInfo[]>([])
  const [query, setQuery]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [results, setResults]     = useState<WeatherInfo[]>([])
  const [scrollOffset, setScrollOffset] = useState(0)

  const isDragging = useRef(false)
  const startY     = useRef(0)
  const scrollPos  = useRef(0)

  useEffect(() => {
    fetchDefaultCities().then(setCities).catch(console.error)
  }, [])

  useEffect(() => {
    setScrollOffset(0)
  }, [results, cities])

  async function handleSearch(value: string) {
    setQuery(value)
    if (value.trim().length === 0) { setResults([]); return }
    if (value.trim().length < 2) return
    setLoading(true)
    try {
      const result = await fetchWeatherByCity(value.trim())
      setResults([result])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const displayList = results.length > 0 ? results : cities
  const maxScroll   = Math.max(0, displayList.length * (184 + 20) - 600)

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true
    startY.current     = e.clientY
    scrollPos.current  = scrollOffset
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return
    const delta = startY.current - e.clientY
    setScrollOffset(Math.max(0, Math.min(maxScroll, scrollPos.current + delta)))
  }

  function onMouseUp() {
    isDragging.current = false
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setScrollOffset(prev => Math.max(0, Math.min(maxScroll, prev + e.deltaY)))
  }

  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 50, overflow: 'hidden' }}>

      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 50, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 100% 60% at 90% 10%, rgba(97,47,171,0.9) 0%, transparent 60%), radial-gradient(ellipse 100% 60% at 10% 50%, rgba(97,47,171,0.7) 0%, transparent 60%), radial-gradient(ellipse 100% 60% at 80% 90%, rgba(97,47,171,0.8) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 50% 50%, rgba(97,47,171,0.3) 0%, transparent 70%), linear-gradient(180deg, #2E335A 0%, #1C1B33 100%)`,
      }} />

      {/* Elipse */}
      <div style={{ position: 'absolute', top: 80, left: -41, width: 352, height: 352, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(97,47,171,0.9) 0%, rgba(97,47,171,0.3) 50%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* TopNavigation */}
      <div style={{ position: 'absolute', top: 54, left: 0, width: '100%', height: 106, boxSizing: 'border-box', zIndex: 10 }}>
        <div onClick={onClose} style={{ position: 'absolute', top: 14, left: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="24" height="24" viewBox="0 0 16 14" fill="none">
            <path d="M10 13L4 7L10 1" stroke="rgba(235,235,245,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 200, fontSize: 28, lineHeight: '24px', letterSpacing: '0.36px', color: '#fff', whiteSpace: 'nowrap' }}>
            Weather
          </span>
        </div>
        <div style={{ position: 'absolute', top: 13, right: 16, width: 24, height: 24, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="white"/>
            <circle cx="8" cy="2" r="1.5" fill="white"/>
            <circle cx="14" cy="2" r="1.5" fill="white"/>
          </svg>
        </div>
      </div>

      {/* SearchField */}
      <div style={{ position: 'absolute', top: 130, left: 16, width: 358, height: 36, borderRadius: 10, background: 'linear-gradient(180deg, rgba(46,51,90,0.27) 0%, rgba(28,27,51,0.27) 100%)', boxShadow: 'inset 0 4px 4px rgba(0,0,0,0.25)', boxSizing: 'border-box', zIndex: 10 }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 4 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M6.3833 12.7666C7.76953 12.7666 9.04785 12.3184 10.0938 11.5713L14.0283 15.5059C14.2109 15.6885 14.4517 15.7798 14.709 15.7798C15.2485 15.7798 15.6304 15.3647 15.6304 14.8335C15.6304 14.5845 15.5474 14.3438 15.3647 14.1694L11.4551 10.2515C12.2769 9.17236 12.7666 7.83594 12.7666 6.3833C12.7666 2.87207 9.89453 0 6.3833 0C2.88037 0 0 2.86377 0 6.3833C0 9.89453 2.87207 12.7666 6.3833 12.7666ZM6.3833 11.3887C3.64404 11.3887 1.37793 9.12256 1.37793 6.3833C1.37793 3.64404 3.64404 1.37793 6.3833 1.37793C9.12256 1.37793 11.3887 3.64404 11.3887 6.3833C11.3887 9.12256 9.12256 11.3887 6.3833 11.3887Z" fill="#EBEBF5" fillOpacity="0.6"/>
          </svg>
          <input
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search for a city or airport"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontWeight: 100, fontSize: 17, lineHeight: '22px', letterSpacing: '-0.41px', color: 'rgba(235,235,245,0.9)', caretColor: '#fff' }}
          />
          {query.length > 0 && (
            <div onClick={() => { setQuery(''); setResults([]) }} style={{ paddingRight: 8, cursor: 'pointer', color: 'rgba(235,235,245,0.6)', fontSize: 16 }}>✕</div>
          )}
        </div>
      </div>

      {/* Lista de WeatherCards — scroll programático */}
      <div
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        style={{
          position:   'absolute',
          top:        214,
          left:       24,
          right:      24,
          height:     650,
          overflow:   'hidden',
          cursor:     isDragging.current ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex:     5,
        }}
      >
        <div style={{
          transform:     `translateY(-${scrollOffset}px)`,
          display:       'flex',
          flexDirection: 'column',
          gap:           20,
          transition:    isDragging.current ? 'none' : 'transform 0.1s ease-out',
        }}>
          {loading && <span style={{ color: 'rgba(235,235,245,0.6)', fontSize: 14, textAlign: 'center', paddingTop: 20 }}>Searching...</span>}
          {!loading && displayList.map((city, i) => <WeatherCard key={i} weather={city} />)}
          {!loading && displayList.length === 0 && query.length >= 2 && (
            <span style={{ color: 'rgba(235,235,245,0.6)', fontSize: 14, textAlign: 'center', paddingTop: 20 }}>No results found</span>
          )}
        </div>
      </div>

    </div>
  )
}