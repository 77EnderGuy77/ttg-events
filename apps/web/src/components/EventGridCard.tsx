import { Link } from '@tanstack/react-router'
import { Badge, EventCard } from '@ttg/ui'
import { formatDate, getEventBadge } from '@ttg/utils'
import { getConfirmedCount } from '@ttg/mock-data'
import type { EventWithStore } from '@ttg/types'

interface EventGridCardProps {
  event: EventWithStore
}

export function EventGridCard({ event: ev }: EventGridCardProps) {
  const confirmed = getConfirmedCount(ev.id)
  const spotsLeft = ev.capacity - confirmed
  const pct = Math.min(100, Math.round((confirmed / ev.capacity) * 100))
  const badge = getEventBadge(ev.format, ev.type)
  const isFull = spotsLeft <= 0

  return (
    <Link to="/events/$eventId" params={{ eventId: ev.id }}>
      <EventCard>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink mb-[3px] truncate">{ev.name}</p>
            <p className="text-[11px] text-ink-4">{ev.store.name} · {ev.store.city}</p>
          </div>
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
        </div>

        <div className="flex gap-3 text-[11px] text-ink-3 mb-[10px]">
          <span>📅 {formatDate(ev.date)}, {ev.time}</span>
          <span style={{ color: pct >= 90 ? 'var(--gold)' : 'var(--text3)' }}>
            👥 {confirmed} / {ev.capacity}
          </span>
        </div>

        <p className={`text-[10px] mb-2 ${isFull ? 'text-red' : spotsLeft <= 3 ? 'text-amber' : 'text-ink-4'}`}>
          {isFull
            ? 'Event is full'
            : spotsLeft <= 3
            ? `⚠ Only ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`
            : `${spotsLeft} spots available`}
        </p>

        <button className="text-[11px] font-medium bg-gold text-surface px-[12px] py-[5px] rounded-[8px] border-none cursor-pointer hover:brightness-110 transition-all">
          {isFull ? 'Join Waitlist' : 'Register'}
        </button>
      </EventCard>
    </Link>
  )
}
