import { useState } from 'react'
import { Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useCurrentUser, useAuthStore } from '@ttg/auth'
import { Avatar } from '@ttg/ui'
import { getInitials } from '@ttg/utils'
import { DemoSwitcher, SiteFooter } from '../components'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { location } = useRouterState()
  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to + '/'))
  return (
    <Link
      to={to}
      className={`text-[12px] px-[10px] py-[5px] rounded-[6px] transition-colors ${
        active ? 'text-gold' : 'text-ink-3 hover:text-ink hover:bg-surface-3'
      }`}
    >
      {children}
    </Link>
  )
}

function UserMenu({ onClose }: { onClose: () => void }) {
  const user = useCurrentUser()!
  const logout = useAuthStore(s => s.logout)

  return (
    <div
      className="absolute right-0 top-full mt-2 w-44 bg-surface-2 border border-line rounded-[8px] shadow-xl z-50 py-1"
      onMouseLeave={onClose}
    >
      <Link
        to="/dashboard/profile"
        className="block px-3 py-2 text-[12px] text-ink-2 hover:text-ink hover:bg-surface-3"
        onClick={onClose}
      >
        Profile
      </Link>
      <Link
        to="/dashboard/history"
        className="block px-3 py-2 text-[12px] text-ink-2 hover:text-ink hover:bg-surface-3"
        onClick={onClose}
      >
        History
      </Link>
      <div className="border-t border-line my-1" />
      {user.role === 'store-admin' && (
        <a
          href="http://localhost:3001"
          className="block px-3 py-2 text-[12px] text-ink-2 hover:text-ink hover:bg-surface-3"
          onClick={onClose}
        >
          Admin Panel ↗
        </a>
      )}
      {user.role === 'ttg-admin' && (
        <a
          href="http://localhost:3002"
          className="block px-3 py-2 text-[12px] text-ink-2 hover:text-ink hover:bg-surface-3"
          onClick={onClose}
        >
          Internal ↗
        </a>
      )}
      <button
        onClick={() => { logout(); onClose() }}
        className="w-full text-left px-3 py-2 text-[12px] text-red hover:bg-surface-3"
      >
        Sign out
      </button>
    </div>
  )
}

export function RootLayout() {
  const user = useCurrentUser()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header
        className="border-b border-line sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(19,19,31,0.92)' }}
      >
        <div className="max-w-[1100px] mx-auto px-5 h-[52px] flex items-center gap-2">
          <Link to="/" className="font-medium text-[14px] text-gold flex items-center gap-[7px] mr-2">
            <span>♦</span>
            <span>TTG Events</span>
          </Link>

          <nav className="flex items-center gap-[2px]">
            <NavLink to="/">Events</NavLink>
            <NavLink to="/stores">Stores</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="flex items-center gap-2 text-[12px] text-ink-2 hover:text-ink transition-colors"
                  >
                    <Avatar initials={getInitials(user.name)} size="sm" />
                    <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                  </button>
                  {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[12px] text-gold border border-gold/30 px-[12px] py-[5px] rounded-[6px] hover:bg-gold/10 transition-colors"
                >
                  Admin
                </Link>
                <Link
                  to="/login"
                  className="text-[12px] font-medium bg-gold text-surface px-[16px] py-[8px] rounded-[8px] hover:brightness-110 transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
      <DemoSwitcher />
    </div>
  )
}
