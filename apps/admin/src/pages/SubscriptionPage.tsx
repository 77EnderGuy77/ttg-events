import { useAdminStoreId } from '@ttg/auth'
import { SUBSCRIPTIONS } from '@ttg/mock-data'
import { Badge } from '@ttg/ui'
import { formatIsoDate, formatCurrency } from '@ttg/utils'
import { Link } from '@tanstack/react-router'

const FEATURES: Record<string, string[]> = {
  free:  ['1 active event', 'Up to 16 players', '1v1 registration only', 'Public listing'],
  basic: ['Unlimited events', 'Up to 64 players', '2HG + 1v1 registration', 'Waitlist management', 'CSV export', 'Email announcements'],
  pro:   ['Everything in Basic', 'Unlimited players', 'Advanced analytics', 'Companion app integration', 'Priority support'],
}

export function SubscriptionPage() {
  const storeId = useAdminStoreId()
  const sub = SUBSCRIPTIONS.find(s => s.storeId === storeId)

  const tier = sub?.tier ?? 'free'
  const renewDate = sub ? formatIsoDate(sub.currentPeriodEnd) : '—'
  const amount = sub ? formatCurrency(sub.amount, sub.currency) : '€0'

  return (
    <div className="p-6 max-w-[600px]">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Subscription</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">Your current plan and billing</p>
      </div>

      {/* Current plan */}
      <div className="bg-surface-2 border border-line rounded-[10px] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-ink-4 uppercase tracking-wider mb-1">Current plan</p>
            <div className="flex items-center gap-2">
              <p className="text-[22px] font-bold text-ink capitalize">{tier}</p>
              <Badge variant={tier === 'pro' ? 'pro' : tier === 'basic' ? 'neutral' : 'free'}>
                {tier.toUpperCase()}
              </Badge>
            </div>
          </div>
          {sub && (
            <div className="text-right">
              <p className="text-[22px] font-bold text-ink">{amount}</p>
              <p className="text-[11px] text-ink-4">per {sub.billingCycle === 'monthly' ? 'month' : 'year'}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="bg-surface-3 rounded-[7px] p-3">
            <p className="text-ink-4 mb-0.5">Status</p>
            <p className="text-ink font-medium capitalize">{sub?.status ?? 'Active'}</p>
          </div>
          <div className="bg-surface-3 rounded-[7px] p-3">
            <p className="text-ink-4 mb-0.5">Renews</p>
            <p className="text-ink font-medium">{renewDate}</p>
          </div>
          <div className="bg-surface-3 rounded-[7px] p-3">
            <p className="text-ink-4 mb-0.5">Billing cycle</p>
            <p className="text-ink font-medium capitalize">{sub?.billingCycle ?? '—'}</p>
          </div>
          <div className="bg-surface-3 rounded-[7px] p-3">
            <p className="text-ink-4 mb-0.5">Currency</p>
            <p className="text-ink font-medium">{sub?.currency ?? 'EUR'}</p>
          </div>
        </div>
      </div>

      {/* Features included */}
      <div className="bg-surface-2 border border-line rounded-[10px] p-5 mb-5">
        <p className="text-[12px] font-semibold text-ink-3 mb-3">Included in your plan</p>
        <ul className="flex flex-col gap-2">
          {(FEATURES[tier] ?? []).map(f => (
            <li key={f} className="flex items-center gap-2 text-[12px] text-ink-2">
              <span className="text-green">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade CTA */}
      {tier !== 'pro' && (
        <div className="bg-gold/5 border border-gold/30 rounded-[10px] p-5">
          <p className="text-[14px] font-semibold text-ink mb-1">Upgrade to {tier === 'free' ? 'Basic or Pro' : 'Pro'}</p>
          <p className="text-[12px] text-ink-3 mb-4">
            {tier === 'free'
              ? 'Unlock unlimited events, 2HG registration, waitlist management, and more.'
              : 'Unlock advanced analytics, unlimited players, and companion app integration.'}
          </p>
          <div className="flex gap-2 items-center">
            <span className="text-[12px] text-ink-3">Contact us to upgrade:</span>
            <a href="mailto:billing@ttgevents.com" className="text-[12px] text-gold hover:underline">billing@ttgevents.com</a>
          </div>
          <p className="text-[11px] text-ink-4 mt-2">
            Or <Link to="/settings" className="text-gold hover:underline">view full pricing →</Link>
          </p>
        </div>
      )}
    </div>
  )
}
