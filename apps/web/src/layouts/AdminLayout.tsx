import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useCurrentUser, useAuthStore } from '@ttg/auth'
import { SUBSCRIPTIONS } from '@ttg/mock-data'
import { SidebarNavItem } from '@ttg/ui'
import { getInitials } from '@ttg/utils'
import { useEffect } from 'react'

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d={d} />
    </svg>
  )
}

const NAV_ITEMS = [
  { key: 'dashboard',      to: '/admin',                label: 'Dashboard',      superOnly: false, icon: 'M4 5h16v4H4zm0 6h7v9H4zm9 0h7v4h-7zm0 6h7v3h-7' },
  { key: 'events',         to: '/admin/events',         label: 'Events',         superOnly: false, icon: 'M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' },
  { key: 'stores',         to: '/admin/stores',         label: 'Stores',         superOnly: true,  icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { key: 'store-requests', to: '/admin/store-requests', label: 'Store Requests', superOnly: true,  icon: 'M4 4h16v2H4zM4 9h16v2H4zM4 14h10v2H4z' },
  { key: 'subscriptions',  to: '/admin/subscriptions',  label: 'Subscriptions',  superOnly: true,  icon: 'M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 13a2 2 0 110-4 2 2 0 010 4z' },
  { key: 'notifications',  to: '/admin/notifications',  label: 'Notifications',  superOnly: true,  icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { key: 'audit-log',      to: '/admin/audit-log',      label: 'Audit Log',      superOnly: true,  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'settings',       to: '/admin/settings',       label: 'Settings',       superOnly: true,  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0' },
]

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard', '/admin/events': 'Events', '/admin/stores': 'Stores',
  '/admin/store-requests': 'Store Requests', '/admin/subscriptions': 'Subscriptions',
  '/admin/notifications': 'Notifications', '/admin/audit-log': 'Audit Log',
  '/admin/settings': 'Settings', '/admin/revenue': 'Revenue', '/admin/subscription': 'Subscription',
}

function getTitle(pathname: string) {
  if (pathname.startsWith('/admin/events/')) return 'Events'
  return PAGE_TITLES[pathname] ?? 'Admin'
}

export function AdminLayout() {
  const user = useCurrentUser()
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const { location } = useRouterState()
  const isSuperAdmin = user?.role === 'ttg-admin'
  const pathname = location.pathname

  const storeTier = user?.storeId
    ? (SUBSCRIPTIONS.find(s => s.storeId === user.storeId)?.tier ?? 'free')
    : 'free'

  useEffect(() => {
    if (!user || (user.role !== 'store-admin' && user.role !== 'ttg-admin')) {
      navigate({ to: '/login' })
    }
  }, [user, navigate])

  if (!user || (user.role !== 'store-admin' && user.role !== 'ttg-admin')) return null

  const visible = NAV_ITEMS.filter(n => !n.superOnly || isSuperAdmin)
  const locked  = NAV_ITEMS.filter(n => n.superOnly && !isSuperAdmin)
  const title   = getTitle(pathname)
  const showNewEvent = pathname === '/admin' || pathname === '/admin/events' || pathname.startsWith('/admin/events/')
  const initials = getInitials(user.name)

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    if (item.to === '/admin') return pathname === '/admin'
    return pathname === item.to || pathname.startsWith(item.to + '/')
  }

  return (
    <div className="flex min-h-dvh bg-surface">
      <aside className="w-[220px] shrink-0 bg-surface-2 border-r border-line flex flex-col">
        <div className="px-4 py-[14px] border-b border-line">
          <div className="flex items-center gap-[7px] mb-[10px]">
            <div className="w-[26px] h-[26px] rounded-[5px] bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-[13px]">
              ♦
            </div>
            <span className="text-[12px] font-medium text-ink">TTG Admin</span>
          </div>
          {isSuperAdmin ? (
            <span className="inline-flex items-center text-[10px] px-[7px] py-[2px] rounded-[4px] font-medium bg-gold/10 text-gold border border-gold/20">
              Super Admin
            </span>
          ) : (
            <div className="flex items-center gap-[6px] flex-wrap">
              <span className="text-[10px] text-ink-3 bg-surface-3 border border-line rounded-[4px] px-[7px] py-[2px] truncate max-w-[120px]">
                {user.name}
              </span>
              <span className={`inline-flex items-center text-[10px] px-[7px] py-[2px] rounded-[4px] font-medium capitalize ${
                storeTier === 'pro'   ? 'bg-gold/10 text-gold border border-gold/20'
                : storeTier === 'basic' ? 'bg-purple/10 text-purple border border-purple/20'
                : 'bg-surface-3 text-ink-3 border border-line'
              }`}>
                {storeTier}
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-[6px]">
          {visible.map(item => (
            <SidebarNavItem
              key={item.key}
              icon={<NavIcon d={item.icon} />}
              label={item.label}
              active={isActive(item)}
              onClick={() => navigate({ to: item.to as '/' })}
            />
          ))}
          {locked.length > 0 && (
            <>
              <div className="h-px bg-line mx-4 my-[8px]" />
              {locked.map(item => (
                <SidebarNavItem
                  key={item.key}
                  icon={<NavIcon d={item.icon} />}
                  label={item.label}
                  locked
                />
              ))}
            </>
          )}
        </nav>

        <div className="px-4 py-[10px] border-t border-line">
          <Link to="/" className="block text-[11px] text-ink-4 hover:text-gold transition-colors mb-1">← Player site</Link>
          {isSuperAdmin && (
            <Link to="/internal" className="block text-[11px] text-ink-4 hover:text-purple transition-colors mb-2">◆ Internal</Link>
          )}
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-full bg-surface-3 border border-line flex items-center justify-center text-[10px] font-medium text-ink-3 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-ink truncate">{user.name}</p>
              <p className="text-[10px] text-ink-4">{isSuperAdmin ? 'super_admin' : 'admin'}</p>
            </div>
            <button
              title="Log out"
              onClick={() => { logout(); navigate({ to: '/login' }) }}
              className="text-ink-4 hover:text-ink transition-colors p-[3px] flex shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[48px] bg-surface-2 border-b border-line flex items-center justify-between px-5 shrink-0">
          <span className="text-[14px] font-medium text-ink">{title}</span>
          {showNewEvent && (
            <Link to="/admin/events/new">
              <button className="flex items-center gap-1 text-[11px] text-ink-3 border border-line rounded-[8px] px-[10px] py-[5px] bg-transparent hover:text-ink hover:border-ink-4 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New event
              </button>
            </Link>
          )}
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
