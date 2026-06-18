import { Link, useParams } from '@tanstack/react-router'
import { useStore, useEventsWithStore } from '@ttg/hooks'
import { Badge, EventCard, Spinner } from '@ttg/ui'
import { formatDate, formatLabel, gameLabel } from '@ttg/utils'
import { Breadcrumb, CapacityBar, Panel } from '../components'
import { formatBadgeVariant, tierBadgeVariant } from '../utils/variants'

export function StoreDetailPage() {
  const { storeSlug } = useParams({ strict: false }) as { storeSlug: string }
  const { data: store, isLoading: storeLoading } = useStore(storeSlug)
  const { data: allEvents, isLoading: eventsLoading } = useEventsWithStore()

  const storeEvents =
    allEvents?.filter(ev => ev.storeId === store?.id && ev.status !== 'completed') ?? []
  const pastEvents =
    allEvents?.filter(ev => ev.storeId === store?.id && ev.status === 'completed') ?? []

  if (storeLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!store)
    return (
      <div className="max-w-[1100px] mx-auto px-5 py-16 text-center text-ink-3">
        Store not found.
      </div>
    )

  return (
    <div className="page-enter max-w-[1100px] mx-auto px-5 py-8">
      <Breadcrumb
        items={[
          <Link to="/stores" className="hover:text-ink-2 transition-colors">Stores</Link>,
          <span className="text-ink-3">{store.name}</span>,
        ]}
      />

      {/* Store header */}
      <Panel className="p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[8px] bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-[20px] font-bold shrink-0">
            {store.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-[20px] font-semibold text-ink">{store.name}</h1>
              <Badge variant={tierBadgeVariant(store.tier)}>{store.tier.toUpperCase()}</Badge>
            </div>
            <p className="text-[13px] text-ink-3 mb-1">{store.city}, {store.country}</p>
            <p className="text-[12px] text-ink-4">{store.address}</p>
            {store.website && (
              <a
                href={store.website}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-gold hover:underline mt-1 inline-block"
              >
                {store.website} ↗
              </a>
            )}
          </div>
        </div>
      </Panel>

      {/* Upcoming events */}
      <h2 className="text-[16px] font-semibold text-ink mb-4">Upcoming Events</h2>
      {eventsLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : storeEvents.length === 0 ? (
        <p className="text-[13px] text-ink-3 py-8 text-center">No upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {storeEvents.map(ev => {
            const confirmed = ev.capacity - 4
            const waitlisted = 2
            const full = confirmed >= ev.capacity
            return (
              <Link key={ev.id} to="/events/$eventId" params={{ eventId: ev.id }}>
                <EventCard highlighted={full}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[13px] font-medium text-ink mb-0.5">{ev.name}</p>
                      <p className="text-[11px] text-ink-3">{formatDate(ev.date)} · {ev.time}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={formatBadgeVariant(ev.format)}>{formatLabel(ev.format)}</Badge>
                      {full && <span className="text-[10px] text-red font-medium">FULL</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-ink-4 mb-2">
                    <span>{gameLabel(ev.game)}</span>
                    <span>{ev.entryFee > 0 ? `${ev.entryFee} ${ev.currency}` : 'Free'}</span>
                  </div>
                  <CapacityBar
                    confirmed={confirmed}
                    capacity={ev.capacity}
                    waitlisted={waitlisted}
                    compact
                  />
                </EventCard>
              </Link>
            )
          })}
        </div>
      )}

      {/* Past events */}
      {pastEvents.length > 0 && (
        <>
          <h2 className="text-[16px] font-semibold text-ink mb-4">Past Events</h2>
          <div className="flex flex-col gap-2">
            {pastEvents.map(ev => (
              <div
                key={ev.id}
                className="flex items-center justify-between px-4 py-3 bg-surface-2 border border-line rounded-[8px] opacity-60"
              >
                <div>
                  <p className="text-[13px] text-ink">{ev.name}</p>
                  <p className="text-[11px] text-ink-4">{formatDate(ev.date)}</p>
                </div>
                <Badge variant="neutral">{formatLabel(ev.format)}</Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
