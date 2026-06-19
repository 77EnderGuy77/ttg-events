import { useState } from 'react'

type LogEntry = {
  id: string
  action: string
  actor: string
  target: string
  ip: string
  at: string
  severity: 'info' | 'warn' | 'crit'
}

const LOGS: LogEntry[] = [
  { id: 'l1',  action: 'store.approved',        actor: 'TTG Admin',               target: 'Tabletop Arena (app-003)',   ip: '192.168.1.1',  at: '2026-06-03T11:30:00Z', severity: 'info' },
  { id: 'l2',  action: 'event.created',          actor: 'admin@mythicgames.cz',    target: 'FNM Sealed — July',          ip: '10.0.0.44',    at: '2026-06-15T14:10:00Z', severity: 'info' },
  { id: 'l3',  action: 'user.created',           actor: 'TTG Admin',               target: 'admin@mythicgames.cz',       ip: '192.168.1.1',  at: '2026-06-15T09:00:00Z', severity: 'info' },
  { id: 'l4',  action: 'subscription.renewed',   actor: 'system',                  target: 'Dragon\'s Lair sub-001',     ip: '—',            at: '2026-06-14T00:00:00Z', severity: 'info' },
  { id: 'l5',  action: 'event.deleted',          actor: 'admin@dragonslair.cz',    target: 'Test Event (evt-099)',       ip: '10.0.0.12',    at: '2026-06-12T16:44:00Z', severity: 'warn' },
  { id: 'l6',  action: 'store.suspended',        actor: 'TTG Admin',               target: 'Old Store (str-099)',        ip: '192.168.1.1',  at: '2026-06-10T10:00:00Z', severity: 'crit' },
  { id: 'l7',  action: 'event.capacity_changed', actor: 'admin@manavault.cz',      target: 'Aetherdrift Sealed — 8→16', ip: '10.0.0.77',    at: '2026-06-09T11:25:00Z', severity: 'warn' },
  { id: 'l8',  action: 'user.login',             actor: 'admin@shieldsword.cz',    target: '—',                          ip: '80.14.22.99',  at: '2026-06-08T08:01:00Z', severity: 'info' },
  { id: 'l9',  action: 'event.created',          actor: 'admin@dragonslair.cz',    target: 'Bloomburrow Launch Party',   ip: '10.0.0.12',    at: '2026-06-07T09:15:00Z', severity: 'info' },
  { id: 'l10', action: 'registration.cancelled', actor: 'player@example.com',      target: 'Bloomburrow Launch Party',   ip: '86.44.11.22',  at: '2026-06-06T17:33:00Z', severity: 'info' },
]

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
}

const SEV_CLS: Record<string, string> = {
  info: 'text-ink-3 bg-surface-3 border-line',
  warn: 'text-amber bg-amber/10 border-amber/20',
  crit: 'text-red bg-red/10 border-red/20',
}

export function AuditLogPage() {
  const [sev, setSev] = useState<'all' | 'info' | 'warn' | 'crit'>('all')
  const rows = sev === 'all' ? LOGS : LOGS.filter(l => l.severity === sev)

  return (
    <div className="p-5 page-enter">
      <div className="flex gap-1 mb-4">
        {(['all', 'info', 'warn', 'crit'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSev(s)}
            className={[
              'text-[11px] px-[10px] py-[5px] rounded-[6px] border transition-colors uppercase tracking-[.05em]',
              sev === s
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-transparent border-line text-ink-3 hover:border-ink-4',
            ].join(' ')}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-surface-2 border border-line rounded-[8px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Action', 'Actor', 'Target', 'IP', 'Severity', 'Time'].map(h => (
                <th key={h} className="text-[10px] text-ink-4 uppercase tracking-[.08em] px-[14px] py-[9px] text-left font-normal border-b border-line">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-surface-3 transition-colors">
                <td className="px-[14px] py-[8px] border-b border-line-soft">
                  <code className="text-[11px] text-ink-2 font-mono">{row.action}</code>
                </td>
                <td className="px-[14px] py-[8px] border-b border-line-soft text-[11px] text-ink-3 max-w-[140px] truncate">
                  {row.actor}
                </td>
                <td className="px-[14px] py-[8px] border-b border-line-soft text-[11px] text-ink-3 max-w-[160px] truncate">
                  {row.target}
                </td>
                <td className="px-[14px] py-[8px] border-b border-line-soft">
                  <code className="text-[10px] text-ink-4 font-mono">{row.ip}</code>
                </td>
                <td className="px-[14px] py-[8px] border-b border-line-soft">
                  <span className={`text-[10px] font-medium border rounded-[4px] px-[7px] py-[2px] uppercase ${SEV_CLS[row.severity]}`}>
                    {row.severity}
                  </span>
                </td>
                <td className="px-[14px] py-[8px] border-b border-line-soft text-[11px] text-ink-3">
                  {formatTime(row.at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
