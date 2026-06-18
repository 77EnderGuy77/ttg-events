import { useState } from 'react'
import { useCurrentUser } from '@ttg/auth'
import { useMyRegistrations, useEventsWithStore } from '@ttg/hooks'
import { Spinner } from '@ttg/ui'
import { EmptyState, FilterButton, PageHeader, RegistrationRow } from '../../components'
import type { RegistrationStatus, EventWithStore } from '@ttg/types'

const STATUS_FILTERS: Array<{ label: string; value: RegistrationStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Registered', value: 'registered' },
  { label: 'Waitlisted', value: 'waitlisted' },
  { label: 'Checked In', value: 'checked-in' },
  { label: 'Attended', value: 'attended' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function HistoryPage() {
  const user = useCurrentUser()!
  const { data: registrations, isLoading } = useMyRegistrations(user.id)
  const { data: events } = useEventsWithStore()
  const [filter, setFilter] = useState<RegistrationStatus | 'all'>('all')

  const filtered = (registrations ?? []).filter(r => filter === 'all' || r.status === filter)

  function getEvent(eventId: string): EventWithStore | undefined {
    return events?.find(ev => ev.id === eventId)
  }

  return (
    <div className="page-enter">
      <PageHeader title="Registration History" subtitle="All your event registrations" />

      <div className="flex flex-wrap gap-1.5 mb-5">
        {STATUS_FILTERS.map(f => (
          <FilterButton
            key={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
            className="text-[11px] py-1"
          >
            {f.label}
          </FilterButton>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No registrations found." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(reg => (
            <RegistrationRow key={reg.id} registration={reg} event={getEvent(reg.eventId)} />
          ))}
        </div>
      )}
    </div>
  )
}
