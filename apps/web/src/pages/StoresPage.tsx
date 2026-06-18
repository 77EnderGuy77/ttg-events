import { useState } from 'react'
import { useStores } from '@ttg/hooks'
import { Spinner } from '@ttg/ui'
import { EmptyState, FilterButton, PageHeader, StoreCard } from '../components'

export function StoresPage() {
  const { data: stores, isLoading } = useStores()
  const [cityFilter, setCityFilter] = useState('')
  const [search, setSearch] = useState('')

  const active = stores?.filter(s => s.status === 'active') ?? []
  const cities = [...new Set(active.map(s => s.city))].sort()

  const filtered = active.filter(s => {
    const matchCity = !cityFilter || s.city === cityFilter
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <div className="page-enter max-w-[1100px] mx-auto px-5 py-8">
      <PageHeader title="Local Game Stores" subtitle="Find events at stores near you" />

      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          placeholder="Search stores…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface-2 border border-line text-ink text-[13px] px-3 py-1.5 rounded-[7px] outline-none focus:border-gold/50 w-48 placeholder:text-ink-4"
        />
        <FilterButton active={!cityFilter} onClick={() => setCityFilter('')}>
          All cities
        </FilterButton>
        {cities.map(city => (
          <FilterButton
            key={city}
            active={cityFilter === city}
            onClick={() => setCityFilter(city === cityFilter ? '' : city)}
          >
            {city}
          </FilterButton>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No stores match your search." />
      ) : (
        <>
          <p className="text-[12px] text-ink-4 mb-4">
            {filtered.length} store{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
