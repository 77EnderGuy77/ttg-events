import { useParams } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useStoreById, useEventsWithStore } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import { SUBSCRIPTIONS } from '@ttg/mock-data'
import { formatDate, formatLabel, gameLabel, formatCurrency, formatIsoDate } from '@ttg/utils'
import type { PlanTier } from '@ttg/types'

function tierVariant(t: PlanTier): 'pro' | 'neutral' | 'free' {
  return t === 'pro' ? 'pro' : t === 'basic' ? 'neutral' : 'free'
}

export function StoreDetailPage() {
  const { storeId } = useParams({ strict: false }) as { storeId: string }
  const { data: store, isLoading } = useStoreById(storeId)
  const { data: allEvents } = useEventsWithStore()

  const events = allEvents?.filter(e => e.storeId === storeId) ?? []
  const sub = SUBSCRIPTIONS.find(s => s.storeId === storeId)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!store) return <div className="p-8 text-ink-3">Store not found.</div>

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-[12px] text-ink-4 mb-5">
        <Link to="/stores" className="hover:text-ink-2 transition-colors">Stores</Link>
        <span>/</span>
        <span className="text-ink-3">{store.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-[20px] font-semibold text-ink">{store.name}</h1>
            <Badge variant={tierVariant(store.tier)}>{store.tier.toUpperCase()}</Badge>
            <Badge variant={store.status === 'active' ? 'active' : store.status === 'suspended' ? 'neutral' : 'pending'}>
              {store.status}
            </Badge>
          </div>
          <p className="text-[12px] text-ink-3">{store.city}, {store.country} · {store.address}</p>
          {store.website && <a href={store.website} className="text-[12px] text-purple-light hover:underline">{store.website}</a>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Subscription */}
        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[11px] text-ink-4 uppercase tracking-wider mb-3">Subscription</p>
          {sub ? (
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between"><span className="text-ink-3">Plan</span><Badge variant={tierVariant(sub.tier)}>{sub.tier.toUpperCase()}</Badge></div>
              <div className="flex justify-between"><span className="text-ink-3">Amount</span><span className="text-ink font-medium">{formatCurrency(sub.amount, sub.currency)}/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span></div>
              <div className="flex justify-between"><span className="text-ink-3">Status</span><span className="text-green capitalize">{sub.status}</span></div>
              <div className="flex justify-between"><span className="text-ink-3">Renews</span><span className="text-ink">{formatIsoDate(sub.currentPeriodEnd)}</span></div>
            </div>
          ) : (
            <p className="text-[12px] text-ink-4">No active subscription</p>
          )}
        </div>

        {/* Store info */}
        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[11px] text-ink-4 uppercase tracking-wider mb-3">Store Info</p>
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex justify-between"><span className="text-ink-3">ID</span><span className="text-ink font-mono">{store.id}</span></div>
            <div className="flex justify-between"><span className="text-ink-3">Slug</span><span className="text-ink">{store.slug}</span></div>
            <div className="flex justify-between"><span className="text-ink-3">Admins</span><span className="text-ink">{store.adminIds.length}</span></div>
            <div className="flex justify-between"><span className="text-ink-3">Member since</span><span className="text-ink">{formatIsoDate(store.createdAt)}</span></div>
          </div>
        </div>

        {/* Events summary */}
        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[11px] text-ink-4 uppercase tracking-wider mb-3">Events</p>
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex justify-between"><span className="text-ink-3">Total</span><span className="text-ink font-bold">{events.length}</span></div>
            <div className="flex justify-between"><span className="text-ink-3">Upcoming</span><span className="text-ink">{events.filter(e => e.status === 'upcoming').length}</span></div>
            <div className="flex justify-between"><span className="text-ink-3">Active</span><span className="text-ink">{events.filter(e => e.status === 'active').length}</span></div>
            <div className="flex justify-between"><span className="text-ink-3">Completed</span><span className="text-ink">{events.filter(e => e.status === 'completed').length}</span></div>
          </div>
        </div>
      </div>

      {/* Events list */}
      <h2 className="text-[14px] font-semibold text-ink mb-3">All Events</h2>
      {events.length === 0 ? (
        <p className="text-[13px] text-ink-4 py-4">No events.</p>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Format</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-medium text-ink">{ev.name}</p>
                    <p className="text-[10px] text-ink-4">{gameLabel(ev.game)}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink-3">{formatDate(ev.date)}</td>
                  <td className="px-4 py-3 text-[12px] text-ink-3">{formatLabel(ev.format)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ev.status === 'active' ? 'active' : ev.status === 'upcoming' ? 'pending' : 'neutral'}>
                      {ev.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink-3">{ev.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
