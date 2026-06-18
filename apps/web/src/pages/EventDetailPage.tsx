import { useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useEvent, useEventStats } from '@ttg/hooks'
import { useCurrentUser } from '@ttg/auth'
import { Badge, Button, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel, calcFillPct } from '@ttg/utils'
import { getStoreById } from '@ttg/mock-data'

export function EventDetailPage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string }
  const { data: event, isLoading } = useEvent(eventId)
  const { data: stats } = useEventStats(eventId)
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [regType, setRegType] = useState<'1v1' | '2v2-solo' | '2v2-team'>('1v1')
  const [teammateName, setTeammateName] = useState('')

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!event) return <div className="max-w-[1100px] mx-auto px-5 py-16 text-center text-ink-3">Event not found.</div>

  const store = getStoreById(event.storeId)
  const confirmed = stats?.confirmed ?? 0
  const waitlisted = stats?.waitlisted ?? 0
  const pct = calcFillPct(confirmed, event.capacity)
  const full = confirmed >= event.capacity
  const waitlistFull = full && waitlisted >= event.waitlistCapacity
  const is2hg = event.format === '2hg'

  const badgeVariant = (() => {
    const map: Record<string, 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral'> = {
      sealed: 'sealed', '2hg': '2hg', prerelease: 'prerelease', launch: 'launch',
    }
    return map[event.format] ?? 'neutral'
  })()

  function handleRegister() {
    if (!user) { navigate({ to: '/login' }); return }
    navigate({ to: '/events/$eventId/register', params: { eventId }, search: { type: regType, teammateName: teammateName || undefined } as never })
  }

  return (
    <div className="page-enter max-w-[900px] mx-auto px-5 py-8">
      {/* Breadcrumb */}
      {store && (
        <div className="flex items-center gap-2 text-[12px] text-ink-4 mb-6">
          <Link to="/stores" className="hover:text-ink-2 transition-colors">Stores</Link>
          <span>/</span>
          <Link to="/stores/$storeSlug" params={{ storeSlug: store.slug }} className="hover:text-ink-2 transition-colors">{store.name}</Link>
          <span>/</span>
          <span className="text-ink-3">{event.name}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h1 className="text-[22px] font-semibold text-ink">{event.name}</h1>
                <Badge variant={badgeVariant}>{formatLabel(event.format)}</Badge>
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
            {[
              { label: 'Date', value: formatDate(event.date) },
              { label: 'Time', value: event.time },
              { label: 'Game', value: gameLabel(event.game) },
              { label: 'Format', value: formatLabel(event.format) },
              { label: 'Entry Fee', value: event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free' },
              { label: 'Location', value: store?.city ?? '—' },
            ].map(item => (
              <div key={item.label} className="bg-surface-2 border border-line rounded-[8px] p-3">
                <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-[13px] font-medium text-ink">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Capacity */}
          <div className="bg-surface-2 border border-line rounded-[8px] p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] text-ink-3">Capacity</p>
              <p className="text-[12px] font-medium text-ink">{confirmed} / {event.capacity}</p>
            </div>
            <div className="h-[5px] bg-surface-4 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: full ? 'var(--red)' : pct >= 75 ? 'var(--orange)' : 'var(--gold)' }}
              />
            </div>
            {full ? (
              <p className="text-[11px] text-red">Event is full · {waitlisted} on waitlist (max {event.waitlistCapacity})</p>
            ) : (
              <p className="text-[11px] text-ink-4">{event.capacity - confirmed} spots remaining</p>
            )}
          </div>

          {event.notes && (
            <div className="bg-surface-2 border border-line rounded-[8px] p-4">
              <p className="text-[11px] text-ink-4 uppercase tracking-wider mb-1.5">Notes</p>
              <p className="text-[13px] text-ink-2 leading-relaxed">{event.notes}</p>
            </div>
          )}
        </div>

        {/* Registration panel */}
        <div className="w-full lg:w-[280px] shrink-0">
          <div className="bg-surface-2 border border-line rounded-[10px] p-5 sticky top-[68px]">
            <h2 className="text-[15px] font-semibold text-ink mb-4">Register</h2>

            {event.status === 'completed' || event.status === 'cancelled' ? (
              <p className="text-[13px] text-ink-3 text-center py-4">
                This event is {event.status}.
              </p>
            ) : waitlistFull ? (
              <p className="text-[13px] text-ink-3 text-center py-4">
                Event and waitlist are full.
              </p>
            ) : (
              <>
                {full && (
                  <div className="bg-amber/10 border border-amber/20 rounded-[6px] p-3 mb-4">
                    <p className="text-[12px] text-amber">Event is full — you'll be added to the waitlist.</p>
                  </div>
                )}

                {/* Registration type */}
                <div className="mb-4">
                  <p className="text-[11px] text-ink-4 mb-2">Registration type</p>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => setRegType('1v1')}
                      className={`text-left px-3 py-2 rounded-[6px] border text-[12px] transition-colors ${
                        regType === '1v1' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-surface-3 border-line text-ink-3 hover:text-ink'
                      }`}
                    >
                      1v1 — Solo
                    </button>
                    {is2hg && (
                      <>
                        <button
                          onClick={() => setRegType('2v2-solo')}
                          className={`text-left px-3 py-2 rounded-[6px] border text-[12px] transition-colors ${
                            regType === '2v2-solo' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-surface-3 border-line text-ink-3 hover:text-ink'
                          }`}
                        >
                          2HG — Looking for partner
                        </button>
                        <button
                          onClick={() => setRegType('2v2-team')}
                          className={`text-left px-3 py-2 rounded-[6px] border text-[12px] transition-colors ${
                            regType === '2v2-team' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-surface-3 border-line text-ink-3 hover:text-ink'
                          }`}
                        >
                          2HG — Register with teammate
                        </button>
                      </>
                    )}
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
          </div>
        </div>
      </div>
    </div>
  )
}
