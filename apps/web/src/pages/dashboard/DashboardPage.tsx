import { Link } from '@tanstack/react-router'
import { useCurrentUser } from '@ttg/auth'
import { useMyRegistrations, useEventsWithStore } from '@ttg/hooks'
import { Spinner } from '@ttg/ui'
import { EmptyState, PageHeader, RegistrationRow, StatCard } from '../../components'
import type { EventWithStore } from '@ttg/types'

export function DashboardPage() {
  const user = useCurrentUser()!
  const { data: registrations, isLoading } = useMyRegistrations(user.id)
  const { data: events } = useEventsWithStore()

  const upcoming =
    registrations?.filter(
      r => r.status === 'registered' || r.status === 'waitlisted' || r.status === 'checked-in',
    ) ?? []

  const stats = [
    { label: 'Upcoming', value: upcoming.length },
    { label: 'Attended', value: registrations?.filter(r => r.status === 'attended').length ?? 0 },
    { label: 'Waitlisted', value: registrations?.filter(r => r.status === 'waitlisted').length ?? 0 },
  ]

  function getEvent(eventId: string): EventWithStore | undefined {
    return events?.find(ev => ev.id === eventId)
  }

  return (
    <div className="page-enter">
      <PageHeader title="My Events" subtitle={`Welcome back, ${user.name.split(' ')[0]}`} />

      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <h2 className="text-[14px] font-semibold text-ink mb-3">Upcoming & Active</h2>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : upcoming.length === 0 ? (
        <EmptyState
          message="No upcoming registrations"
          cta={
            <Link to="/stores" className="text-[13px] text-gold hover:underline">
              Browse events →
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map(reg => (
            <RegistrationRow key={reg.id} registration={reg} event={getEvent(reg.eventId)} />
          ))}
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
