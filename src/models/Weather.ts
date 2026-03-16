export type HourlyForecast = {
  dt:          number
  temp:        number
  icon:        string
  description: string
  pop:         number
}

export type DailyForecast = {
  dt:      number
  tempMax: number
  tempMin: number
  icon:    string
  pop:     number
}

export type WeatherInfo = {
  name:        string
  temp:        number
  feelsLike:   number
  description: string
  humidity:    number
  windSpeed:   number
  icon:        string
  tempMax:     number
  tempMin:     number
  hourly:      HourlyForecast[]
  daily:       DailyForecast[]
}

export function formatTemp(temp: number) {
  return `${Math.round(temp)}°`
}

export function getIconUrl(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

export function getLocalIcon(icon: string): string {
  const base = '/climas/'
  const isDay = icon.endsWith('d')

  // Código numérico: "09d" → 9, "10n" → 10
  const code = parseInt(icon.slice(0, 2), 10)

  if (isDay) {
    // Dia: chuva forte / tempestade / neve → angled rain
    // Dia: céu limpo / nuvem leve / garoa / névoa → mid rain (o mais "suave" disponível)
    if (code === 11 || code === 9) {
      return base + 'Sun cloud angled rain.png'
    }
    return base + 'Sun cloud mid rain.png'
  } else {
    // Noite: chuva / tempestade → mid rain
    if (code === 9 || code === 10 || code === 11 || code === 13) {
      return base + 'Moon cloud mid rain.png'
    }
    // Noite: céu limpo / nuvem / vento / névoa → fast wind
    return base + 'Moon cloud fast wind.png'
  }
}

export function getLargeIcon(icon: string): string {
  const base = '/icon-grandes/'
  const isDay = icon.endsWith('d')
  const code = parseInt(icon.slice(0, 2), 10)

  if (isDay) {
    if (code === 11 || code === 9) return base + 'Sun cloud angled rain.png'
    return base + 'Sun cloud mid rain.png'
  } else {
    if (code === 9 || code === 10 || code === 11 || code === 13) return base + 'Moon cloud mid rain.png'
    return base + 'Moon cloud fast wind.png'
  }
}

export function formatHour(dt: number): string {
  const now  = new Date()
  const date = new Date(dt * 1000)
  if (Math.abs(date.getTime() - now.getTime()) < 5400 * 1000) return 'Now'
  const h = date.getHours()
  if (h === 0)  return '12 AM'
  if (h === 12) return '12 PM'
  return h < 12 ? `${h} AM` : `${h - 12} PM`
}

export function formatWeekDay(dt: number): string {
  const now  = new Date()
  const date = new Date(dt * 1000)
  if (date.toDateString() === now.toDateString()) return 'Today'
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}