import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useCurrentUser, useAuthStore, useAdminStoreId } from '@ttg/auth'
import { useStoreById } from '@ttg/hooks'
import { Avatar } from '@ttg/ui'
import { getInitials } from '@ttg/utils'
import { useEffect } from 'react'

const NAV = [
  { to: '/', label: 'Events', icon: '🗓' },
  { to: '/revenue', label: 'Revenue', icon: '💰' },
  { to: '/subscription', label: 'Subscription', icon: '⭐' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

function SideLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const { location } = useRouterState()
  const active = to === '/'
    ? location.pathname === '/' || location.pathname.startsWith('/events')
    : location.pathname === to
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-medium transition-colors ${
        active ? 'bg-gold/10 text-gold' : 'text-ink-3 hover:text-ink hover:bg-surface-3'
      }`}
    >
      <span className="text-[14px]">{icon}</span>
      {label}
    </Link>
  )
}

export function AdminLayout() {
  const user = useCurrentUser()
  const logout = useAuthStore(s => s.logout)
  const storeId = useAdminStoreId()
  const { data: store } = useStoreById(storeId ?? '')
  const navigate = useNavigate()
  const { location } = useRouterState()

  useEffect(() => {
    if (!user && location.pathname !== '/login') navigate({ to: '/login' })
    if (user && user.role !== 'store-admin' && user.role !== 'ttg-admin') navigate({ to: '/login' })
  }, [user, location.pathname, navigate])

  if (!user || location.pathname === '/login') {
    return <Outlet />
  }

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-surface-1 border-r border-line flex flex-col">
        <div className="px-4 py-4 border-b border-line">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-gold font-bold text-[16px]">◆</span>
            <span className="text-[14px] font-semibold text-ink">TTG Admin</span>
          </div>
          {store && (
            <p className="text-[11px] text-ink-4 mt-1 truncate">{store.name}</p>
          )}
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {NAV.map(item => (
            <SideLink key={item.to} {...item} />
          ))}
        </nav>

        {/* User area */}
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar initials={getInitials(user.name)} size="sm" />
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-ink truncate">{user.name}</p>
              <p className="text-[10px] text-ink-4 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate({ to: '/login' }) }}
            className="w-full text-left text-[11px] text-ink-4 hover:text-red transition-colors px-1"
          >
            Sign out
          </button>
          <a href="http://localhost:3000" className="block text-[11px] text-ink-4 hover:text-gold transition-colors px-1 mt-1">
            ← Player site
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
