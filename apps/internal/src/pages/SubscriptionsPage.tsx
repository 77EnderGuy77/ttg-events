import { useStores } from '@ttg/hooks'
import { Badge } from '@ttg/ui'
import { SUBSCRIPTIONS } from '@ttg/mock-data'
import { formatCurrency, formatIsoDate } from '@ttg/utils'
import type { PlanTier } from '@ttg/types'

function tierVariant(t: PlanTier): 'pro' | 'neutral' | 'free' {
  return t === 'pro' ? 'pro' : t === 'basic' ? 'neutral' : 'free'
}

export function SubscriptionsPage() {
  const { data: stores } = useStores()

  const active = SUBSCRIPTIONS.filter(s => s.status === 'active')
  const mrr = active.filter(s => s.billingCycle === 'monthly').reduce((n, s) => n + s.amount, 0)
  const arr = active.reduce((n, s) => n + (s.billingCycle === 'monthly' ? s.amount * 12 : s.amount), 0)

  function storeName(storeId: string) {
    return stores?.find(s => s.id === storeId)?.name ?? storeId
  }

  const byTier = (['pro', 'basic', 'free'] as PlanTier[]).map(tier => ({
    tier,
    subs: active.filter(s => s.tier === tier),
    mrr: active.filter(s => s.tier === tier && s.billingCycle === 'monthly').reduce((n, s) => n + s.amount, 0),
  }))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Subscriptions</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">{active.length} active subscriptions</p>
      </div>

      {/* MRR / ARR summary */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[24px] font-bold text-green">{formatCurrency(mrr, 'EUR')}</p>
          <p className="text-[12px] text-ink-3">Monthly Recurring Revenue</p>
        </div>
        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[24px] font-bold text-ink">{formatCurrency(arr, 'EUR')}</p>
          <p className="text-[12px] text-ink-3">Annual Recurring Revenue</p>
        </div>
        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[24px] font-bold text-ink">{active.length}</p>
          <p className="text-[12px] text-ink-3">Active Subscriptions</p>
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {byTier.map(({ tier, subs, mrr: tierMrr }) => (
          <div key={tier} className="bg-surface-2 border border-line rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={tierVariant(tier)}>{tier.toUpperCase()}</Badge>
              <span className="text-[12px] text-ink-3">{subs.length} stores</span>
            </div>
            <p className="text-[18px] font-bold text-ink">
              {tierMrr > 0 ? formatCurrency(tierMrr, 'EUR') + '/mo' : '—'}
            </p>
          </div>
        ))}
      </div>

      {/* All subscriptions table */}
      <h2 className="text-[14px] font-semibold text-ink mb-3">All Subscriptions</h2>
      <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Store</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Plan</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Cycle</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Renews</th>
            </tr>
          </thead>
          <tbody>
            {SUBSCRIPTIONS.map(sub => (
              <tr key={sub.id} className="border-t border-line hover:bg-surface-3 transition-colors">
                <td className="px-4 py-3 text-[12px] font-medium text-ink">{storeName(sub.storeId)}</td>
                <td className="px-4 py-3"><Badge variant={tierVariant(sub.tier)}>{sub.tier.toUpperCase()}</Badge></td>
                <td className="px-4 py-3 text-[12px] text-ink">{formatCurrency(sub.amount, sub.currency)}</td>
                <td className="px-4 py-3 text-[12px] text-ink-3 capitalize">{sub.billingCycle}</td>
                <td className="px-4 py-3">
                  <Badge variant={sub.status === 'active' ? 'active' : sub.status === 'trialing' ? 'pending' : 'neutral'}>
                    {sub.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[12px] text-ink-3">{formatIsoDate(sub.currentPeriodEnd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
