import { calcFillPct } from '@ttg/utils'

interface CapacityBarProps {
  confirmed: number
  capacity: number
  waitlisted?: number
  waitlistCapacity?: number
  compact?: boolean
}

export function CapacityBar({
  confirmed,
  capacity,
  waitlisted,
  waitlistCapacity,
  compact,
}: CapacityBarProps) {
  const pct = calcFillPct(confirmed, capacity)
  const full = confirmed >= capacity
  const barColor = full ? 'var(--red)' : pct >= 75 ? 'var(--orange)' : 'var(--gold)'

  if (compact) {
    return (
      <div>
        <div className="h-[3px] bg-surface-4 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <p className="text-[10px] text-ink-4 mt-1">
          {confirmed}/{capacity} registered
          {full && waitlisted != null && waitlisted > 0 && ` · ${waitlisted} on waitlist`}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] text-ink-3">Capacity</p>
        <p className="text-[12px] font-medium text-ink">{confirmed} / {capacity}</p>
      </div>
      <div className="h-[5px] bg-surface-4 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      {full ? (
        <p className="text-[11px] text-red">
          Event is full
          {waitlisted != null && waitlistCapacity != null
            ? ` · ${waitlisted} on waitlist (max ${waitlistCapacity})`
            : ''}
        </p>
      ) : (
        <p className="text-[11px] text-ink-4">{capacity - confirmed} spots remaining</p>
      )}
    </div>
  )
}
