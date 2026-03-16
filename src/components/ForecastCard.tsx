import React from 'react'
import { formatTemp, getLocalIcon, formatHour } from '../models/Weather'
import type { HourlyForecast } from '../models/Weather'

interface Props {
  entry: HourlyForecast
}

export default function ForecastCard({ entry }: Props) {
  return (
    <div
      style={{
        width: 60,
        height: 146,
        borderRadius: 30,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 8px',
        background: 'rgba(72,49,157,0.20)',
        border: '1px solid rgba(255,255,255,0.20)',
        boxSizing: 'border-box',
        boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
      }}
    >
      {/* Hora */}
      <span
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
          fontSize: 14,
          lineHeight: '20px',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {formatHour(entry.dt)}
      </span>

      <div style={{ height: 16 }} />

      {/* Ícone + precipitação */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 42 }}>
    <img
        src={getLocalIcon(entry.icon)}
        width={32}
        height={32}
        alt={entry.description}
        style={{ display: 'block' }}
        draggable={false}
    />
    {entry.pop > 0 && (
        <span
        style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
            fontSize: 13,
            lineHeight: '18px',
            fontWeight: 500,
            color: '#40CBD8',
            textAlign: 'center',
            transform: 'translateY(-8px)',
        }}
        >
        {entry.pop}%
        </span>
    )}
    </div>

      <div style={{ height: 14 }} />

      {/* Temperatura */}
      <span
        style={{
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 20,
          lineHeight: '24px',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        {formatTemp(entry.temp)}
      </span>
    </div>
  )
}