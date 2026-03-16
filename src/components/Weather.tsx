import House from './House'
import type { WeatherInfo } from '../models/Weather'
import { formatTemp } from '../models/Weather'

interface Props {
  weather: WeatherInfo | null
  error: string | null
}

export default function Weather({ weather, error }: Props) {
  const description = weather
    ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
    : '—'

  return (
    <div
      className="absolute left-0 w-[390px] h-[183px] pointer-events-none z-20"
      style={{ top: 98, background: 'transparent' }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[390px] flex flex-col items-center justify-start"
        style={{ pointerEvents: 'none' }}
      >
        <span
          className="text-[34px] leading-[41px] text-white"
          style={{
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </span>

        <span
          className="mt-3 text-[96px] text-white tracking-[0.37px] not-italic"
          style={{
            fontFamily: "'SF Pro Display Thin Custom', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 100,
            lineHeight: '70px',
            letterSpacing: '0.37px',
          }}
        >
          {weather ? formatTemp(weather.temp) : '—°'}
        </span>

        <div className="mt-3 w-[115px] h-[48px] flex flex-col items-start justify-start relative">
          <span
            className="mt-1 whitespace-nowrap text-left w-full"
            style={{
              color: 'rgba(235,235,245,0.6)',
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 300,
              fontSize: 20,
              lineHeight: '24px',
              letterSpacing: '0.38px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {description}
          </span>

          <span
            className="whitespace-nowrap text-left w-full"
            style={{
              color: '#fff',
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 400,
              fontSize: 20,
              lineHeight: '24px',
              letterSpacing: '0.38px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {weather ? `H:${formatTemp(weather.tempMax)}` : 'H:—°'}
            <span style={{ display: 'inline-block', width: 12 }} />
            {weather ? `L:${formatTemp(weather.tempMin)}` : 'L:—°'}
          </span>
        </div>

        {error && (
          <span className="text-red-400 text-xs mt-2">{error}</span>
        )}

        <div style={{ height: 23 }} />
        <House />
      </div>
    </div>
  )
}