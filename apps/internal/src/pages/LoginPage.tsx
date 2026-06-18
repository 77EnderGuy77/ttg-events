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
    const ok = login(email, password)
    if (!ok) { setError('Account not found.'); return }
    navigate({ to: '/' })
  }

  const ttgAdmin = DEMO_ACCOUNTS.find(a => a.role === 'ttg-admin')!

  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center px-5">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-7">
          <span className="text-[28px] text-purple-light">◆</span>
          <h1 className="text-[20px] font-semibold text-ink mt-2 mb-1">TTG Internal</h1>
          <p className="text-[12px] text-ink-3">Restricted to TTG staff only</p>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-5 mb-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="internal@ttgevents.com" required autoFocus />
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
          <p className="text-[10px] text-ink-4 font-medium uppercase tracking-wider mb-2">Demo account</p>
          <button
            onClick={() => { login(ttgAdmin.email, 'demo'); navigate({ to: '/' }) }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] bg-surface-3 hover:bg-surface-4 transition-colors text-left"
          >
            <div>
              <p className="text-[12px] font-medium text-ink">{ttgAdmin.name}</p>
              <p className="text-[10px] text-ink-4">{ttgAdmin.email}</p>
            </div>
            <span className="text-[10px] text-amber bg-amber/10 border border-amber/20 rounded px-1.5 py-0.5">TTG ADMIN</span>
          </button>
        </div>
      </div>
    </div>
  )
}
