import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useCurrentUser, useAuthStore } from '@ttg/auth'
import { useStoreApplications } from '@ttg/hooks'
import { Avatar } from '@ttg/ui'
import { getInitials } from '@ttg/utils'
import { useEffect } from 'react'

const NAV = [
  { to: '/internal',               label: 'Overview',      icon: '◉' },
  { to: '/internal/stores',        label: 'Stores',        icon: '🏪' },
  { to: '/internal/applications',  label: 'Applications',  icon: '📋', badge: true },
  { to: '/internal/events',        label: 'Events',        icon: '🗓' },
  { to: '/internal/users',         label: 'Users',         icon: '👥' },
  { to: '/internal/subscriptions', label: 'Subscriptions', icon: '💳' },
]

function SideLink({ to, label, icon, pendingCount }: { to: string; label: string; icon: string; pendingCount?: number }) {
  const { location } = useRouterState()
  const active = to === '/internal' ? location.pathname === '/internal' : location.pathname.startsWith(to)
  return (
    <Link
      to={to as '/'}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-medium transition-colors ${
        active ? 'bg-purple/10 text-purple' : 'text-ink-3 hover:text-ink hover:bg-surface-3'
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
  const { data: applications } = useStoreApplications()
  const pendingCount = applications?.filter(a => a.status === 'pending').length ?? 0

  useEffect(() => {
    if (!user || user.role !== 'ttg-admin') navigate({ to: '/' })
  }, [user, navigate])

  if (!user || user.role !== 'ttg-admin') return null

  return (
    <div className="flex min-h-dvh bg-surface">
      <aside className="w-[220px] shrink-0 bg-surface-1 border-r border-line flex flex-col">
        <div className="px-4 py-4 border-b border-line">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-purple font-bold text-[16px]">◆</span>
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
            className="w-full text-left text-[11px] text-ink-4 hover:text-red transition-colors px-1 mb-1"
          >
            Sign out
          </button>
          <Link to="/" className="block text-[11px] text-ink-4 hover:text-gold transition-colors px-1 mb-1">
            ← Player site
          </Link>
          <Link to="/admin" className="block text-[11px] text-ink-4 hover:text-gold transition-colors px-1">
            ← Admin panel
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
