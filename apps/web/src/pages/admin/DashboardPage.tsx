import { useAdminStoreId, useCurrentUser } from '@ttg/auth'
import { useEventsWithStore, useStores, useStoreApplications } from '@ttg/hooks'
import { getConfirmedCount } from '@ttg/mock-data'
import { StatCard, Badge } from '@ttg/ui'
import { formatDate, calcFillPct, getEventBadge } from '@ttg/utils'
import { useNavigate } from '@tanstack/react-router'

const DAILY = [4, 7, 3, 9, 12, 6, 8, 11, 5, 14, 10, 8, 13, 18]
const MAX_VAL = Math.max(...DAILY)

const NOTIFS = [
  { title: 'New store request: Cardboard Palace', body: 'Submitted by Jan Dvořák — Praha, CZ', ago: '12m ago', href: '/admin/store-requests' },
  { title: 'Registration spike: Aetherdrift Sealed', body: '23 registrations in the last hour', ago: '1h ago', href: '/admin/events' },
  { title: 'New admin account created', body: 'admin@mythicgames.cz joined Mythic Games', ago: '3h ago', href: '/admin/stores' },
]

function pct(reg: number, cap: number) { return Math.round((reg / cap) * 100) }

export function DashboardPage() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const storeId = useAdminStoreId()
  const isSuperAdmin = user?.role === 'ttg-admin'
  const { data: allEvents = [] } = useEventsWithStore({ storeId: isSuperAdmin ? undefined : storeId ?? undefined })
  const { data: stores = [] } = useStores()
  const { data: applications = [] } = useStoreApplications()
  const pendingCount = applications.filter(a => a.status === 'pending').length

  const upcoming = allEvents.filter(e => e.status === 'upcoming' || e.status === 'active')
  const totalReg = upcoming.reduce((s, e) => s + getConfirmedCount(e.id), 0)
  const totalCap = upcoming.reduce((s, e) => s + e.capacity, 0)
  const totalUnpaid = Math.round(totalReg * 0.15)

  const pts = DAILY.map((v, i) => {
    const x = i * (560 / (DAILY.length - 1))
    const y = 130 - (v / MAX_VAL) * 120
    return { x, y }
  })
  const lineStr = pts.map(p => `${p.x},${p.y}`).join(' ')
  const areaStr = [...pts.map(p => `${p.x},${p.y}`), `560,130`, `0,130`].join(' ')

  return (
    <div className="p-5 page-enter">
      {isSuperAdmin && pendingCount > 0 && (
        <div
          className="bg-gold/[0.04] border border-gold/20 rounded-[8px] px-[14px] py-[10px] flex items-center justify-between text-gold text-[12px] mb-4 cursor-pointer"
          onClick={() => navigate({ to: '/admin/store-requests' })}
        >
          <span>⚠ {pendingCount} pending store request{pendingCount !== 1 ? 's' : ''}</span>
          <span className="text-[11px]">Review →</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] mb-[18px]">
        <StatCard label="Upcoming Events" value={upcoming.length} />
        <StatCard label="Total Registered" value={totalReg} gold />
        <StatCard label="Total Capacity" value={totalCap} />
        <StatCard label="Unpaid" value={totalUnpaid} sub="Collect at store" />
        {isSuperAdmin && <StatCard label="Stores" value={stores.length} />}
      </div>

      <div className="bg-surface-2 border border-line rounded-[8px] mb-4">
        <div className="px-[14px] py-[10px] border-b border-line text-[12px] font-medium text-ink">
          Registrations — last 14 days
        </div>
        <div className="px-[14px] pt-[14px] pb-2">
          <svg viewBox="0 0 560 140" width="100%" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5c8def" stopOpacity=".3" />
                <stop offset="100%" stopColor="#5c8def" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" y1={10 + i * 24} x2="560" y2={10 + i * 24} stroke="var(--borders)" strokeWidth=".5" />
            ))}
            <polygon points={areaStr} fill="url(#rg)" />
            <polyline points={lineStr} fill="none" stroke="var(--gold)" strokeWidth="1.5" />
            <text x="0" y="135" fill="var(--text4)" fontSize="9">2 Jun</text>
            <text x="280" y="135" fill="var(--text4)" fontSize="9" textAnchor="middle">8 Jun</text>
            <text x="560" y="135" fill="var(--text4)" fontSize="9" textAnchor="end">14 Jun</text>
          </svg>
        </div>
      </div>

      <div className="bg-surface-2 border border-line rounded-[8px] mb-4">
        <div className="px-[14px] py-[10px] border-b border-line flex items-center justify-between">
          <span className="text-[12px] font-medium text-ink">Upcoming Events</span>
          <button
            onClick={() => navigate({ to: '/admin/events' })}
            className="bg-none border-none text-gold text-[11px] cursor-pointer flex items-center gap-[3px]"
            style={{ background: 'none' }}
          >
            Manage →
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Event', 'Date', 'Registered', ''].map(h => (
                <th key={h} className="text-[10px] text-ink-4 uppercase tracking-[.08em] px-[14px] py-[9px] text-left font-normal border-b border-line">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upcoming.slice(0, 4).map(ev => {
              const reg = getConfirmedCount(ev.id)
              const fill = pct(reg, ev.capacity)
              const unpaid = Math.round(reg * 0.1)
              return (
                <tr key={ev.id} className="hover:[&_td]:bg-surface-3">
                  <td className="px-[14px] py-[9px] border-b border-line-soft text-[12px] text-ink-2">
                    <div className="text-[12px] font-medium text-ink">{ev.name}</div>
                    {isSuperAdmin && <div className="text-[10px] text-ink-4">{ev.store.name}</div>}
                  </td>
                  <td className="px-[14px] py-[9px] border-b border-line-soft text-[11px] text-ink-3">
                    {formatDate(ev.date)}
                  </td>
                  <td className="px-[14px] py-[9px] border-b border-line-soft text-[12px] text-ink-2">
                    <span style={{ color: fill >= 90 ? 'var(--gold)' : 'var(--text2)' }}>{reg}</span>
                    <span className="text-ink-4 text-[11px]"> / {ev.capacity}</span>
                    {unpaid > 0 && (
                      <span className="ml-[6px] text-[10px] text-amber border border-amber/30 rounded-[4px] px-[5px] py-[1px]">
                        {unpaid} unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-[14px] py-[9px] border-b border-line-soft">
                    <button
                      onClick={() => navigate({ to: '/admin/events/$eventId', params: { eventId: ev.id } })}
                      className="text-[10px] text-ink-3 border border-line rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:border-ink-4 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isSuperAdmin ? (
        <div className="bg-surface-2 border border-line rounded-[8px]">
          <div className="px-[14px] py-[10px] border-b border-line flex items-center justify-between">
            <span className="text-[12px] font-medium text-ink">Recent Notifications</span>
            <button
              onClick={() => navigate({ to: '/admin/notifications' })}
              className="bg-none border-none text-gold text-[11px] cursor-pointer"
              style={{ background: 'none' }}
            >
              View all →
            </button>
          </div>
          {NOTIFS.map((n, i) => (
            <div
              key={n.title}
              className={`flex gap-[10px] items-start px-[14px] py-[10px] cursor-pointer hover:bg-surface-3 ${i < NOTIFS.length - 1 ? 'border-b border-line-soft' : ''}`}
              onClick={() => navigate({ to: n.href as '/' })}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-ink truncate">{n.title}</div>
                <div className="text-[11px] text-ink-3 truncate">{n.body}</div>
              </div>
              <div className="text-[10px] text-ink-4 shrink-0">{n.ago}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-line rounded-[8px] p-5 flex flex-col items-center gap-[6px] text-ink-4 text-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <div className="text-[12px] text-ink-3">Advanced features require a Super Admin account</div>
          <div className="text-[11px]">Store management, audit logs and more are available to Super Admins.</div>
        </div>
      )}
    </div>
  )
}
