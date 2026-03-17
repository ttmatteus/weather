import React, { useRef, useState } from 'react'
import ForecastCard from './ForecastCard'
import WeeklyCard from './WeeklyCard'
import type { HourlyForecast, DailyForecast } from '../models/Weather'

export interface BottomRectangleProps {
  hourly:              HourlyForecast[]
  daily:               DailyForecast[]
  onSearchOpen:        () => void
  offset:              number
  setOffset:           React.Dispatch<React.SetStateAction<number>> | (() => void)
  locked?:             boolean
  lockedScrollRef?:    React.RefObject<HTMLDivElement>
  onDragClose?:        (offset: number) => void
  staticPosition?:     boolean
  interactiveDrag?:    boolean
  interactiveButtons?: boolean
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

export default function BottomRectangle({
  hourly,
  daily,
  onSearchOpen,
  offset,
  setOffset,
  locked           = false,
  lockedScrollRef,
  onDragClose,
  staticPosition   = false,
  interactiveDrag    = true,
  interactiveButtons = true,
}: BottomRectangleProps) {
  const [activeTab, setActiveTab] = useState<'hourly' | 'weekly'>('hourly')
  const hourlyDrag = useDragScroll()
  const weeklyDrag = useDragScroll()
  const internalScrollRef = useRef<HTMLDivElement>(null)
  const scrollRef = lockedScrollRef ?? internalScrollRef

  const TOTAL_HEIGHT    = 702
  const INITIAL_VISIBLE = 325
  const CLOSED_OFFSET   = TOTAL_HEIGHT - INITIAL_VISIBLE
  const OPEN_OFFSET     = 0

  const effectiveOffset = locked ? 0 : offset
  const progress = Math.max(0, Math.min(1, (CLOSED_OFFSET - effectiveOffset) / CLOSED_OFFSET))

  const [isDragging, setIsDragging] = useState(false)
  const startY               = useRef(0)
  const currentOffsetAtStart = useRef(CLOSED_OFFSET)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (locked || staticPosition || !interactiveDrag) return
    setIsDragging(true)
    startY.current = e.clientY
    currentOffsetAtStart.current = offset
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
  }
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || locked || staticPosition || !interactiveDrag) return
    const deltaY = e.clientY - startY.current
    let newOffset = currentOffsetAtStart.current + deltaY
    if (newOffset < OPEN_OFFSET)   newOffset = OPEN_OFFSET
    if (newOffset > CLOSED_OFFSET) newOffset = CLOSED_OFFSET
    setOffset(newOffset)
  }
  const handlePointerUp = () => {
    if (!isDragging || locked || staticPosition || !interactiveDrag) return
    setIsDragging(false)
    const finalPos = offset < CLOSED_OFFSET / 2 ? OPEN_OFFSET : CLOSED_OFFSET
    setOffset(finalPos)
  }

  const [isLockedDragging, setIsLockedDragging] = useState(false)
  const lockedStartY      = useRef(0)
  const lockedDragOffset  = useRef(0)

  const handleLockedPointerDown = (e: React.PointerEvent) => {
    if (!onDragClose) return
    setIsLockedDragging(true)
    lockedStartY.current     = e.clientY
    lockedDragOffset.current = 0
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    e.stopPropagation()
  }
  const handleLockedPointerMove = (e: React.PointerEvent) => {
    if (!isLockedDragging || !onDragClose) return
    const deltaY = e.clientY - lockedStartY.current
    const clamped = Math.max(0, deltaY)
    lockedDragOffset.current = clamped
    onDragClose(clamped)
    e.stopPropagation()
  }
  const handleLockedPointerUp = (e: React.PointerEvent) => {
    if (!isLockedDragging || !onDragClose) return
    setIsLockedDragging(false)
    const deltaY = e.clientY - lockedStartY.current
    const snap = deltaY > CLOSED_OFFSET / 2 ? CLOSED_OFFSET : 0
    onDragClose(snap)
    e.stopPropagation()
  }

  const tabBarTop          = INITIAL_VISIBLE - 100
  const tabBarExitDistance = TOTAL_HEIGHT - tabBarTop
  const translateY         = staticPosition ? CLOSED_OFFSET : effectiveOffset

  // ─── LOCKED MODE ─────────────────────────────────────────────────────────
  if (locked) {
    return (
      <div style={{
        position: 'absolute', left: 0, bottom: 0,
        width: '100%', height: TOTAL_HEIGHT,
        zIndex: 40, transform: `translateY(${translateY}px)`,
      }}>
        {/* Base — mesma cor do sheet normal */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 44, overflow: 'hidden',
          background: 'linear-gradient(225deg, rgba(143,0,255,0.2) 0%, rgba(120,92,255,0.1) 35%, rgba(28,27,51,0.8) 100%)',
          boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          backdropFilter: 'blur(30px)', pointerEvents: 'none',
        }} />
        {/* Radial roxo de iluminação no topo */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 44,
          background: 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(140,60,255,0.45) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div
          onPointerDown={handleLockedPointerDown}
          onPointerMove={handleLockedPointerMove}
          onPointerUp={handleLockedPointerUp}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 44,
            zIndex: 10, cursor: onDragClose ? 'ns-resize' : 'default',
            touchAction: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            width: 48, height: 5, borderRadius: 10,
            background: 'rgba(0,0,0,0.4)', pointerEvents: 'none',
          }} />
        </div>

        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
            overflowY: 'scroll', overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            touchAction: 'pan-y', borderRadius: '0 0 44px 44px', paddingBottom: 32,
          }}
        >
          {/* Abas */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingLeft: 32, paddingRight: 32, marginBottom: 12, paddingTop: 4,
          }}>
            <button onClick={() => setActiveTab('hourly')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'sans-serif', fontSize: 15, fontWeight: 700,
              color: activeTab === 'hourly' ? '#fff' : 'rgba(235,235,245,0.4)', transition: 'color 0.2s',
            }}>Hourly Forecast</button>
            <button onClick={() => setActiveTab('weekly')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'sans-serif', fontSize: 15, fontWeight: 700,
              color: activeTab === 'weekly' ? '#fff' : 'rgba(235,235,245,0.4)', transition: 'color 0.2s',
            }}>Weekly Forecast</button>
          </div>

          {/* ── Borda abaixo dos nomes das abas ── */}
          <div style={{
            height: 1,
            background: 'linear-gradient(to right, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.6) 18%, rgba(0,0,0,0.6) 100%)',
            marginBottom: 12,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '-1px', height: 3, width: 110, borderRadius: 2,
              background: 'linear-gradient(to right, transparent 0%, rgba(160,80,255,0.5) 25%, rgba(180,100,255,1) 50%, rgba(160,80,255,0.5) 75%, transparent 100%)',
              filter: 'blur(1.5px)',
              left: activeTab === 'hourly' ? 'calc(25% - 55px)' : 'calc(75% - 55px)',
              transition: 'left 0.3s ease',
            }} />
          </div>

          {/* Lista horizontal */}
          {activeTab === 'hourly' ? (
            <div ref={hourlyDrag.ref} onMouseDown={hourlyDrag.onMouseDown} onMouseMove={hourlyDrag.onMouseMove}
              onMouseUp={hourlyDrag.onMouseUp} onMouseLeave={hourlyDrag.onMouseUp} className="hide-scrollbar"
              style={{
                height: 150, overflowX: 'auto', overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
                paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box',
                cursor: 'grab', userSelect: 'none', touchAction: 'pan-x', marginBottom: 16,
              }}>
              <div style={{ display: 'flex', gap: 12, width: 'max-content', height: '100%', alignItems: 'center' }}>
                {hourly.map((entry) => <ForecastCard key={entry.dt} entry={entry} />)}
              </div>
            </div>
          ) : (
            <div ref={weeklyDrag.ref} onMouseDown={weeklyDrag.onMouseDown} onMouseMove={weeklyDrag.onMouseMove}
              onMouseUp={weeklyDrag.onMouseUp} onMouseLeave={weeklyDrag.onMouseUp} className="hide-scrollbar"
              style={{
                height: 150, overflowX: 'auto', overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
                paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box',
                cursor: 'grab', userSelect: 'none', touchAction: 'pan-x', marginBottom: 16,
              }}>
              <div style={{ display: 'flex', gap: 12, width: 'max-content', height: '100%', alignItems: 'center' }}>
                {daily.map((entry) => <WeeklyCard key={entry.dt} entry={entry} />)}
              </div>
            </div>
          )}

          {/* Widgets banner */}
          <div style={{ marginLeft: 24, marginRight: 24, height: 166, borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
            {/* Radial roxo atrás da imagem */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(120,40,255,0.4) 0%, transparent 70%)',
              filter: 'blur(6px)',
            }} />
            <img src="/Widgets.png" alt="Widget"
              style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95, display: 'block' }}
              draggable={false} />
          </div>

          {/* Row 1 */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10, marginLeft: 24, marginRight: 24 }}>
            {/* UV Index / Air Quality — radial menor */}
            <div style={{ flex: 1, height: 164, borderRadius: 22, overflow: 'hidden', background: '#25224d', position: 'relative' }}>
              <img src="/UvIndex.png" alt="UV Index"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 22, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(140,60,255,0.45) 0%, transparent 100%)',
              }} />
            </div>
            {/* Sunrise — radial maior */}
            <div style={{ flex: 1, height: 164, borderRadius: 22, overflow: 'hidden', background: '#25224d', position: 'relative' }}>
              <img src="/SUNRISE.png" alt="Sunrise"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 22, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(140,60,255,0.45) 0%, transparent 100%)',
              }} />
            </div>
          </div>

          {/* Radial roxo — no gap entre UVIndex/Sunrise e Row 2 */}
          <div style={{
            height: 0, overflow: 'visible', position: 'relative', pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute', left: '50%', top: '5px',
              transform: 'translateX(-50%)',
              width: 260, height: 120,
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(120,40,255,0.28) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }} />
          </div>

          {/* Row 2 */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10, marginLeft: 24, marginRight: 24 }}>
            <div style={{ flex: 1, height: 164, borderRadius: 22, background: '#25224d', position: 'relative', overflow: 'hidden' }}>
              <img src="/WIND.png" alt="Wind"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
            </div>
            <div style={{ flex: 1, height: 164, borderRadius: 22, background: '#25224d', position: 'relative', overflow: 'hidden' }}>
              <img src="/RAINFALL.png" alt="Rain"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10, marginLeft: 24, marginRight: 24 }}>
            <div style={{ flex: 1, height: 164, borderRadius: 22, background: '#25224d', position: 'relative', overflow: 'hidden' }}>
              <img src="/FEELS LIKE.png" alt="Feels Like"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
            </div>
            <div style={{ flex: 1, height: 164, borderRadius: 22, background: '#25224d', position: 'relative', overflow: 'hidden' }}>
              <img src="/HUMIDITY.png" alt="Humidity"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
            </div>
          </div>

          {/* Row 4 */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10, marginLeft: 24, marginRight: 24 }}>
            <div style={{ flex: 1, height: 164, borderRadius: 22, background: '#25224d', position: 'relative', overflow: 'hidden' }}>
              <img src="/VISIBILITY.png" alt="Visibility"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
            </div>
            <div style={{ flex: 1, height: 164, borderRadius: 22, background: '#25224d', position: 'relative', overflow: 'hidden' }}>
              <img src="/PRESSURE.png" alt="Pressure"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', opacity: 0.95 }}
                draggable={false} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── NORMAL MODE ─────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'absolute', left: 0, bottom: 0, width: '100%', height: TOTAL_HEIGHT,
      borderRadius: 44, overflow: 'hidden',
      background: 'linear-gradient(225deg, rgba(143,0,255,0.2) 0%, rgba(120,92,255,0.1) 35%, rgba(28,27,51,0.8) 100%)',
      zIndex: 40,
      boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      backdropFilter: 'blur(30px)',
      transform: `translateY(${translateY}px)`,
      transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      touchAction: 'none', pointerEvents: 'none',
    }}>
      <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        style={{
          position: 'absolute', top: 0, width: '100%', height: 80,
          cursor: interactiveDrag && !staticPosition ? 'ns-resize' : 'default',
          zIndex: 100, pointerEvents: interactiveDrag && !staticPosition ? 'auto' : 'none',
        }}>
        <div style={{
          position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)',
          width: 48, height: 5, borderRadius: 10, background: 'rgba(0,0,0,0.4)',
        }} />
      </div>

      <div style={{
        position: 'absolute', top: 24, left: 32, right: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 101, pointerEvents: interactiveButtons ? 'auto' : 'none',
      }}>
        <button onClick={() => setActiveTab('hourly')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'sans-serif', fontSize: 15, fontWeight: 700,
          color: activeTab === 'hourly' ? '#fff' : 'rgba(235,235,245,0.4)',
          transition: 'color 0.2s', pointerEvents: 'auto',
        }}>Hourly Forecast</button>
        <button onClick={() => setActiveTab('weekly')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'sans-serif', fontSize: 15, fontWeight: 700,
          color: activeTab === 'weekly' ? '#fff' : 'rgba(235,235,245,0.4)',
          transition: 'color 0.2s', pointerEvents: 'auto',
        }}>Weekly Forecast</button>
      </div>

      {/* ── Borda sutil full-width + indicador da aba ativa ── */}
      <div style={{
        position: 'absolute', top: 57, left: 0, right: 0, height: 1,
        background: 'rgba(255,255,255,0.08)',
        zIndex: 102, pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-1px', height: 3, width: 110, borderRadius: 2,
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 75%, transparent 100%)',
          filter: 'blur(1.5px)',
          left: activeTab === 'hourly' ? 'calc(25% - 55px)' : 'calc(75% - 55px)',
          transition: 'left 0.3s ease',
        }} />
      </div>

      {activeTab === 'hourly' ? (
        <div ref={hourlyDrag.ref} onMouseDown={hourlyDrag.onMouseDown} onMouseMove={hourlyDrag.onMouseMove}
          onMouseUp={hourlyDrag.onMouseUp} onMouseLeave={hourlyDrag.onMouseUp} className="hide-scrollbar"
          style={{
            position: 'absolute', left: 0, right: 0, height: 150, top: 69,
            overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box', cursor: 'grab', userSelect: 'none',
            pointerEvents: interactiveButtons ? 'auto' : 'none',
          }}>
          <div style={{ display: 'flex', gap: 12, width: 'max-content' }}>
            {hourly.map((entry) => <ForecastCard key={entry.dt} entry={entry} />)}
          </div>
        </div>
      ) : (
        <div ref={weeklyDrag.ref} onMouseDown={weeklyDrag.onMouseDown} onMouseMove={weeklyDrag.onMouseMove}
          onMouseUp={weeklyDrag.onMouseUp} onMouseLeave={weeklyDrag.onMouseUp} className="hide-scrollbar"
          style={{
            position: 'absolute', left: 0, right: 0, height: 150, top: 69,
            overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box', cursor: 'grab', userSelect: 'none',
            pointerEvents: interactiveButtons ? 'auto' : 'none',
          }}>
          <div style={{ display: 'flex', gap: 12, width: 'max-content' }}>
            {daily.map((entry) => <WeeklyCard key={entry.dt} entry={entry} />)}
          </div>
        </div>
      )}

      {!staticPosition && (
        <div style={{
          position: 'absolute', top: tabBarTop, left: 0, width: '100%', height: 100,
          transform: `translateY(${progress * tabBarExitDistance}px)`,
          transition: isDragging ? 'none' : 'transform 0.4s ease-out',
          pointerEvents: interactiveButtons && progress <= 0.5 ? 'auto' : 'none',
        }}>
          <svg width="390" height="100" viewBox="0 0 390 100" xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            preserveAspectRatio="none">
            <path d="M0 12C0 12 76.0769 27.9822 60 29" fill="none" stroke="#000" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M340 29C340 25 390 12 390 12" fill="none" stroke="#000" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
          </svg>
          <img src="/TabBar.svg" alt="Tab Bar" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={onSearchOpen} style={{
            position: 'absolute', bottom: 28, right: 28, width: 52, height: 52,
            borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto',
          }} />
        </div>
      )}
    </div>
  )
}