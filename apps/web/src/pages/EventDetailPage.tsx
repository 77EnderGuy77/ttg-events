import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useEvent, useEventStats, useMyRegistrations } from '@ttg/hooks'
import { useCurrentUser } from '@ttg/auth'
import { Badge, Button, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, getEventBadge } from '@ttg/utils'
import { getStoreById } from '@ttg/mock-data'
import { Breadcrumb, CapacityBar, DetailField, Panel } from '../components'

export function EventDetailPage() {
  const { eventId } = useParams({ strict: false }) as { eventId: string }
  const { data: event, isLoading } = useEvent(eventId)
  const { data: stats } = useEventStats(eventId)
  const { data: myRegs } = useMyRegistrations(useCurrentUser()?.id ?? '')
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [regType, setRegType] = useState<'1v1' | '2v2-solo' | '2v2-team'>('1v1')
  const [teammateName, setTeammateName] = useState('')
  const [teammateEmail, setTeammateEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const existingReg = useMemo(
    () => myRegs?.find(r => r.eventId === eventId) ?? null,
    [myRegs, eventId],
  )

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
  const badge = getEventBadge(event.format, event.type)

  const regOptions = is2hg
    ? [
        { value: '1v1' as const, label: '1v1 — Solo' },
        { value: '2v2-solo' as const, label: '2HG — Looking for partner' },
        { value: '2v2-team' as const, label: '2HG — Register with teammate' },
      ]
    : []

  function handleRegister() {
    navigate({
      to: '/events/$eventId/register',
      params: { eventId },
      search: {
        type: regType,
        teammateName: teammateName || undefined,
        teammateEmail: teammateEmail || undefined,
        guestName: !user ? guestName || undefined : undefined,
        guestEmail: !user ? guestEmail || undefined : undefined,
      } as never,
    })
  }

  const details = [
    { label: 'Date', value: formatDate(event.date) },
    { label: 'Time', value: event.time },
    { label: 'Game', value: gameLabel(event.game) },
    { label: 'Entry Fee', value: event.entryFee > 0 ? `${event.entryFee} ${event.currency}` : 'Free' },
    { label: 'Location', value: store ? `${store.city}, ${store.country}` : '—' },
    { label: 'Address', value: store?.address ?? '—' },
  ]

  const registerDisabled =
    (regType === '2v2-team' && (!teammateName.trim() || !teammateEmail.trim())) ||
    (!user && (!guestName.trim() || !guestEmail.trim()))

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
                {badge && <Badge variant={badge.variant as any}>{badge.label}</Badge>}
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

            {existingReg ? (
              <div className="bg-gold/10 border border-gold/20 rounded-[6px] p-3">
                <p className="text-[13px] font-medium text-gold mb-1">
                  {existingReg.status === 'registered' ? "You're registered ✓"
                    : existingReg.status === 'waitlisted' ? "You're on the waitlist"
                    : existingReg.status === 'checked-in' ? "You're checked in ✓"
                    : existingReg.status === 'attended' ? "You attended this event"
                    : "Registration cancelled"}
                </p>
                <p className="text-[12px] text-ink-3">
                  {existingReg.teammateName
                    ? `Team with ${existingReg.teammateName}`
                    : existingReg.type === '2v2-solo'
                    ? 'Looking for partner'
                    : '1v1 Solo'}
                </p>
              </div>
            ) : isEnded || waitlistFull ? (
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

                {regOptions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] text-ink-4 mb-2">Registration type</p>
                    <div className="flex flex-col gap-1.5">
                      {regOptions.map(opt => (
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
                )}

                {regType === '2v2-team' && (
                  <div className="mb-4">
                    <p className="text-[11px] text-ink-4 mb-2">Teammate</p>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Full name…"
                        value={teammateName}
                        onChange={e => setTeammateName(e.target.value)}
                        className="w-full bg-surface-3 border border-line text-ink text-[13px] px-3 py-2 rounded-[6px] outline-none focus:border-gold/50 placeholder:text-ink-4"
                      />
                      <input
                        type="email"
                        placeholder="teammate@email.com"
                        value={teammateEmail}
                        onChange={e => setTeammateEmail(e.target.value)}
                        className="w-full bg-surface-3 border border-line text-ink text-[13px] px-3 py-2 rounded-[6px] outline-none focus:border-gold/50 placeholder:text-ink-4"
                      />
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="mb-4">
                    <p className="text-[11px] text-ink-4 mb-2">Your details</p>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Full name…"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        className="w-full bg-surface-3 border border-line text-ink text-[13px] px-3 py-2 rounded-[6px] outline-none focus:border-gold/50 placeholder:text-ink-4"
                      />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        className="w-full bg-surface-3 border border-line text-ink text-[13px] px-3 py-2 rounded-[6px] outline-none focus:border-gold/50 placeholder:text-ink-4"
                      />
                    </div>
                    <p className="text-[10px] text-ink-4 mt-1.5">
                      Or <Link to="/login" className="text-gold hover:underline">sign in</Link> to track all your registrations
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={registerDisabled}
                >
                  {full ? 'Join Waitlist' : 'Register'}
                </Button>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
