import { useAdminStoreId } from '@ttg/auth'
import { useEventsWithStore, useEventStats } from '@ttg/hooks'
import { Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel, formatCurrency } from '@ttg/utils'

function EventRevenueRow({ eventId, name, date, game, format, entryFee, currency }: {
  eventId: string; name: string; date: string; game: string; format: string; entryFee: number; currency: string
}) {
  const { data: stats } = useEventStats(eventId)
  const revenue = stats ? stats.confirmed * entryFee : 0
  const confirmed = stats?.confirmed ?? 0

  return (
    <tr className="border-t border-line">
      <td className="py-3 pr-4">
        <p className="text-[13px] text-ink">{name}</p>
        <p className="text-[11px] text-ink-4">{formatDate(date)} · {game} · {format}</p>
      </td>
      <td className="py-3 pr-4 text-[13px] text-ink">{confirmed}</td>
      <td className="py-3 pr-4 text-[13px] text-ink">{entryFee > 0 ? `${entryFee} ${currency}` : 'Free'}</td>
      <td className="py-3 text-[13px] font-medium text-green">{entryFee > 0 ? formatCurrency(revenue, currency) : '—'}</td>
    </tr>
  )
}

export function RevenuePage() {
  const storeId = useAdminStoreId()
  const { data: events, isLoading } = useEventsWithStore({ storeId: storeId ?? undefined })

  const completed = (events ?? []).filter(e => e.status === 'completed')
  const upcoming = (events ?? []).filter(e => e.status === 'upcoming' || e.status === 'active')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Revenue</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">Estimated from confirmed registrations</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          {/* Upcoming events expected revenue */}
          {upcoming.length > 0 && (
            <section className="mb-8">
              <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-3">Expected (Upcoming)</p>
              <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Event</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Players</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Fee</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Est. Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="px-4">
                    {upcoming.map(ev => (
                      <tr key={ev.id} className="border-t border-line px-4">
                        <td className="px-4 py-3">
                          <p className="text-[13px] text-ink">{ev.name}</p>
                          <p className="text-[11px] text-ink-4">{formatDate(ev.date)} · {gameLabel(ev.game)} · {formatLabel(ev.format)}</p>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-ink">{ev.capacity - 4}</td>
                        <td className="px-4 py-3 text-[13px] text-ink">{ev.entryFee > 0 ? `${ev.entryFee} ${ev.currency}` : 'Free'}</td>
                        <td className="px-4 py-3 text-[13px] font-medium text-amber">
                          {ev.entryFee > 0 ? formatCurrency((ev.capacity - 4) * ev.entryFee, ev.currency) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Completed events actual revenue */}
          {completed.length > 0 && (
            <section>
              <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-3">Actual (Completed)</p>
              <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Event</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Attended</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Fee</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completed.map(ev => (
                      <EventRevenueRow
                        key={ev.id}
                        eventId={ev.id}
                        name={ev.name}
                        date={ev.date}
                        game={gameLabel(ev.game)}
                        format={formatLabel(ev.format)}
                        entryFee={ev.entryFee}
                        currency={ev.currency}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {events?.length === 0 && (
            <p className="text-[13px] text-ink-3 py-8 text-center">No events to show revenue for.</p>
          )}
        </>
      )}
    </div>
  )
}
