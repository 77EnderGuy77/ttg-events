import { useState } from 'react'
import { useAuthStore, useCurrentUser, DEMO_ACCOUNTS } from '@ttg/auth'
import { useNavigate } from '@tanstack/react-router'

export function DemoSwitcher() {
  const [open, setOpen] = useState(false)
  const user = useCurrentUser()
  const { login, logout, switchAccount } = useAuthStore()
  const navigate = useNavigate()

  const accounts = [
    { email: DEMO_ACCOUNTS[0].email, label: 'Player', sub: 'alex@example.com' },
    { email: DEMO_ACCOUNTS[1].email, label: 'Store Admin', sub: 'owner@dragonslair.com' },
    { email: DEMO_ACCOUNTS[2].email, label: 'TTG Admin', sub: 'internal@ttgevents.com' },
  ]

  function handleSwitch(email: string) {
    if (user) {
      switchAccount(email)
    } else {
      login(email, 'demo')
    }
    setOpen(false)
    const account = DEMO_ACCOUNTS.find(a => a.email === email)
    if (account?.role === 'store-admin') {
      navigate({ to: '/dashboard' })
    } else if (account?.role === 'ttg-admin') {
      navigate({ to: '/dashboard' })
    } else {
      navigate({ to: '/dashboard' })
    }
  }

  function handleLogout() {
    logout()
    setOpen(false)
    navigate({ to: '/' })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 bg-surface-2 border border-line rounded-[10px] shadow-2xl p-3 w-[220px]">
          <p className="text-[10px] font-semibold text-ink-4 uppercase tracking-wider mb-2 px-1">
            Demo accounts
          </p>
          {accounts.map(a => {
            const active = user?.email === a.email
            return (
              <button
                key={a.email}
                onClick={() => handleSwitch(a.email)}
                className={`w-full text-left px-2 py-2 rounded-[6px] mb-0.5 transition-colors ${
                  active ? 'bg-gold/10 text-gold' : 'text-ink-2 hover:bg-surface-3 hover:text-ink'
                }`}
              >
                <span className="block text-[12px] font-medium">{a.label}</span>
                <span className="block text-[10px] text-ink-4">{a.sub}</span>
              </button>
            )
          })}
          {user && (
            <>
              <div className="border-t border-line my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-1.5 rounded-[6px] text-[12px] text-red hover:bg-surface-3 transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="bg-surface-3 border border-line text-ink-3 text-[11px] font-medium px-3 py-1.5 rounded-full hover:text-ink hover:border-line transition-colors shadow-lg"
      >
        {open ? '✕ Close' : '⚡ Demo'}
      </button>
    </div>
  )
}
