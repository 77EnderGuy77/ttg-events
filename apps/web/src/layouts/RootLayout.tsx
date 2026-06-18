import { Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useCurrentUser, useAuthStore } from '@ttg/auth'
import { Avatar } from '@ttg/ui'
import { getInitials } from '@ttg/utils'
import { DemoSwitcher } from '../components/DemoSwitcher'
import { useState } from 'react'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { location } = useRouterState()
  const active = location.pathname === to || location.pathname.startsWith(to + '/')
  return (
    <Link
      to={to}
      className={`text-[13px] font-medium transition-colors ${active ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}
    >
      {children}
    </Link>
  )
}

export function RootLayout() {
  const user = useCurrentUser()
  const logout = useAuthStore(s => s.logout)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header className="border-b border-line bg-surface-1 sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-5 h-[52px] flex items-center gap-6">
          <Link to="/" className="font-semibold text-[15px] text-ink flex items-center gap-2">
            <span className="text-gold">◆</span>
            <span>TTG Events</span>
          </Link>

          <nav className="flex items-center gap-5 ml-2">
            <NavLink to="/stores">Stores</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/apply">Apply</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="flex items-center gap-2 text-[13px] text-ink-2 hover:text-ink transition-colors"
                  >
                    <Avatar initials={getInitials(user.name)} size="sm" />
                    <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-44 bg-surface-2 border border-line rounded-[8px] shadow-xl z-50 py-1"
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                      <Link
                        to="/dashboard/profile"
                        className="block px-3 py-2 text-[13px] text-ink-2 hover:text-ink hover:bg-surface-3"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/history"
                        className="block px-3 py-2 text-[13px] text-ink-2 hover:text-ink hover:bg-surface-3"
                        onClick={() => setMenuOpen(false)}
                      >
                        History
                      </Link>
                      <div className="border-t border-line my-1" />
                      {user.role === 'store-admin' && (
                        <a
                          href="http://localhost:3001"
                          className="block px-3 py-2 text-[13px] text-ink-2 hover:text-ink hover:bg-surface-3"
                          onClick={() => setMenuOpen(false)}
                        >
                          Admin Panel ↗
                        </a>
                      )}
                      {user.role === 'ttg-admin' && (
                        <a
                          href="http://localhost:3002"
                          className="block px-3 py-2 text-[13px] text-ink-2 hover:text-ink hover:bg-surface-3"
                          onClick={() => setMenuOpen(false)}
                        >
                          Internal ↗
                        </a>
                      )}
                      <button
                        onClick={() => { logout(); setMenuOpen(false) }}
                        className="w-full text-left px-3 py-2 text-[13px] text-red hover:bg-surface-3"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-[13px] font-medium bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded-[6px] hover:bg-gold/20 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <DemoSwitcher />
    </div>
  )
}
