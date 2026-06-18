import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAdminStoreId, useCurrentUser } from '@ttg/auth'
import { useEventsWithStore } from '@ttg/hooks'
import { getConfirmedCount } from '@ttg/mock-data'
import { Badge, Button, Spinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ttg/ui'
import { formatDate, calcFillPct, getEventBadge } from '@ttg/utils'

export function EventsPage() {
  const user = useCurrentUser()
  const isSuperAdmin = user?.role === 'ttg-admin'
  const storeId = useAdminStoreId()
  const { data: allEvents = [], isLoading } = useEventsWithStore({ storeId: isSuperAdmin ? undefined : storeId ?? undefined })

  const [storeFilter, setStoreFilter] = useState('all')
  const [fmtFilter, setFmtFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const stores = [...new Set(allEvents.map(e => e.store.name))]

  const events = allEvents.filter(ev => {
    if (storeFilter !== 'all' && ev.store.name !== storeFilter) return false
    if (fmtFilter !== 'all' && ev.format !== fmtFilter) return false
    if (typeFilter !== 'all') {
      if (typeFilter === 'prerelease' && ev.type !== 'prerelease') return false
      if (typeFilter === 'launch' && ev.type !== 'launch') return false
    }
    return true
  })

  return (
    <div className="p-5 page-enter">
      {/* Filters row */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <select
          className="bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors min-w-[160px]"
          value={storeFilter}
          onChange={e => setStoreFilter(e.target.value)}
          disabled={!isSuperAdmin}
        >
          <option value="all">All stores</option>
          {stores.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors min-w-[130px]"
          value={fmtFilter}
          onChange={e => setFmtFilter(e.target.value)}
        >
          <option value="all">All formats</option>
          <option value="sealed">Sealed</option>
          <option value="2hg">2HG</option>
          <option value="prerelease">Prerelease</option>
          <option value="launch">Launch</option>
        </select>
        <select
          className="bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors min-w-[130px]"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="prerelease">Prerelease</option>
          <option value="launch">Launch</option>
        </select>
        <Link to="/events/new" className="ml-auto">
          <Button size="sm" className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New event
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[8px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(ev => {
                const reg = getConfirmedCount(ev.id)
                const fill = calcFillPct(reg, ev.capacity)
                const badge = getEventBadge(ev.format, ev.type)
                return (
                  <TableRow key={ev.id}>
                    <TableCell>
                      <div className="text-[12px] font-medium text-ink">{ev.name}</div>
                      {isSuperAdmin && <div className="text-[10px] text-ink-4">{ev.store.name}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="text-[11px]">{formatDate(ev.date)}</div>
                      <div className="text-[10px] text-ink-4">{ev.time}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: fill >= 90 ? 'var(--gold)' : 'var(--text2)' }}>{reg}</span>
                      <span className="text-ink-4 text-[11px]"> / {ev.capacity}</span>
                      <div className="mt-1 h-[2px] bg-surface-4 rounded-full w-[60px]">
                        <div
                          className="h-[2px] rounded-full"
                          style={{ width: `${fill}%`, background: fill >= 90 ? 'var(--gold)' : 'var(--green)' }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] text-green bg-green/10 border border-green/20 rounded-[4px] px-[7px] py-[2px]">
                        Active
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to="/events/$eventId" params={{ eventId: ev.id }}>
                          <button className="text-[10px] text-ink-3 border border-line rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:border-ink-4 transition-colors">
                            View
                          </button>
                        </Link>
                        <Link to="/events/$eventId" params={{ eventId: ev.id }}>
                          <button className="text-[10px] text-ink-3 border border-line rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:border-ink-4 transition-colors">
                            Edit
                          </button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-[14px] py-8 text-center text-[13px] text-ink-4">
                    No events match the current filters.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
