import { Link } from '@tanstack/react-router'
import { useEventsWithStore } from '@ttg/hooks'
import { Badge, EventCard, Spinner } from '@ttg/ui'
import { formatDate, gameLabel, formatLabel } from '@ttg/utils'

const GAMES = [
  { label: 'Magic: The Gathering', icon: '◆' },
  { label: 'Pokémon', icon: '◉' },
  { label: 'One Piece', icon: '☠' },
  { label: 'Lorcana', icon: '✦' },
  { label: 'Yu-Gi-Oh!', icon: '△' },
  { label: 'Flesh and Blood', icon: '⚔' },
]

const FEATURES = [
  { icon: '🗓', title: 'Browse Events', body: 'Discover sealed, draft, 2HG, prerelease, and championship events from local game stores near you.' },
  { icon: '🎫', title: 'Register Online', body: 'Secure your seat with instant registration. Get added to the waitlist automatically when an event fills up.' },
  { icon: '🤝', title: '2HG Support', body: 'Register solo to be matched with a partner, or invite a teammate directly to join as a team.' },
  { icon: '📊', title: 'Live Capacity', body: 'See real-time fill percentages and waitlist counts before you decide to register.' },
]

function formatVariant(format: string): 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral' {
  if (format === 'sealed') return 'sealed'
  if (format === '2hg') return '2hg'
  if (format === 'prerelease') return 'prerelease'
  if (format === 'launch') return 'launch'
  return 'neutral'
}

export function LandingPage() {
  const { data: events, isLoading } = useEventsWithStore({ status: 'upcoming' })
  const featured = events?.slice(0, 4) ?? []

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-surface-1 border-b border-line py-16 px-5">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 text-[11px] font-medium px-3 py-1 rounded-full mb-5">
            <span>◆</span> Multi-game event platform
          </div>
          <h1 className="text-[38px] font-bold text-ink leading-tight mb-4">
            Find TCG Events<br />
            <span className="text-gold">Near You</span>
          </h1>
          <p className="text-[15px] text-ink-3 max-w-[480px] mx-auto mb-8">
            Browse sealed, draft, 2HG and prerelease events at local game stores.
            Register online, join waitlists, and track your history — all in one place.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/stores"
              className="bg-gold text-surface font-semibold text-[14px] px-5 py-2.5 rounded-[8px] hover:bg-gold/90 transition-colors"
            >
              Browse Stores
            </Link>
            <Link
              to="/apply"
              className="bg-surface-3 text-ink border border-line text-[14px] px-5 py-2.5 rounded-[8px] hover:bg-surface-4 transition-colors"
            >
              List Your Store
            </Link>
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="border-b border-line py-8 px-5 bg-surface">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {GAMES.map(g => (
              <div key={g.label} className="flex items-center gap-2 text-[12px] text-ink-3 bg-surface-2 border border-line rounded-[6px] px-3 py-1.5">
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 px-5">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-ink">Upcoming Events</h2>
            <Link to="/stores" className="text-[13px] text-gold hover:text-gold/80 transition-colors">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featured.map(ev => {
                const pct = Math.min(100, Math.round((ev.capacity - 4) / ev.capacity * 100))
                return (
                  <Link key={ev.id} to="/events/$eventId" params={{ eventId: ev.id }}>
                    <EventCard>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-[13px] font-medium text-ink mb-0.5">{ev.name}</p>
                          <p className="text-[11px] text-ink-3">{ev.store.name} · {ev.store.city}</p>
                        </div>
                        <Badge variant={formatVariant(ev.format)}>{formatLabel(ev.format)}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-ink-3">
                        <span>{formatDate(ev.date)} · {ev.time}</span>
                        <span className="text-ink-4">{gameLabel(ev.game)}</span>
                      </div>
                      <div className="mt-2.5 h-[3px] bg-surface-4 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--orange)' : 'var(--gold)' }}
                        />
                      </div>
                    </EventCard>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line py-12 px-5 bg-surface-1">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[20px] font-semibold text-ink mb-2 text-center">Everything you need</h2>
          <p className="text-[13px] text-ink-3 text-center mb-8">Built for players, designed for stores.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-surface-2 border border-line rounded-[10px] p-5">
                <div className="text-[24px] mb-3">{f.icon}</div>
                <h3 className="text-[14px] font-semibold text-ink mb-1.5">{f.title}</h3>
                <p className="text-[12px] text-ink-3 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line py-14 px-5 text-center">
        <div className="max-w-[480px] mx-auto">
          <h2 className="text-[22px] font-semibold text-ink mb-3">Run a local game store?</h2>
          <p className="text-[13px] text-ink-3 mb-6">
            Join the TTG Events network. Manage events, track registrations, send announcements,
            and grow your player base — starting free.
          </p>
          <Link
            to="/pricing"
            className="inline-block bg-surface-3 border border-line text-ink text-[14px] font-medium px-5 py-2.5 rounded-[8px] hover:bg-surface-4 transition-colors mr-3"
          >
            View Pricing
          </Link>
          <Link
            to="/apply"
            className="inline-block bg-gold text-surface font-semibold text-[14px] px-5 py-2.5 rounded-[8px] hover:bg-gold/90 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  )
}
