import { Link } from '@tanstack/react-router'
import { useCurrentUser } from '@ttg/auth'
import { useMyRegistrations, useEventsWithStore } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import { formatDate, registrationStatusLabel } from '@ttg/utils'

function statusVariant(status: string): 'active' | 'waitlisted' | 'neutral' | 'sealed' | 'pending' {
  const map: Record<string, 'active' | 'waitlisted' | 'neutral' | 'sealed' | 'pending'> = {
    registered: 'sealed',
    waitlisted: 'waitlisted',
    'checked-in': 'active',
    attended: 'neutral',
    cancelled: 'neutral',
  }
  return map[status] ?? 'neutral'
}

export function DashboardPage() {
  const user = useCurrentUser()!
  const { data: registrations, isLoading: regsLoading } = useMyRegistrations(user.id)
  const { data: events } = useEventsWithStore()

  const upcoming = registrations?.filter(r =>
    r.status === 'registered' || r.status === 'waitlisted' || r.status === 'checked-in'
  ) ?? []

  const stats = {
    upcoming: upcoming.length,
    attended: registrations?.filter(r => r.status === 'attended').length ?? 0,
    waitlisted: registrations?.filter(r => r.status === 'waitlisted').length ?? 0,
  }

  function getEvent(eventId: string) {
    return events?.find(ev => ev.id === eventId)
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink">My Events</h1>
        <p className="text-[13px] text-ink-3">Welcome back, {user.name.split(' ')[0]}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Upcoming', value: stats.upcoming },
          { label: 'Attended', value: stats.attended },
          { label: 'Waitlisted', value: stats.waitlisted },
        ].map(s => (
          <div key={s.label} className="bg-surface-2 border border-line rounded-[8px] p-3 text-center">
            <p className="text-[24px] font-bold text-ink">{s.value}</p>
            <p className="text-[11px] text-ink-4">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming registrations */}
      <h2 className="text-[14px] font-semibold text-ink mb-3">Upcoming & Active</h2>

      {regsLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : upcoming.length === 0 ? (
        <div className="bg-surface-2 border border-line rounded-[10px] p-8 text-center">
          <p className="text-[13px] text-ink-3 mb-3">No upcoming registrations</p>
          <Link to="/stores" className="text-[13px] text-gold hover:underline">Browse events →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map(reg => {
            const ev = getEvent(reg.eventId)
            return (
              <div key={reg.id} className="bg-surface-2 border border-line rounded-[8px] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {ev ? (
                      <Link
                        to="/events/$eventId"
                        params={{ eventId: ev.id }}
                        className="text-[13px] font-medium text-ink hover:text-gold transition-colors block truncate"
                      >
                        {ev.name}
                      </Link>
                    ) : (
                      <p className="text-[13px] font-medium text-ink">{reg.eventId}</p>
                    )}
                    {ev && (
                      <p className="text-[11px] text-ink-3 mt-0.5">
                        {ev.store.name} · {formatDate(ev.date)} · {ev.time}
                      </p>
                    )}
                    {reg.teammateName && (
                      <p className="text-[11px] text-ink-4 mt-0.5">Team with {reg.teammateName}</p>
                    )}
                  </div>
                  <Badge variant={statusVariant(reg.status)}>
                    {registrationStatusLabel(reg.status)}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-line">
        <Link to="/dashboard/history" className="text-[13px] text-gold hover:underline">
          View full history →
        </Link>
      </div>
    </div>
  )
}
