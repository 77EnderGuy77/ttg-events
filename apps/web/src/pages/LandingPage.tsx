import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useEventsWithStore, useStores } from '@ttg/hooks'
import { Spinner } from '@ttg/ui'
import {
  EventGridCard,
  FaqAccordion,
  FilterButton,
  EmptyState,
} from '../components'

const FAQ = [
  {
    q: 'What is a Prerelease?',
    a: "A Prerelease is held the weekend before a new set launches. You get a sealed Prerelease pack, build a 40-card deck on the spot, and battle other players. It's casual, friendly, and the best way to experience a new set.",
  },
  {
    q: 'Do I need an account to register?',
    a: 'No — register as a guest with just your name and email. An account lets you see all your registrations in one place.',
  },
  {
    q: 'Can I cancel my registration?',
    a: 'Yes. Your confirmation email includes a cancellation link valid up to 24 hours before the event.',
  },
  {
    q: 'Do I pay online or at the store?',
    a: 'Payment is collected at the store on the day. Your spot is reserved the moment you register — no deposit required.',
  },
]

const FORMATS = ['All', 'Sealed', '2HG'] as const
type FormatFilter = (typeof FORMATS)[number]

export function LandingPage() {
  const { data: events = [], isLoading } = useEventsWithStore({ status: 'upcoming' })
  const { data: stores = [] } = useStores()

  const [storeFilter, setStoreFilter] = useState('all')
  const [fmtFilter, setFmtFilter] = useState<FormatFilter>('All')

  const filtered = events.filter(ev => {
    if (storeFilter !== 'all' && ev.store.slug !== storeFilter) return false
    if (fmtFilter === 'Sealed' && ev.format !== 'sealed') return false
    if (fmtFilter === '2HG' && ev.format !== '2hg') return false
    return true
  })

  return (
    <div className="page-enter">
      {/* Hero */}
      <section
        className="relative border-b border-line py-16 px-5 overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 700px 350px at 50% 100%, #5C8DEF08 0%, transparent 70%)',
          }}
        />
        <div className="max-w-[880px] mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-[6px] text-gold text-[10px] uppercase tracking-[.18em] font-medium px-[10px] py-[3px] rounded-full mb-4 border"
            style={{ background: 'var(--goldS)', borderColor: 'var(--goldB)' }}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-gold pulse-ring" />
            Upcoming prereleases
          </div>

          <h1 className="text-[36px] font-semibold text-ink leading-[1.15] tracking-[-0.02em] mb-[10px]">
            Find your local<br />
            <span className="text-gold">MTG Prerelease</span>
          </h1>
          <p className="text-[14px] text-ink-3 max-w-[480px] mx-auto mb-7">
            Register for Magic: The Gathering prerelease events at stores near you.
            Build your sealed deck and battle on day one.
          </p>

          {/* Filters */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <select
              className="bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors min-w-[180px]"
              value={storeFilter}
              onChange={e => setStoreFilter(e.target.value)}
            >
              <option value="all">All stores</option>
              {stores.map(s => (
                <option key={s.id} value={s.slug}>
                  {s.name} — {s.city}
                </option>
              ))}
            </select>

            <div className="flex gap-1">
              {FORMATS.map(f => (
                <FilterButton
                  key={f}
                  active={fmtFilter === f}
                  onClick={() => setFmtFilter(f)}
                  className="rounded-[7px]"
                >
                  {f}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events grid */}
      <div className="max-w-[920px] mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            message="No upcoming events match your filter."
            cta={
              <Link to="/stores" className="text-[13px] text-gold hover:underline">
                Browse all stores →
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(ev => (
              <EventGridCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="max-w-[680px] mx-auto px-6 pb-12">
        <div className="text-[11px] text-ink-4 uppercase tracking-[.1em] mb-4">FAQ</div>
        <FaqAccordion items={FAQ} />
      </div>
    </div>
  )
}
