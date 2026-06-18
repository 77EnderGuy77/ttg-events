import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useStores } from '@ttg/hooks'
import { Badge, Spinner } from '@ttg/ui'
import type { PlanTier } from '@ttg/types'

function tierVariant(tier: PlanTier): 'pro' | 'neutral' | 'free' {
  if (tier === 'pro') return 'pro'
  if (tier === 'basic') return 'neutral'
  return 'free'
}

export function StoresPage() {
  const { data: stores, isLoading } = useStores()
  const [cityFilter, setCityFilter] = useState('')
  const [search, setSearch] = useState('')

  const active = stores?.filter(s => s.status === 'active') ?? []
  const cities = [...new Set(active.map(s => s.city))].sort()

  const filtered = active.filter(s => {
    const matchCity = !cityFilter || s.city === cityFilter
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <div className="page-enter max-w-[1100px] mx-auto px-5 py-8">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-ink mb-1">Local Game Stores</h1>
        <p className="text-[13px] text-ink-3">Find events at stores near you</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          placeholder="Search stores…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface-2 border border-line text-ink text-[13px] px-3 py-1.5 rounded-[7px] outline-none focus:border-gold/50 w-48 placeholder:text-ink-4"
        />
        <button
          onClick={() => setCityFilter('')}
          className={`text-[12px] px-3 py-1.5 rounded-[6px] border transition-colors ${
            !cityFilter ? 'bg-gold/10 text-gold border-gold/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
          }`}
        >
          All cities
        </button>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setCityFilter(city === cityFilter ? '' : city)}
            className={`text-[12px] px-3 py-1.5 rounded-[6px] border transition-colors ${
              cityFilter === city ? 'bg-gold/10 text-gold border-gold/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          <p className="text-[12px] text-ink-4 mb-4">{filtered.length} store{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(store => (
              <Link key={store.id} to="/stores/$storeSlug" params={{ storeSlug: store.slug }}>
                <div className="bg-surface-2 border border-line rounded-[10px] p-4 hover:border-gold/40 transition-colors cursor-pointer h-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-[14px] font-semibold text-ink mb-0.5">{store.name}</p>
                      <p className="text-[12px] text-ink-3">{store.city}, {store.country}</p>
                    </div>
                    <Badge variant={tierVariant(store.tier)}>{store.tier.toUpperCase()}</Badge>
                  </div>
                  <p className="text-[11px] text-ink-4">{store.address}</p>
                  {store.website && (
                    <p className="text-[11px] text-gold mt-1 truncate">{store.website}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
