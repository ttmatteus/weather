import House from './House'
import type { WeatherInfo } from '../models/Weather'
import { formatTemp } from '../models/Weather'

interface Props {
  weather: WeatherInfo | null
  error: string | null
  progress: number
}

export default function Weather({ weather, error, progress }: Props) {
  const description = weather
    ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
    : '—'
  const cityName = weather ? weather.name : 'Localizando...'

  const tempFontSize = 96 - (progress * 76)
  const tempLineHeight = 70 - (progress * 46)
  
  const tempMoveX = progress * -50 
  const tempMoveY = progress * -9;5
  
  const descMoveX = progress * 55
  const descMoveY = progress * -84.5

  const hlOpacity = Math.max(0, 1 - progress * 1.5)
  const separatorOpacity = Math.max(0, (progress - 0.7) * 3.3)
  const ghostOpacity = Math.sin(progress * Math.PI) * 0.6

  return (
    <div
      className="absolute left-0 w-full pointer-events-none z-20"
      style={{ top: 100, zIndex: 30 }}
    >
      <div className="flex flex-col items-center w-[398px] mx-auto relative">
        
        {/* CIDADE */}
        <div style={{ position: 'relative' }}>
          
          {/* TEXTO REAL */}
          <span style={{ 
            fontSize: '34px', 
            lineHeight: '41px', 
            color: '#fff', 
            fontFamily: "'SF Pro Display', sans-serif", 
            fontWeight: 400,
            position: 'relative',
            right: 8,
            zIndex: 10,
          }}>
            {cityName}
          </span>
        </div>

        {/* ÁREA DINÂMICA */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          position: 'relative',
          marginTop: 8,
          height: 100,
          zIndex: 10,
        }}>
          
          {/* TEMPERATURA */}
          <div style={{ position: 'relative', transform: `translate(${tempMoveX}px, ${tempMoveY}px)`, zIndex: 30 }}>
            
            {/* GHOST */}
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 8,
                fontSize: tempFontSize,
                lineHeight: `${tempLineHeight}px`,
                color: 'rgba(200, 160, 255, 0.6)',
                fontFamily: "'SF Pro Display Thin Custom', 'SF Pro Display', sans-serif",
                fontWeight: progress > 0.85 ? 600 : 100,
                opacity: ghostOpacity,
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {weather ? formatTemp(weather.temp) : '—°'}
            </span>

            {/* TEXTO REAL */}
            <span
              style={{
                fontSize: tempFontSize,
                lineHeight: `${tempLineHeight}px`,
                color: progress > 0.85 ? 'rgba(235, 235, 245, 0.6)' : '#fff',
                fontFamily: "'SF Pro Display Thin Custom', 'SF Pro Display', sans-serif",
                fontWeight: progress > 0.85 ? 600 : 100,
                transition: 'color 0.3s ease',
                position: 'relative',
              }}
            >
              {weather ? formatTemp(weather.temp) : '—°'}
            </span>
          </div>

          {/* SEPARADOR "|" */}
          <span style={{ 
            position: 'absolute',
            left: -20,
            transform: `translate(${tempMoveX + 70}px, ${tempMoveY}px)`,
            marginLeft: "-2px",
            opacity: separatorOpacity,
            color: 'rgba(235, 235, 245, 0.6)',
            fontSize: 20,
            transform: `translateY(${tempMoveY}px)`,
            fontWeight: 300,
            pointerEvents: 'none'
          }}>|</span>

          {/* DESCRIÇÃO */}
          <div style={{
            position: progress > 0.1 ? 'absolute' : 'relative',
            top: progress > 0.1 ? 75 : 0,
            transform: `translate(${descMoveX}px, ${descMoveY}px)`,
          }}>
            {/* GHOST */}
            <span style={{
              position: 'absolute',
              top: 0,
              left: 8,
              fontSize: '20px',
              lineHeight: '24px',
              color: 'rgba(200, 160, 255, 0.6)',
              fontFamily: "'SF Pro Display', sans-serif",
              fontWeight: 600,
              opacity: ghostOpacity,
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}>
              {description}
            </span>
            {/* TEXTO REAL */}
            <span
              style={{
                fontSize: '20px',
                lineHeight: '24px',
                fontWeight: 600,
                fontFamily: "'SF Pro Display', sans-serif",
                color: 'rgba(235, 235, 245, 0.6)',
                marginTop: "5px",
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              {description}
            </span>
          </div>
        </div>

        {/* H e L */}
        <div style={{ 
          opacity: hlOpacity, 
          display: 'flex', 
          gap: 12, 
          marginTop: 0,
          transition: 'none',
          fontFamily: "'SF Pro Display', sans-serif",
          zIndex: 10,
        }}>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 400 }}>
            {weather ? `H:${formatTemp(weather.tempMax)}` : 'H:—°'}
          </span>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 400 }}>
            {weather ? `L:${formatTemp(weather.tempMin)}` : 'L:—°'}
          </span>
        </div>

        {/* CASA */}
        <div
          style={{
            marginTop: 110,
            transform: `translateY(${progress * -800}px)`,
            filter: `blur(${progress * 3}px)`,
            transition: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <House />
        </div>

        {error && <span className="text-red-400 text-xs mt-2">{error}</span>}
      </div>
    </div>
  )
}