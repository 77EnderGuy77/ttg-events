import { useEffect } from 'react'
import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useCurrentUser } from '@ttg/auth'

function DashLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { location } = useRouterState()
  const active = location.pathname === to
  return (
    <Link
      to={to}
      className={`block px-3 py-2 text-[13px] rounded-[6px] transition-colors ${
        active ? 'bg-gold/10 text-gold font-medium' : 'text-ink-3 hover:text-ink hover:bg-surface-3'
      }`}
    >
      {children}
    </Link>
  )
}

export function DashboardLayout() {
  const user = useCurrentUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate({ to: '/login' })
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 flex gap-8">
      <aside className="w-44 shrink-0">
        <p className="text-[11px] font-medium text-ink-4 uppercase tracking-wider mb-3 px-3">Player</p>
        <nav className="flex flex-col gap-0.5">
          <DashLink to="/dashboard">My Events</DashLink>
          <DashLink to="/dashboard/history">History</DashLink>
          <DashLink to="/dashboard/profile">Profile</DashLink>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
