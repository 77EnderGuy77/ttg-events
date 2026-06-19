import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useCurrentUser, useAdminStoreId } from '@ttg/auth'
import { useMyRegistrations, useEventsWithStore } from '@ttg/hooks'
import { getConfirmedCount, getEventStats, getRegistrationsWithUsers } from '@ttg/mock-data'
import { Badge, Button, Spinner } from '@ttg/ui'
import { formatDate, calcFillPct, getEventBadge } from '@ttg/utils'
import { EmptyState, PageHeader, RegistrationRow, StatCard } from '../../components'
import type { EventWithStore } from '@ttg/types'

// ── Admin view ────────────────────────────────────────────────────────────────

function AdminEventsView() {
  const user = useCurrentUser()!
  const navigate = useNavigate()
  const storeId = useAdminStoreId()
  const isSuperAdmin = user.role === 'ttg-admin'
  const { data: allEvents = [], isLoading } = useEventsWithStore({
    storeId: isSuperAdmin ? undefined : storeId ?? undefined,
  })

  const [storeFilter, setStoreFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showPlayersId, setShowPlayersId] = useState<string | null>(null)

  const stores = [...new Set(allEvents.map(e => e.store.name))]

  const events = allEvents.filter(ev => {
    if (storeFilter !== 'all' && ev.store.name !== storeFilter) return false
    if (statusFilter !== 'all' && ev.status !== statusFilter) return false
    return true
  })

  const upcoming = allEvents.filter(e => e.status === 'upcoming' || e.status === 'active')
  const totalReg = upcoming.reduce((s, e) => s + getConfirmedCount(e.id), 0)

  const stats = [
    { label: 'Upcoming', value: upcoming.length },
    { label: 'Registered', value: totalReg },
    { label: 'Total Events', value: allEvents.length },
  ]

  return (
    <div className="page-enter">
      <PageHeader title="My Events" subtitle="Manage your store events" />

      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <select
          className="bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors min-w-[140px]"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {isSuperAdmin && (
          <select
            className="bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors min-w-[160px]"
            value={storeFilter}
            onChange={e => setStoreFilter(e.target.value)}
          >
            <option value="all">All stores</option>
            {stores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <Link to="/admin/events/new" className="ml-auto">
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
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Event', 'Date', 'Format', 'Registered', 'Status', ''].map(h => (
                  <th key={h} className="text-[10px] text-ink-4 uppercase tracking-[.08em] px-[14px] py-[9px] text-left font-normal border-b border-line">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => {
                const reg = getConfirmedCount(ev.id)
                const fill = calcFillPct(reg, ev.capacity)
                const badge = getEventBadge(ev.format, ev.type)
                const st = ev.status
                const statusCls = st === 'active' ? 'text-green bg-green/10 border-green/20'
                  : st === 'upcoming' ? 'text-blue bg-blue/10 border-blue/20'
                  : st === 'cancelled' ? 'text-red bg-red/10 border-red/20'
                  : 'text-ink-3 bg-surface-3 border-line'
                const expanded = expandedId === ev.id
                const evStats = expanded ? getEventStats(ev.id) : null
                const showPlayers = showPlayersId === ev.id
                const players = showPlayers ? getRegistrationsWithUsers(ev.id) : []
                return (
                  <React.Fragment key={ev.id}>
                    <tr
                      className={`cursor-pointer hover:[&_td]:bg-surface-3 ${expanded ? '[&_td]:bg-surface-3 [&_td]:border-gold/20' : ''}`}
                      onClick={() => setExpandedId(expanded ? null : ev.id)}
                    >
                      <td className="px-[14px] py-[9px] border-b border-line-soft">
                        <div className="text-[12px] font-medium text-ink">{ev.name}</div>
                        {isSuperAdmin && <div className="text-[10px] text-ink-4">{ev.store.name}</div>}
                      </td>
                      <td className="px-[14px] py-[9px] border-b border-line-soft">
                        <div className="text-[11px] text-ink-3">{formatDate(ev.date)}</div>
                        <div className="text-[10px] text-ink-4">{ev.time}</div>
                      </td>
                      <td className="px-[14px] py-[9px] border-b border-line-soft">
                        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                      </td>
                      <td className="px-[14px] py-[9px] border-b border-line-soft">
                        <span style={{ color: fill >= 90 ? 'var(--gold)' : 'var(--text2)' }}>{reg}</span>
                        <span className="text-ink-4 text-[11px]"> / {ev.capacity}</span>
                        <div className="mt-1 h-[2px] bg-surface-4 rounded-full w-[60px]">
                          <div
                            className="h-[2px] rounded-full"
                            style={{ width: `${fill}%`, background: fill >= 90 ? 'var(--gold)' : 'var(--green)' }}
                          />
                        </div>
                      </td>
                      <td className="px-[14px] py-[9px] border-b border-line-soft">
                        <span className={`text-[10px] border rounded-[4px] px-[7px] py-[2px] capitalize ${statusCls}`}>
                          {st}
                        </span>
                      </td>
                      <td className="px-[14px] py-[9px] border-b border-line-soft text-ink-4 text-[11px] select-none">
                        {expanded ? '▲' : '▼'}
                      </td>
                    </tr>
                    {expanded && evStats && (
                      <tr key={`${ev.id}-stats`}>
                        <td colSpan={6} className="px-[14px] py-[12px] border-b border-line bg-surface-3">
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-3">
                            {[
                              { label: 'Confirmed',    value: `${evStats.confirmed} / ${ev.capacity}` },
                              { label: 'Waitlisted',   value: `${evStats.waitlisted} / ${ev.waitlistCapacity}` },
                              { label: 'Checked In',   value: evStats.checkedIn },
                              { label: 'Attended',     value: evStats.attended },
                              { label: 'Cancelled',    value: evStats.cancelled },
                              { label: 'Est. Revenue', value: evStats.estimatedRevenue > 0 ? `${evStats.estimatedRevenue} ${ev.currency}` : 'Free' },
                            ].map(item => (
                              <div key={item.label} className="bg-surface-2 border border-line rounded-[6px] px-3 py-2">
                                <p className="text-[9px] font-semibold text-ink-4 uppercase tracking-wider mb-1">{item.label}</p>
                                <p className="text-[15px] font-bold text-ink">{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); setShowPlayersId(showPlayers ? null : ev.id) }}
                            className="text-[11px] font-medium text-bg bg-gold border border-gold/50 rounded-[6px] px-3 py-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {showPlayers ? 'Hide Players' : 'Show All Stats'}
                          </button>

                          {showPlayers && (
                            <div className="mt-3 bg-surface-2 border border-line rounded-[6px] overflow-hidden">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr>
                                    {['Player', 'Type', 'Teammate', 'Status'].map(h => (
                                      <th key={h} className="text-[9px] text-ink-4 uppercase tracking-wider px-3 py-2 text-left font-normal border-b border-line">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {players.length === 0 ? (
                                    <tr>
                                      <td colSpan={4} className="px-3 py-4 text-center text-[11px] text-ink-4">No registrations yet.</td>
                                    </tr>
                                  ) : players.map(reg => {
                                    const stCls = reg.status === 'registered' ? 'text-gold'
                                      : reg.status === 'checked-in' || reg.status === 'attended' ? 'text-green'
                                      : reg.status === 'waitlisted' ? 'text-ink-3'
                                      : 'text-red'
                                    return (
                                      <tr key={reg.id} className="border-b border-line-soft last:border-0">
                                        <td className="px-3 py-2">
                                          <div className="text-[12px] font-medium text-ink">{reg.user.name}</div>
                                          <div className="text-[10px] text-ink-4">{reg.user.email}</div>
                                        </td>
                                        <td className="px-3 py-2 text-[11px] text-ink-3 capitalize">
                                          {reg.type === '1v1' ? '1v1' : reg.type === '2v2-solo' ? '2HG Solo' : '2HG Team'}
                                        </td>
                                        <td className="px-3 py-2 text-[11px] text-ink-3">
                                          {reg.teammateName ?? '—'}
                                        </td>
                                        <td className={`px-3 py-2 text-[11px] font-medium capitalize ${stCls}`}>
                                          {reg.status}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-[14px] py-8 text-center text-[13px] text-ink-4">
                    No events match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Player view ───────────────────────────────────────────────────────────────

function PlayerEventsView() {
  const user = useCurrentUser()!
  const { data: registrations, isLoading } = useMyRegistrations(user.id)
  const { data: events } = useEventsWithStore()

  const upcoming =
    registrations?.filter(
      r => r.status === 'registered' || r.status === 'waitlisted' || r.status === 'checked-in',
    ) ?? []

  const stats = [
    { label: 'Upcoming', value: upcoming.length },
    { label: 'Attended', value: registrations?.filter(r => r.status === 'attended').length ?? 0 },
    { label: 'Waitlisted', value: registrations?.filter(r => r.status === 'waitlisted').length ?? 0 },
  ]

  function getEvent(eventId: string): EventWithStore | undefined {
    return events?.find(ev => ev.id === eventId)
  }

  return (
    <div className="page-enter">
      <PageHeader title="My Events" subtitle={`Welcome back, ${user.name.split(' ')[0]}`} />

      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <h2 className="text-[14px] font-semibold text-ink mb-3">Upcoming & Active</h2>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : upcoming.length === 0 ? (
        <EmptyState
          message="No upcoming registrations"
          cta={
            <Link to="/stores" className="text-[13px] text-gold hover:underline">
              Browse events →
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map(reg => (
            <RegistrationRow key={reg.id} registration={reg} event={getEvent(reg.eventId)} />
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-line">
        <Link to="/dashboard/history" className="text-[13px] text-gold hover:underline">
          View full history →
        </Link>
      </div>
    </div>
  )
}

// ── Entry point ───────────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useCurrentUser()!
  const isAdmin = user.role === 'store-admin' || user.role === 'ttg-admin'
  return isAdmin ? <AdminEventsView /> : <PlayerEventsView />
}
