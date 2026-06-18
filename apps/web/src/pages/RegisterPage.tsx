import { useState } from 'react'
import { useParams, useSearch, Link } from '@tanstack/react-router'
import { useEvent } from '@ttg/hooks'
import { useCurrentUser } from '@ttg/auth'
import { Button, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel } from '@ttg/utils'
import { getStoreById } from '@ttg/mock-data'

export function RegisterPage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string }
  const search = useSearch({ strict: false }) as { type?: string; teammateName?: string }
  const { data: event, isLoading } = useEvent(eventId)
  const user = useCurrentUser()
  const [confirmed, setConfirmed] = useState(false)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!event) return <div className="max-w-[600px] mx-auto px-5 py-16 text-center text-ink-3">Event not found.</div>

  const store = getStoreById(event.storeId)
  const regType = (search.type as '1v1' | '2v2-solo' | '2v2-team') ?? '1v1'
  const teammateName = search.teammateName

  const typeLabel = regType === '1v1' ? '1v1 — Solo'
    : regType === '2v2-solo' ? '2HG — Looking for partner'
    : `2HG — Team with ${teammateName}`

  if (confirmed) {
    return (
      <div className="page-enter max-w-[520px] mx-auto px-5 py-16 text-center">
        <div className="text-[48px] mb-4">✅</div>
        <h1 className="text-[22px] font-semibold text-ink mb-2">You're registered!</h1>
        <p className="text-[13px] text-ink-3 mb-1">{event.name}</p>
        <p className="text-[12px] text-ink-4 mb-6">{formatDate(event.date)} · {event.time} · {store?.name}</p>
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

  return (
    <div className="page-enter max-w-[520px] mx-auto px-5 py-8">
      <div className="flex items-center gap-2 text-[12px] text-ink-4 mb-6">
        {store && (
          <>
            <Link to="/stores/$storeSlug" params={{ storeSlug: store.slug }} className="hover:text-ink-2 transition-colors">{store.name}</Link>
            <span>/</span>
          </>
        )}
        <Link to="/events/$eventId" params={{ eventId }} className="hover:text-ink-2 transition-colors">{event.name}</Link>
        <span>/</span>
        <span className="text-ink-3">Register</span>
      </div>

      <h1 className="text-[20px] font-semibold text-ink mb-1">Confirm registration</h1>
      <p className="text-[13px] text-ink-3 mb-6">Review your details and confirm.</p>

      <div className="bg-surface-2 border border-line rounded-[10px] p-5 mb-5">
        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">Event</p>
            <p className="text-ink font-medium">{event.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">Game</p>
            <p className="text-ink font-medium">{gameLabel(event.game)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">Format</p>
            <p className="text-ink font-medium">{formatLabel(event.format)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">Date</p>
            <p className="text-ink font-medium">{formatDate(event.date)} · {event.time}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">Store</p>
            <p className="text-ink font-medium">{store?.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">Entry Fee</p>
            <p className="text-ink font-medium">{event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free'}</p>
          </div>
        </div>

        <div className="border-t border-line mt-4 pt-4">
          <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-1">Player</p>
          <p className="text-[13px] text-ink font-medium">{user?.name ?? '—'}</p>
          <p className="text-[12px] text-ink-3">{user?.email}</p>
        </div>

        <div className="border-t border-line mt-4 pt-4">
          <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-1">Registration type</p>
          <p className="text-[13px] text-ink font-medium">{typeLabel}</p>
        </div>
      </div>

      <Button className="w-full mb-3" onClick={() => setConfirmed(true)}>
        Confirm Registration
      </Button>
      <Link to="/events/$eventId" params={{ eventId }}>
        <Button variant="ghost" className="w-full">Cancel</Button>
      </Link>
    </div>
  )
}
