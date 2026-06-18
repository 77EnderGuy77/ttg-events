import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useCurrentUser, useAuthStore } from '@ttg/auth'
import { useStoreApplications } from '@ttg/hooks'
import { Avatar } from '@ttg/ui'
import { getInitials } from '@ttg/utils'
import { useEffect } from 'react'

const NAV = [
  { to: '/', label: 'Overview', icon: '◉' },
  { to: '/stores', label: 'Stores', icon: '🏪' },
  { to: '/applications', label: 'Applications', icon: '📋', badge: true },
  { to: '/events', label: 'Events', icon: '🗓' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/subscriptions', label: 'Subscriptions', icon: '💳' },
]

function SideLink({ to, label, icon, pendingCount }: { to: string; label: string; icon: string; pendingCount?: number }) {
  const { location } = useRouterState()
  const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-medium transition-colors ${
        active ? 'bg-purple/10 text-purple-light' : 'text-ink-3 hover:text-ink hover:bg-surface-3'
      }`}
    >
      <span className="text-[14px]">{icon}</span>
      <span className="flex-1">{label}</span>
      {pendingCount != null && pendingCount > 0 && (
        <span className="bg-amber/20 text-amber text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          {pendingCount}
        </span>
      )}
    </Link>
  )
}

export function InternalLayout() {
  const user = useCurrentUser()
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { data: applications } = useStoreApplications()
  const pendingCount = applications?.filter(a => a.status === 'pending').length ?? 0

  useEffect(() => {
    if (!user && location.pathname !== '/login') navigate({ to: '/login' })
    if (user && user.role !== 'ttg-admin') navigate({ to: '/login' })
  }, [user, location.pathname, navigate])

  if (!user || location.pathname === '/login') return <Outlet />

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-surface-1 border-r border-line flex flex-col">
        <div className="px-4 py-4 border-b border-line">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-purple-light font-bold text-[16px]">◆</span>
            <span className="text-[14px] font-semibold text-ink">TTG Internal</span>
          </div>
          <p className="text-[10px] text-amber bg-amber/10 border border-amber/20 rounded px-1.5 py-0.5 inline-block mt-1">
            SUPER ADMIN
          </p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {NAV.map(item => (
            <SideLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              pendingCount={item.badge ? pendingCount : undefined}
            />
          ))}
        </nav>

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

      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
