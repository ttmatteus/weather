import type { WeatherInfo } from '../models/Weather'
import { formatTemp, getLargeIcon } from '../models/Weather'

interface Props {
  weather: WeatherInfo | null
}

export default function WeatherCard({ weather }: Props) {
  const icon = weather ? getLargeIcon(weather.icon) : '/icon-grandes/Moon_cloud_fast_wind.png'
  const description = weather
    ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
    : 'Mid rain'

  return (
    <div style={{ width: 342, height: 184, position: 'relative', boxSizing: 'border-box' }}>
      <svg width="342" height="175" viewBox="0 0 342 175" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <path d="M0 66.3829C0 31.5888 0 14.1918 11.326 5.18378C22.6519 -3.82419 39.6026 0.0913222 73.5041 7.92235L307.903 62.0671C324.259 65.8452 332.436 67.7342 337.218 73.7465C342 79.7588 342 88.1519 342 104.938V130.943C342 151.685 342 162.056 335.556 168.5C329.113 174.943 318.742 174.943 298 174.943H44C23.2582 174.943 12.8873 174.943 6.44365 168.5C0 162.056 0 151.685 0 130.943V66.3829Z" fill="url(#paint0_linear_1567_1543)"/>
        <defs>
          <linearGradient id="paint0_linear_1567_1543" x1="0" y1="127.943" x2="354.142" y2="127.943" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5936B4"/>
            <stop offset="1" stopColor="#362A84"/>
          </linearGradient>
        </defs>
      </svg>

      <img src={icon} width={100} height={100} alt="" draggable={false} style={{ position: 'absolute', top: 8, right: 20 }} />

      <span style={{ position: 'absolute', top: 146, right: 20, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 400, fontSize: 16, lineHeight: '20px', letterSpacing: '0.37px', color: 'rgba(235,235,245,0.6)', whiteSpace: 'nowrap' }}>
        {description}
      </span>

      <span style={{ position: 'absolute', top: 58, left: 20, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 400, fontSize: 64, lineHeight: '41px', letterSpacing: '0.37px', color: '#fff', whiteSpace: 'nowrap' }}>
        {weather ? formatTemp(weather.temp) : '—°'}
      </span>

      <span style={{ position: 'absolute', top: 123, left: 20, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 400, fontSize: 16, lineHeight: '20px', letterSpacing: '0.37px', color: 'rgba(235,235,245,0.6)', whiteSpace: 'nowrap' }}>
        {weather ? `H:${formatTemp(weather.tempMax)}` : 'H:—°'}
        <span style={{ display: 'inline-block', width: 8 }} />
        {weather ? `L:${formatTemp(weather.tempMin)}` : 'L:—°'}
      </span>

      <span style={{ position: 'absolute', top: 147, left: 20, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 400, fontSize: 16, lineHeight: '20px', letterSpacing: '0.37px', color: '#fff', whiteSpace: 'nowrap' }}>
        {weather?.name ?? 'Montreal, Canada'}
      </span>
    </div>
  )
}