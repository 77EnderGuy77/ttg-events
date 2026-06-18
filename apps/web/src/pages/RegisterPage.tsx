import { useState } from 'react'
import { useParams, useSearch, Link } from '@tanstack/react-router'
import { useEvent } from '@ttg/hooks'
import { useCurrentUser } from '@ttg/auth'
import { Button, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel } from '@ttg/utils'
import { getStoreById } from '@ttg/mock-data'
import { Breadcrumb, DetailField, Panel } from '../components'

export function RegisterPage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string }
  const search = useSearch({ strict: false }) as { type?: string; teammateName?: string }
  const { data: event, isLoading } = useEvent(eventId)
  const user = useCurrentUser()
  const [confirmed, setConfirmed] = useState(false)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!event)
    return (
      <div className="max-w-[600px] mx-auto px-5 py-16 text-center text-ink-3">
        Event not found.
      </div>
    )

  const store = getStoreById(event.storeId)
  const regType = (search.type as '1v1' | '2v2-solo' | '2v2-team') ?? '1v1'
  const teammateName = search.teammateName

  const typeLabel =
    regType === '1v1'
      ? '1v1 — Solo'
      : regType === '2v2-solo'
      ? '2HG — Looking for partner'
      : `2HG — Team with ${teammateName}`

  if (confirmed) {
    return (
      <div className="page-enter max-w-[520px] mx-auto px-5 py-16 text-center">
        <div className="text-[48px] mb-4">✅</div>
        <h1 className="text-[22px] font-semibold text-ink mb-2">You're registered!</h1>
        <p className="text-[13px] text-ink-3 mb-1">{event.name}</p>
        <p className="text-[12px] text-ink-4 mb-6">
          {formatDate(event.date)} · {event.time} · {store?.name}
        </p>
        <p className="text-[13px] text-ink-2 mb-1">{typeLabel}</p>
        <div className="flex flex-col gap-2 mt-8">
          <Link to="/dashboard">
            <Button className="w-full">View My Events</Button>
          </Link>
          <Link to="/stores">
            <Button variant="ghost" className="w-full">Browse More Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const summaryFields = [
    { label: 'Event', value: event.name },
    { label: 'Game', value: gameLabel(event.game) },
    { label: 'Format', value: formatLabel(event.format) },
    { label: 'Date', value: `${formatDate(event.date)} · ${event.time}` },
    { label: 'Store', value: store?.name ?? '—' },
    { label: 'Entry Fee', value: event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free' },
  ]

  return (
    <div className="page-enter max-w-[520px] mx-auto px-5 py-8">
      <Breadcrumb
        items={[
          ...(store
            ? [
                <Link
                  to="/stores/$storeSlug"
                  params={{ storeSlug: store.slug }}
                  className="hover:text-ink-2 transition-colors"
                >
                  {store.name}
                </Link>,
              ]
            : []),
          <Link
            to="/events/$eventId"
            params={{ eventId }}
            className="hover:text-ink-2 transition-colors"
          >
            {event.name}
          </Link>,
          <span className="text-ink-3">Register</span>,
        ]}
      />

      <h1 className="text-[20px] font-semibold text-ink mb-1">Confirm registration</h1>
      <p className="text-[13px] text-ink-3 mb-6">Review your details and confirm.</p>

      <Panel className="p-5 mb-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {summaryFields.map(f => (
            <DetailField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        <div className="border-t border-line pt-4">
          <DetailField label="Player" value={user?.name ?? '—'} />
          {user?.email && (
            <p className="text-[12px] text-ink-3 mt-1 px-3">{user.email}</p>
          )}
        </div>

        <div className="border-t border-line mt-4 pt-4">
          <DetailField label="Registration type" value={typeLabel} />
        </div>
      </Panel>

      <Button className="w-full mb-3" onClick={() => setConfirmed(true)}>
        Confirm Registration
      </Button>
      <Link to="/events/$eventId" params={{ eventId }}>
        <Button variant="ghost" className="w-full">Cancel</Button>
      </Link>
    </div>
  )
}
