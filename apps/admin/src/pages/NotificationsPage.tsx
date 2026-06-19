import { useState } from 'react'

type Notification = {
  id: string
  title: string
  body: string
  type: 'request' | 'event' | 'account' | 'system'
  ago: string
  read: boolean
  href: string
}

const ALL_NOTIFS: Notification[] = [
  { id: 'n1', title: 'New store request: Goblin Games', body: 'Submitted by Jan Dvořák — Praha, CZ', type: 'request', ago: '12m ago', read: false, href: '/store-requests' },
  { id: 'n2', title: 'New store request: The Mana Den', body: 'Submitted by Lucie Nováková — Brno, CZ', type: 'request', ago: '1h ago', read: false, href: '/store-requests' },
  { id: 'n3', title: 'Registration spike: Aetherdrift Sealed', body: '23 registrations in the last hour at Dragon\'s Lair', type: 'event', ago: '2h ago', read: false, href: '/events' },
  { id: 'n4', title: 'New admin account created', body: 'admin@mythicgames.cz joined Mythic Games', type: 'account', ago: '3h ago', read: true, href: '/stores' },
  { id: 'n5', title: 'Event nearing capacity', body: 'Bloomburrow Launch Party — 14/16 registered', type: 'event', ago: '5h ago', read: true, href: '/events' },
  { id: 'n6', title: 'Subscription renewed', body: 'Dragon\'s Lair Pro plan renewed — €24.00', type: 'system', ago: '1d ago', read: true, href: '/subscriptions' },
  { id: 'n7', title: 'Store request approved: Tabletop Arena', body: 'Wien, AT — approved by TTG Admin', type: 'request', ago: '2d ago', read: true, href: '/store-requests' },
  { id: 'n8', title: 'New event created', body: 'Mana Vault created "FNM Sealed — July"', type: 'event', ago: '3d ago', read: true, href: '/events' },
]


export function NotificationsPage() {
  const [notifs, setNotifs] = useState(ALL_NOTIFS)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const unreadCount = notifs.filter(n => !n.read).length
  const filtered = typeFilter === 'all' ? notifs : notifs.filter(n => n.type === typeFilter)

  function markAllRead() {
    setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="p-5 page-enter">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1">
          {(['all', 'request', 'event', 'account', 'system'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={[
                'text-[11px] px-[10px] py-[5px] rounded-[6px] border transition-colors capitalize',
                typeFilter === t
                  ? 'bg-gold/10 border-gold/30 text-gold'
                  : 'bg-transparent border-line text-ink-3 hover:border-ink-4',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] text-gold border border-gold/20 rounded-[6px] px-[10px] py-[5px] bg-transparent cursor-pointer hover:bg-gold/5 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-surface-2 border border-line rounded-[8px] divide-y divide-line-soft">
        {filtered.map(n => (
          <div
            key={n.id}
            className={`flex gap-[10px] items-start px-[14px] py-3 cursor-pointer transition-colors ${!n.read ? 'bg-surface-3 hover:bg-surface-4' : 'hover:bg-surface-3'}`}
            onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
          >
            <div
              className="w-[6px] h-[6px] rounded-full shrink-0 mt-[5px]"
              style={{ background: n.read ? 'transparent' : 'var(--gold)' }}
            />
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-medium mb-[2px] ${n.read ? 'text-ink-2' : 'text-ink'}`}>{n.title}</div>
              <div className="text-[11px] text-ink-3">{n.body}</div>
            </div>
            <div className="text-[10px] text-ink-4 shrink-0">{n.ago}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-[14px] py-8 text-center text-[13px] text-ink-4">
            No notifications.
          </div>
        )}
      </div>
    </div>
  )
}
