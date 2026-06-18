import { Link } from '@tanstack/react-router'
import { useAdminStoreId } from '@ttg/auth'
import { useEventsWithStore } from '@ttg/hooks'
import { Badge, Button, Spinner } from '@ttg/ui'
import { formatDate, formatLabel, calcFillPct, gameLabel } from '@ttg/utils'
import type { EventStatus, EventFormat } from '@ttg/types'

function statusVariant(status: EventStatus): 'active' | 'neutral' | 'pending' | 'sealed' {
  const map: Record<EventStatus, 'active' | 'neutral' | 'pending' | 'sealed'> = {
    active: 'active', upcoming: 'pending', completed: 'neutral', cancelled: 'neutral',
  }
  return map[status]
}

function formatVariant(f: EventFormat): 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral' {
  const m: Record<string, 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral'> = {
    sealed: 'sealed', '2hg': '2hg', prerelease: 'prerelease', launch: 'launch',
  }
  return m[f] ?? 'neutral'
}

export function EventsPage() {
  const storeId = useAdminStoreId()
  const { data: allEvents, isLoading } = useEventsWithStore({ storeId: storeId ?? undefined })

  const events = allEvents ?? []
  const upcoming = events.filter(e => e.status === 'upcoming' || e.status === 'active')
  const past = events.filter(e => e.status === 'completed' || e.status === 'cancelled')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-ink">Events</h1>
          <p className="text-[12px] text-ink-3 mt-0.5">{events.length} total</p>
        </div>
        <Link to="/events/new">
          <Button size="sm">+ New Event</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-8">
              <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-3">Upcoming & Active</p>
              <div className="flex flex-col gap-2">
                {upcoming.map(ev => {
                  const filled = ev.capacity - 4
                  const pct = calcFillPct(filled, ev.capacity)
                  return (
                    <Link key={ev.id} to="/events/$eventId" params={{ eventId: ev.id }}>
                      <div className="bg-surface-2 border border-line rounded-[8px] px-4 py-3 hover:border-gold/40 transition-colors flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[13px] font-medium text-ink truncate">{ev.name}</p>
                            <Badge variant={statusVariant(ev.status)}>{ev.status}</Badge>
                            <Badge variant={formatVariant(ev.format)}>{formatLabel(ev.format)}</Badge>
                          </div>
                          <p className="text-[11px] text-ink-3">{formatDate(ev.date)} · {ev.time} · {gameLabel(ev.game)}</p>
                        </div>
                        <div className="shrink-0 text-right w-32">
                          <p className="text-[12px] text-ink mb-1">{filled}/{ev.capacity}</p>
                          <div className="h-[3px] bg-surface-4 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--red)' : pct >= 75 ? 'var(--orange)' : 'var(--gold)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-3">Past Events</p>
              <div className="flex flex-col gap-1.5">
                {past.map(ev => (
                  <Link key={ev.id} to="/events/$eventId" params={{ eventId: ev.id }}>
                    <div className="bg-surface-2 border border-line rounded-[7px] px-4 py-2.5 hover:border-gold/40 transition-colors flex items-center gap-4 opacity-70">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-ink truncate">{ev.name}</p>
                        <p className="text-[11px] text-ink-4">{formatDate(ev.date)}</p>
                      </div>
                      <Badge variant="neutral">Completed</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[13px] text-ink-3 mb-4">No events yet.</p>
              <Link to="/events/new"><Button>Create your first event</Button></Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
