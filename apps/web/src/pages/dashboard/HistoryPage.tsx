import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCurrentUser } from '@ttg/auth'
import { useMyRegistrations, useEventsWithStore } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import { formatDate, registrationStatusLabel, registrationTypeLabel } from '@ttg/utils'
import type { RegistrationStatus } from '@ttg/types'

const STATUS_FILTERS: Array<{ label: string; value: RegistrationStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Registered', value: 'registered' },
  { label: 'Waitlisted', value: 'waitlisted' },
  { label: 'Checked In', value: 'checked-in' },
  { label: 'Attended', value: 'attended' },
  { label: 'Cancelled', value: 'cancelled' },
]

function statusVariant(status: RegistrationStatus): 'active' | 'waitlisted' | 'neutral' | 'sealed' | 'pending' {
  const map: Record<string, 'active' | 'waitlisted' | 'neutral' | 'sealed' | 'pending'> = {
    registered: 'sealed',
    waitlisted: 'waitlisted',
    'checked-in': 'active',
    attended: 'neutral',
    cancelled: 'neutral',
  }
  return map[status] ?? 'neutral'
}

export function HistoryPage() {
  const user = useCurrentUser()!
  const { data: registrations, isLoading } = useMyRegistrations(user.id)
  const { data: events } = useEventsWithStore()
  const [filter, setFilter] = useState<RegistrationStatus | 'all'>('all')

  const filtered = (registrations ?? []).filter(r => filter === 'all' || r.status === filter)

  function getEvent(eventId: string) {
    return events?.find(ev => ev.id === eventId)
  }

  return (
    <div className="page-enter">
      <div className="mb-5">
        <h1 className="text-[22px] font-semibold text-ink">Registration History</h1>
        <p className="text-[13px] text-ink-3">All your event registrations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-[11px] px-3 py-1 rounded-[5px] border transition-colors ${
              filter === f.value
                ? 'bg-gold/10 text-gold border-gold/30'
                : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-2 border border-line rounded-[10px] p-8 text-center">
          <p className="text-[13px] text-ink-3">No registrations found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(reg => {
            const ev = getEvent(reg.eventId)
            return (
              <div key={reg.id} className="bg-surface-2 border border-line rounded-[8px] p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  {ev ? (
                    <Link
                      to="/events/$eventId"
                      params={{ eventId: ev.id }}
                      className="text-[13px] font-medium text-ink hover:text-gold transition-colors truncate block"
                    >
                      {ev.name}
                    </Link>
                  ) : (
                    <p className="text-[13px] font-medium text-ink">{reg.eventId}</p>
                  )}
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {ev && (
                      <span className="text-[11px] text-ink-3">{ev.store.name} · {formatDate(ev.date)}</span>
                    )}
                    <span className="text-[11px] text-ink-4">{registrationTypeLabel(reg.type, reg.teammateName)}</span>
                  </div>
                </div>
                <Badge variant={statusVariant(reg.status)}>
                  {registrationStatusLabel(reg.status)}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
