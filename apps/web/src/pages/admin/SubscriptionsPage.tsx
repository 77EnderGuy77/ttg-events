import { SUBSCRIPTIONS, STORES } from '@ttg/mock-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ttg/ui'

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, string> = {
    pro:   'text-gold bg-gold/10 border-gold/20',
    basic: 'text-purple bg-purple/10 border-purple/20',
    free:  'text-ink-3 bg-surface-3 border-line',
  }
  return (
    <span className={`text-[10px] font-medium border rounded-[4px] px-[7px] py-[2px] capitalize ${map[tier] ?? map.free}`}>
      {tier}
    </span>
  )
}

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency }).format(cents / 100)
}

function formatExpiry(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const rows = STORES.map(store => {
  const sub = SUBSCRIPTIONS.find(s => s.storeId === store.id)
  return { store, sub }
})

export function SubscriptionsPage() {
  return (
    <div className="p-5 page-enter">
      <div className="grid grid-cols-3 gap-[10px] mb-4">
        {[
          { label: 'Pro stores', value: SUBSCRIPTIONS.filter(s => s.tier === 'pro' && s.status === 'active').length, cls: 'text-gold' },
          { label: 'Basic stores', value: SUBSCRIPTIONS.filter(s => s.tier === 'basic' && s.status === 'active').length, cls: 'text-purple' },
          { label: 'Free stores', value: STORES.length - SUBSCRIPTIONS.length, cls: 'text-ink-3' },
        ].map(c => (
          <div key={c.label} className="bg-surface-2 border border-line rounded-[8px] px-[14px] py-[10px]">
            <div className={`text-[20px] font-semibold ${c.cls}`}>{c.value}</div>
            <div className="text-[11px] text-ink-3 mt-[2px]">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface-2 border border-line rounded-[8px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Renews</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ store, sub }) => (
              <TableRow key={store.id}>
                <TableCell>
                  <div className="text-[12px] font-medium text-ink">{store.name}</div>
                  <div className="text-[10px] text-ink-4">{store.city}, {store.country}</div>
                </TableCell>
                <TableCell><TierBadge tier={sub?.tier ?? 'free'} /></TableCell>
                <TableCell>
                  <span className="text-[12px] text-ink-2">
                    {sub ? formatAmount(sub.amount, sub.currency) : '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] text-ink-3 capitalize">{sub?.billingCycle ?? '—'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] text-ink-3">
                    {sub ? formatExpiry(sub.currentPeriodEnd) : '—'}
                  </span>
                </TableCell>
                <TableCell>
                  {sub ? (
                    <span className="text-[10px] text-green bg-green/10 border border-green/20 rounded-[4px] px-[7px] py-[2px]">Active</span>
                  ) : (
                    <span className="text-[10px] text-ink-4 border border-line rounded-[4px] px-[7px] py-[2px]">Free</span>
                  )}
                </TableCell>
                <TableCell>
                  <button className="text-[10px] text-ink-3 border border-line rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:border-ink-4 transition-colors">
                    Manage
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
