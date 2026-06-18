import { useState } from 'react'
import { useEventsWithStore } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel, calcFillPct } from '@ttg/utils'
import type { GameType, EventStatus } from '@ttg/types'

export function EventsPage() {
  const { data: events, isLoading } = useEventsWithStore()
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [gameFilter, setGameFilter] = useState<GameType | 'all'>('all')
  const [search, setSearch] = useState('')

  const allEvents = events ?? []
  const games = [...new Set(allEvents.map(e => e.game))].sort() as GameType[]

  const filtered = allEvents.filter(e => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    const matchGame = gameFilter === 'all' || e.game === gameFilter
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.store.name.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchGame && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">All Events</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">{allEvents.length} total across all stores</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          placeholder="Search events or stores…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface-2 border border-line text-ink text-[12px] px-3 py-1.5 rounded-[6px] outline-none focus:border-purple/50 w-48 placeholder:text-ink-4"
        />
        {(['all', 'upcoming', 'active', 'completed', 'cancelled'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-[11px] px-3 py-1.5 rounded-[6px] border capitalize transition-colors ${
              statusFilter === s ? 'bg-purple/10 text-purple-light border-purple/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {s === 'all' ? 'All statuses' : s}
          </button>
        ))}
        <div className="w-px bg-line mx-1" />
        <button
          onClick={() => setGameFilter('all')}
          className={`text-[11px] px-3 py-1.5 rounded-[6px] border transition-colors ${
            gameFilter === 'all' ? 'bg-purple/10 text-purple-light border-purple/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
          }`}
        >
          All games
        </button>
        {games.map(g => (
          <button
            key={g}
            onClick={() => setGameFilter(g)}
            className={`text-[11px] px-3 py-1.5 rounded-[6px] border transition-colors ${
              gameFilter === g ? 'bg-purple/10 text-purple-light border-purple/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {gameLabel(g)}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-ink-4 mb-3">{filtered.length} events</p>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Store</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Format</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Fill</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(ev => {
                const filled = ev.capacity - 4
                const pct = calcFillPct(filled, ev.capacity)
                return (
                  <tr key={ev.id} className="border-t border-line hover:bg-surface-3 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-medium text-ink">{ev.name}</p>
                      <p className="text-[10px] text-ink-4">{gameLabel(ev.game)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] text-ink-3">{ev.store.name}</p>
                      <p className="text-[10px] text-ink-4">{ev.store.city}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-3">{formatDate(ev.date)}</td>
                    <td className="px-4 py-3 text-[12px] text-ink-3">{formatLabel(ev.format)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ev.status === 'active' ? 'active' : ev.status === 'upcoming' ? 'pending' : 'neutral'}>
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-[3px] bg-surface-4 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--red)' : pct >= 75 ? 'var(--orange)' : 'var(--gold)' }}
                          />
                        </div>
                        <span className="text-[10px] text-ink-4">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {sorted.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-ink-4">No events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
