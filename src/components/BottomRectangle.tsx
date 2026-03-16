import React, { useRef, useState } from 'react'
import ForecastCard from './ForecastCard'
import WeeklyCard from './WeeklyCard'
import type { HourlyForecast, DailyForecast } from '../models/Weather'

interface Props {
  hourly:        HourlyForecast[]
  daily:         DailyForecast[]
  onSearchOpen:  () => void
}

function useDragScroll() {
  const ref        = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX     = useRef(0)
  const scrollLeft = useRef(0)

  return {
    ref,
    onMouseDown(e: React.MouseEvent) {
      isDragging.current = true
      startX.current     = e.pageX - (ref.current?.offsetLeft ?? 0)
      scrollLeft.current = ref.current?.scrollLeft ?? 0
      if (ref.current) ref.current.style.cursor = 'grabbing'
    },
    onMouseMove(e: React.MouseEvent) {
      if (!isDragging.current || !ref.current) return
      e.preventDefault()
      const x = e.pageX - ref.current.offsetLeft
      ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2
    },
    onMouseUp() {
      isDragging.current = false
      if (ref.current) ref.current.style.cursor = 'grab'
    },
  }
}

const scrollStyle: React.CSSProperties = {
  position:                'absolute',
  left:                    0,
  right:                   0,
  height:                  150,
  overflowX:               'auto',
  overflowY:               'hidden',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth:          'none',
  paddingLeft:             20,
  paddingRight:            20,
  boxSizing:               'border-box',
  cursor:                  'grab',
  userSelect:              'none',
  top:                     69,
}

export default function BottomRectangle({ hourly, daily, onSearchOpen }: Props) {
  const [activeTab, setActiveTab] = useState<'hourly' | 'weekly'>('hourly')
  const hourlyDrag = useDragScroll()
  const weeklyDrag = useDragScroll()

  return (
    <div
      style={{
        position:       'absolute',
        left:           0,
        bottom:         0,
        width:          '100%',
        height:         325,
        borderRadius:   44,
        overflow:       'hidden',
        background:     'linear-gradient(225deg, rgba(143,0,255,0.18) 0%, rgba(120,92,255,0.12) 35%, rgba(72,49,157,0.18) 70%, rgba(28,27,51,0.75) 100%)',
        zIndex:         40,
        boxShadow:      'inset 0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        backdropFilter: 'blur(28px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          width:      '100%',
          height:     49,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(196,39,251,0.12) 50%, rgba(224,217,255,0.10) 100%)',
        }}
      >
        <div style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: 48, height: 5, borderRadius: 10, background: 'rgba(0,0,0,0.3)', boxShadow: '0 4px 4px rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 1, background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 20%, rgba(0,0,0,0.25) 80%, rgba(0,0,0,0) 100%)' }} />
      </div>

      {/* Tabs */}
      <div style={{ position: 'absolute', top: 24, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setActiveTab('hourly')}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            fontSize: 15, lineHeight: '20px', fontWeight: 700,
            color: activeTab === 'hourly' ? '#fff' : 'rgba(235,235,245,0.4)',
            transition: 'color 0.2s',
          }}
        >
          Hourly Forecast
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            fontSize: 15, lineHeight: '20px', fontWeight: 700,
            color: activeTab === 'weekly' ? '#fff' : 'rgba(235,235,245,0.4)',
            transition: 'color 0.2s',
          }}
        >
          Weekly Forecast
        </button>
      </div>

      {/* Hourly scroll */}
      {activeTab === 'hourly' && (
        <div
          ref={hourlyDrag.ref}
          onMouseDown={hourlyDrag.onMouseDown}
          onMouseMove={hourlyDrag.onMouseMove}
          onMouseUp={hourlyDrag.onMouseUp}
          onMouseLeave={hourlyDrag.onMouseUp}
          className="hide-scrollbar"
          style={scrollStyle}
        >
          <div style={{ display: 'flex', gap: 12, width: 'max-content' }}>
            {hourly.map((entry) => <ForecastCard key={entry.dt} entry={entry} />)}
          </div>
        </div>
      )}

      {/* Weekly scroll */}
      {activeTab === 'weekly' && (
        <div
          ref={weeklyDrag.ref}
          onMouseDown={weeklyDrag.onMouseDown}
          onMouseMove={weeklyDrag.onMouseMove}
          onMouseUp={weeklyDrag.onMouseUp}
          onMouseLeave={weeklyDrag.onMouseUp}
          className="hide-scrollbar"
          style={scrollStyle}
        >
          <div style={{ display: 'flex', gap: 12, width: 'max-content' }}>
            {daily.map((entry) => <WeeklyCard key={entry.dt} entry={entry} />)}
          </div>
        </div>
      )}

      {/* TabBar SVG */}
      <img
        src="/TabBar.svg"
        alt="Tab Bar"
        draggable={false}
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 100, objectFit: 'cover', pointerEvents: 'none' }}
      />

      {/* Botão invisível sobre o hamburger (canto direito do TabBar) */}
      <button
        onClick={onSearchOpen}
        style={{
          position:   'absolute',
          bottom:     28,
          right:      28,
          width:      52,
          height:     52,
          borderRadius: '50%',
          background: 'transparent',
          border:     'none',
          cursor:     'pointer',
          zIndex:     50,
        }}
        aria-label="Open search"
      />
    </div>
  )
}