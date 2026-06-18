import { Link } from '@tanstack/react-router'
import { Badge } from '@ttg/ui'
import type { Store } from '@ttg/types'
import { tierBadgeVariant } from '../utils/variants'

interface StoreCardProps {
  store: Store
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link to="/stores/$storeSlug" params={{ storeSlug: store.slug }}>
      <div className="bg-surface-2 border border-line rounded-[10px] p-4 hover:border-gold/40 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[14px] font-semibold text-ink mb-0.5">{store.name}</p>
            <p className="text-[12px] text-ink-3">{store.city}, {store.country}</p>
          </div>
          <Badge variant={tierBadgeVariant(store.tier)}>{store.tier.toUpperCase()}</Badge>
        </div>
        <p className="text-[11px] text-ink-4">{store.address}</p>
        {store.website && (
          <p className="text-[11px] text-gold mt-1 truncate">{store.website}</p>
        )}
      </div>
    </Link>
  )
}
