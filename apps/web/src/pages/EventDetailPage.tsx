import { useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useEvent, useEventStats } from '@ttg/hooks'
import { useCurrentUser } from '@ttg/auth'
import { Badge, Button, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel } from '@ttg/utils'
import { getStoreById } from '@ttg/mock-data'
import { Breadcrumb, CapacityBar, DetailField, Panel } from '../components'
import { formatBadgeVariant } from '../utils/variants'

export function EventDetailPage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string }
  const { data: event, isLoading } = useEvent(eventId)
  const { data: stats } = useEventStats(eventId)
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [regType, setRegType] = useState<'1v1' | '2v2-solo' | '2v2-team'>('1v1')
  const [teammateName, setTeammateName] = useState('')

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!event)
    return (
      <div className="max-w-[1100px] mx-auto px-5 py-16 text-center text-ink-3">
        Event not found.
      </div>
    )

  const store = getStoreById(event.storeId)
  const confirmed = stats?.confirmed ?? 0
  const waitlisted = stats?.waitlisted ?? 0
  const full = confirmed >= event.capacity
  const waitlistFull = full && waitlisted >= event.waitlistCapacity
  const is2hg = event.format === '2hg'
  const isEnded = event.status === 'completed' || event.status === 'cancelled'

  function handleRegister() {
    if (!user) { navigate({ to: '/login' }); return }
    navigate({
      to: '/events/$eventId/register',
      params: { eventId },
      search: { type: regType, teammateName: teammateName || undefined } as never,
    })
  }

  const details = [
    { label: 'Date', value: formatDate(event.date) },
    { label: 'Time', value: event.time },
    { label: 'Game', value: gameLabel(event.game) },
    { label: 'Format', value: formatLabel(event.format) },
    { label: 'Entry Fee', value: event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free' },
    { label: 'Location', value: store?.city ?? '—' },
  ]

  return (
    <div className="page-enter max-w-[900px] mx-auto px-5 py-8">
      {store && (
        <Breadcrumb
          items={[
            <Link to="/stores" className="hover:text-ink-2 transition-colors">Stores</Link>,
            <Link to="/stores/$storeSlug" params={{ storeSlug: store.slug }} className="hover:text-ink-2 transition-colors">{store.name}</Link>,
            <span className="text-ink-3">{event.name}</span>,
          ]}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h1 className="text-[22px] font-semibold text-ink">{event.name}</h1>
                <Badge variant={formatBadgeVariant(event.format)}>{formatLabel(event.format)}</Badge>
                {event.status === 'active' && <Badge variant="active">LIVE</Badge>}
              </div>
              {store && (
                <Link
                  to="/stores/$storeSlug"
                  params={{ storeSlug: store.slug }}
                  className="text-[13px] text-gold hover:underline"
                >
                  {store.name}
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {details.map(item => (
              <DetailField key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <Panel className="p-4 mb-4">
            <CapacityBar
              confirmed={confirmed}
              capacity={event.capacity}
              waitlisted={waitlisted}
              waitlistCapacity={event.waitlistCapacity}
            />
          </Panel>

          {event.notes && (
            <Panel className="p-4">
              <p className="text-[11px] text-ink-4 uppercase tracking-wider mb-1.5">Notes</p>
              <p className="text-[13px] text-ink-2 leading-relaxed">{event.notes}</p>
            </Panel>
          )}
        </div>

        {/* Registration panel */}
        <div className="w-full lg:w-[280px] shrink-0">
          <Panel className="p-5 sticky top-[68px]">
            <h2 className="text-[15px] font-semibold text-ink mb-4">Register</h2>

            {isEnded || waitlistFull ? (
              <p className="text-[13px] text-ink-3 text-center py-4">
                {isEnded ? `This event is ${event.status}.` : 'Event and waitlist are full.'}
              </p>
            ) : (
              <>
                {full && (
                  <div className="bg-amber/10 border border-amber/20 rounded-[6px] p-3 mb-4">
                    <p className="text-[12px] text-amber">
                      Event is full — you'll be added to the waitlist.
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-[11px] text-ink-4 mb-2">Registration type</p>
                  <div className="flex flex-col gap-1.5">
                    {([
                      { value: '1v1' as const, label: '1v1 — Solo' },
                      ...(is2hg ? [
                        { value: '2v2-solo' as const, label: '2HG — Looking for partner' },
                        { value: '2v2-team' as const, label: '2HG — Register with teammate' },
                      ] : []),
                    ]).map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setRegType(opt.value)}
                        className={`text-left px-3 py-2 rounded-[6px] border text-[12px] transition-colors ${
                          regType === opt.value
                            ? 'bg-gold/10 border-gold/30 text-gold'
                            : 'bg-surface-3 border-line text-ink-3 hover:text-ink'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {regType === '2v2-team' && (
                  <div className="mb-4">
                    <label className="text-[11px] text-ink-4 block mb-1.5">Teammate name</label>
                    <input
                      type="text"
                      placeholder="Full name…"
                      value={teammateName}
                      onChange={e => setTeammateName(e.target.value)}
                      className="w-full bg-surface-3 border border-line text-ink text-[13px] px-3 py-2 rounded-[6px] outline-none focus:border-gold/50 placeholder:text-ink-4"
                    />
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={regType === '2v2-team' && !teammateName.trim()}
                >
                  {full ? 'Join Waitlist' : 'Register'}
                </Button>

                {!user && (
                  <p className="text-[11px] text-ink-4 text-center mt-2">
                    <Link to="/login" className="text-gold hover:underline">Sign in</Link> to register
                  </p>
                )}
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
