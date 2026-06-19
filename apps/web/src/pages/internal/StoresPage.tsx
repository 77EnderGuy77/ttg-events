import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useStores } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import { SUBSCRIPTIONS } from '@ttg/mock-data'
import type { PlanTier, StoreStatus } from '@ttg/types'

function tierVariant(t: PlanTier): 'pro' | 'neutral' | 'free' {
  return t === 'pro' ? 'pro' : t === 'basic' ? 'neutral' : 'free'
}
function statusVariant(s: StoreStatus): 'active' | 'neutral' | 'pending' {
  return s === 'active' ? 'active' : s === 'suspended' ? 'neutral' : 'pending'
}

export function StoresPage() {
  const { data: stores, isLoading } = useStores()
  const [tierFilter, setTierFilter] = useState<PlanTier | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StoreStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const all = stores ?? []
  const filtered = all.filter(s => {
    const matchTier = tierFilter === 'all' || s.tier === tierFilter
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
    return matchTier && matchStatus && matchSearch
  })

  function subForStore(storeId: string) {
    return SUBSCRIPTIONS.find(s => s.storeId === storeId)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Stores</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">{all.length} total · {all.filter(s => s.status === 'active').length} active</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface-2 border border-line text-ink text-[12px] px-3 py-1.5 rounded-[6px] outline-none focus:border-purple/50 w-40 placeholder:text-ink-4"
        />
        {(['all', 'free', 'basic', 'pro'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`text-[11px] px-3 py-1.5 rounded-[6px] border capitalize transition-colors ${
              tierFilter === t ? 'bg-purple/10 text-purple border-purple/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {t === 'all' ? 'All tiers' : t}
          </button>
        ))}
        <div className="w-px bg-line mx-1" />
        {(['all', 'active', 'suspended', 'pending'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-[11px] px-3 py-1.5 rounded-[6px] border capitalize transition-colors ${
              statusFilter === s ? 'bg-purple/10 text-purple border-purple/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {s === 'all' ? 'All statuses' : s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Store</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">City</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Billing</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(store => {
                const sub = subForStore(store.id)
                return (
                  <tr key={store.id} className="border-t border-line hover:bg-surface-3 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-ink">{store.name}</p>
                      <p className="text-[10px] text-ink-4">{store.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-3">{store.city}, {store.country}</td>
                    <td className="px-4 py-3"><Badge variant={tierVariant(store.tier)}>{store.tier.toUpperCase()}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={statusVariant(store.status)}>{store.status}</Badge></td>
                    <td className="px-4 py-3 text-[12px] text-ink-3 capitalize">{sub?.billingCycle ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Link
                        to="/internal/stores/$storeId"
                        params={{ storeId: store.id }}
                        className="text-[11px] text-purple hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-ink-4">No stores match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
