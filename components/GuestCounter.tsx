'use client'

const MIN_ADULTS = 1
const MAX_ADULTS = 10
const MIN_CHILDREN = 0
const MAX_CHILDREN = 6

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

interface GuestCounterProps {
  adults: number
  childCount: number
  onAdultsChange: (n: number) => void
  onChildCountChange: (n: number) => void
  variant?: 'light' | 'dark'
}

export default function GuestCounter({ adults, childCount, onAdultsChange, onChildCountChange, variant = 'light' }: GuestCounterProps) {
  const dark = variant === 'dark'

  const wrapClass = dark
    ? 'px-4 py-2.5'
    : 'border border-warm-border rounded-lg px-3 py-2 bg-white'

  const wrapStyle = dark
    ? { backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,169,110,0.25)' }
    : undefined

  const rowLabelClass = dark ? 'text-xs' : 'text-xs text-brown-mid'
  const rowLabelStyle = dark ? { color: '#f5ede4' } : undefined

  const btnClass = dark
    ? 'w-6 h-6 flex items-center justify-center text-sm font-bold rounded transition-opacity hover:opacity-80'
    : 'w-6 h-6 flex items-center justify-center text-sm font-bold rounded border border-warm-border text-brown hover:border-terra transition-colors'
  const btnStyle = dark ? { backgroundColor: 'rgba(201,169,110,0.2)', color: '#c9a96e' } : undefined

  const inputClass = dark
    ? 'w-9 text-center text-sm bg-transparent focus:outline-none'
    : 'w-9 text-center text-sm text-brown bg-transparent focus:outline-none'
  const inputStyle = dark ? { color: '#f5ede4' } : undefined

  function Row({
    label, value, min, max, onChange,
  }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
    return (
      <div className="flex items-center justify-between gap-3 py-1">
        <span className={rowLabelClass} style={rowLabelStyle}>{label}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onChange(clamp(value - 1, min, max))} className={btnClass} style={btnStyle} aria-label={`Decrease ${label}`}>
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            min={min}
            max={max}
            onChange={e => onChange(clamp(Number(e.target.value), min, max))}
            className={inputClass}
            style={inputStyle}
            aria-label={label}
          />
          <button type="button" onClick={() => onChange(clamp(value + 1, min, max))} className={btnClass} style={btnStyle} aria-label={`Increase ${label}`}>
            +
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={wrapClass} style={wrapStyle}>
      <Row label="Adults" value={adults} min={MIN_ADULTS} max={MAX_ADULTS} onChange={onAdultsChange} />
      <div className={dark ? 'h-px my-0.5' : 'h-px my-0.5 bg-warm-border'} style={dark ? { backgroundColor: 'rgba(201,169,110,0.2)' } : undefined} />
      <Row label="Children" value={childCount} min={MIN_CHILDREN} max={MAX_CHILDREN} onChange={onChildCountChange} />
    </div>
  )
}
