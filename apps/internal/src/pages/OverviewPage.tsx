import { Link } from '@tanstack/react-router'
import { useStores, useEventsWithStore, useUsers, useStoreApplications } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import { SUBSCRIPTIONS } from '@ttg/mock-data'
import { formatDate, formatCurrency, relativeTime } from '@ttg/utils'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-surface-2 border border-line rounded-[10px] p-4">
      <p className="text-[28px] font-bold text-ink">{value}</p>
      <p className="text-[12px] text-ink-3 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-ink-4 mt-0.5">{sub}</p>}
    </div>
  )
}

export function OverviewPage() {
  const { data: stores, isLoading: storesLoading } = useStores()
  const { data: events } = useEventsWithStore()
  const { data: users } = useUsers()
  const { data: applications } = useStoreApplications()

  const activeStores = stores?.filter(s => s.status === 'active').length ?? 0
  const upcomingEvents = events?.filter(e => e.status === 'upcoming' || e.status === 'active').length ?? 0
  const totalUsers = users?.length ?? 0
  const pending = applications?.filter(a => a.status === 'pending') ?? []

  const mrr = SUBSCRIPTIONS
    .filter(s => s.status === 'active' && s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  const recentApplications = [...(applications ?? [])].sort((a, b) =>
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  ).slice(0, 4)

  if (storesLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Platform Overview</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">TTG Events — super admin view</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Active Stores" value={activeStores} sub={`${stores?.length ?? 0} total`} />
        <StatCard label="Upcoming Events" value={upcomingEvents} sub={`${events?.length ?? 0} total`} />
        <StatCard label="Registered Users" value={totalUsers} />
        <StatCard label="Monthly Revenue" value={formatCurrency(mrr, 'EUR')} sub="active monthly subs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending applications */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-ink">Pending Applications</p>
            <Link to="/applications" className="text-[12px] text-purple-light hover:underline">View all →</Link>
          </div>
          {pending.length === 0 ? (
            <div className="bg-surface-2 border border-line rounded-[10px] p-5 text-center">
              <p className="text-[13px] text-ink-3">No pending applications</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pending.slice(0, 3).map(app => (
                <Link key={app.id} to="/applications">
                  <div className="bg-surface-2 border border-line rounded-[8px] px-4 py-3 hover:border-amber/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-ink">{app.storeName}</p>
                        <p className="text-[11px] text-ink-3">{app.city}, {app.country} · {app.contactName}</p>
                      </div>
                      <Badge variant="pending">Pending</Badge>
                    </div>
                  </div>
                </Link>
              ))}
              {pending.length > 3 && (
                <Link to="/applications" className="text-[12px] text-ink-4 hover:text-ink text-center py-1">
                  +{pending.length - 3} more
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Recent applications (all) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-ink">Recent Activity</p>
            <Link to="/stores" className="text-[12px] text-purple-light hover:underline">All stores →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentApplications.map(app => (
              <div key={app.id} className="bg-surface-2 border border-line rounded-[8px] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-ink">{app.storeName}</p>
                  <p className="text-[11px] text-ink-4">{app.city} · {relativeTime(app.submittedAt)}</p>
                </div>
                <Badge variant={app.status === 'pending' ? 'pending' : app.status === 'approved' ? 'active' : 'neutral'}>
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-ink">Upcoming Events</p>
            <Link to="/events" className="text-[12px] text-purple-light hover:underline">All events →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {(events ?? []).filter(e => e.status === 'upcoming').slice(0, 4).map(ev => (
              <div key={ev.id} className="bg-surface-2 border border-line rounded-[8px] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-ink">{ev.name}</p>
                    <p className="text-[11px] text-ink-3">{ev.store.name} · {ev.store.city}</p>
                  </div>
                  <p className="text-[11px] text-ink-4">{formatDate(ev.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription MRR breakdown */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-ink">Active Subscriptions</p>
            <Link to="/subscriptions" className="text-[12px] text-purple-light hover:underline">Details →</Link>
          </div>
          <div className="bg-surface-2 border border-line rounded-[10px] p-4">
            {(['pro', 'basic', 'free'] as const).map(tier => {
              const subs = SUBSCRIPTIONS.filter(s => s.tier === tier && s.status === 'active')
              const tierMrr = subs.filter(s => s.billingCycle === 'monthly').reduce((n, s) => n + s.amount, 0)
              return (
                <div key={tier} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={tier === 'pro' ? 'pro' : tier === 'basic' ? 'neutral' : 'free'}>{tier.toUpperCase()}</Badge>
                    <span className="text-[12px] text-ink-3">{subs.length} stores</span>
                  </div>
                  <span className="text-[12px] font-medium text-ink">{tierMrr > 0 ? formatCurrency(tierMrr, 'EUR') + '/mo' : '—'}</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between pt-3 mt-1">
              <span className="text-[12px] font-semibold text-ink">Total MRR</span>
              <span className="text-[14px] font-bold text-green">{formatCurrency(mrr, 'EUR')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
