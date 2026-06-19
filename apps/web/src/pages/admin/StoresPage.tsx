import { useStores } from '@ttg/hooks'
import { EVENTS, SUBSCRIPTIONS } from '@ttg/mock-data'
import { Spinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ttg/ui'

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

export function StoresPage() {
  const { data: stores = [], isLoading } = useStores()

  return (
    <div className="p-5 page-enter">
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[8px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Admins</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map(store => {
                const eventCount = EVENTS.filter(e => e.storeId === store.id && e.status !== 'completed' && e.status !== 'cancelled').length
                const adminCount = store.adminIds.length
                const sub = SUBSCRIPTIONS.find(s => s.storeId === store.id)
                return (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="text-[12px] font-medium text-ink">{store.name}</div>
                      <div className="text-[10px] text-ink-4">{store.city}, {store.country}</div>
                    </TableCell>
                    <TableCell><TierBadge tier={store.tier} /></TableCell>
                    <TableCell><span className="text-[12px]">{eventCount}</span></TableCell>
                    <TableCell><span className="text-[12px]">{adminCount}</span></TableCell>
                    <TableCell>
                      <span className={`text-[11px] ${sub ? 'text-green' : 'text-ink-4'}`}>
                        {sub ? 'active' : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="text-[10px] text-ink-3 border border-line rounded-[4px] px-[7px] py-[2px] bg-transparent cursor-pointer hover:border-ink-4 transition-colors">
                        Manage
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
