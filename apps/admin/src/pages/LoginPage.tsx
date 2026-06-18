import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore, DEMO_ACCOUNTS } from '@ttg/auth'
import { Button, Field, FieldLabel, Input } from '@ttg/ui'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const ok = login(email, password)
    if (!ok) { setError('Account not found.'); return }
    navigate({ to: '/' })
  }

  function handleDemo(demoEmail: string) {
    login(demoEmail, 'demo')
    navigate({ to: '/' })
  }

  const adminAccounts = DEMO_ACCOUNTS.filter(a => a.role === 'store-admin' || a.role === 'ttg-admin')

  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center px-5">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-7">
          <span className="text-[28px] text-gold">◆</span>
          <h1 className="text-[20px] font-semibold text-ink mt-2 mb-1">Store Admin</h1>
          <p className="text-[12px] text-ink-3">Manage your events and players</p>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-5 mb-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="owner@yourstore.com" required autoFocus />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Any password (demo)" required />
            </Field>
            {error && <p className="text-[12px] text-red">{error}</p>}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-4">
          <p className="text-[10px] text-ink-4 font-medium uppercase tracking-wider mb-2">Demo accounts</p>
          {adminAccounts.map(a => (
            <button
              key={a.email}
              onClick={() => handleDemo(a.email)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] bg-surface-3 hover:bg-surface-4 transition-colors text-left mb-1.5"
            >
              <div>
                <p className="text-[12px] font-medium text-ink">{a.name}</p>
                <p className="text-[10px] text-ink-4">{a.email}</p>
              </div>
              <span className="text-[10px] text-ink-4 bg-surface-4 border border-line rounded px-1.5 py-0.5 capitalize">{a.role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
