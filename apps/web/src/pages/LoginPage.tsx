import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore, DEMO_ACCOUNTS } from '@ttg/auth'
import { Button, Field, FieldLabel, Input } from '@ttg/ui'
import { Panel, SectionLabel } from '../components'

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
    if (ok) {
      navigate({ to: '/dashboard' })
    } else {
      setError('No account found with that email. Try a demo account below.')
    }
  }

  function handleDemoLogin(demoEmail: string) {
    login(demoEmail, 'demo')
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="page-enter max-w-[420px] mx-auto px-5 py-12">
      <div className="text-center mb-7">
        <span className="text-[32px] text-gold">◆</span>
        <h1 className="text-[22px] font-semibold text-ink mt-2 mb-1">Sign in to TTG Events</h1>
        <p className="text-[13px] text-ink-3">Find and register for events near you</p>
      </div>

      <Panel className="p-6 mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Any password (demo)"
              required
            />
          </Field>
          {error && <p className="text-[12px] text-red">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </Panel>

      <Panel className="p-4">
        <SectionLabel className="mb-3">Demo accounts</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {DEMO_ACCOUNTS.map(a => (
            <button
              key={a.email}
              onClick={() => handleDemoLogin(a.email)}
              className="flex items-center justify-between px-3 py-2 rounded-[6px] bg-surface-3 hover:bg-surface-4 transition-colors text-left"
            >
              <div>
                <p className="text-[12px] font-medium text-ink">{a.name}</p>
                <p className="text-[11px] text-ink-4">{a.email}</p>
              </div>
              <span className="text-[10px] text-ink-4 bg-surface-4 border border-line rounded-[4px] px-2 py-0.5 capitalize">
                {a.role}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-4 mt-3">Any password works for demo accounts.</p>
      </Panel>

      <p className="text-center text-[12px] text-ink-4 mt-5">
        New store?{' '}
        <Link to="/apply" className="text-gold hover:underline">Apply to list your store →</Link>
      </p>
    </div>
  )
}
