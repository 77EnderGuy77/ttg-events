import { useState } from 'react'
import { useUsers } from '@ttg/hooks'
import { Badge, Spinner, Avatar } from '@ttg/ui'
import { getInitials, formatIsoDate } from '@ttg/utils'
import type { UserRole } from '@ttg/types'

function roleVariant(r: UserRole): 'active' | 'pro' | 'neutral' {
  return r === 'ttg-admin' ? 'pro' : r === 'store-admin' ? 'active' : 'neutral'
}

export function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [search, setSearch] = useState('')

  const all = users ?? []
  const filtered = all.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const roleCount = (r: UserRole) => all.filter(u => u.role === r).length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Users</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">
          {all.length} total · {roleCount('player')} players · {roleCount('store-admin')} store admins · {roleCount('ttg-admin')} TTG admins
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface-2 border border-line text-ink text-[12px] px-3 py-1.5 rounded-[6px] outline-none focus:border-purple/50 w-52 placeholder:text-ink-4"
        />
        {(['all', 'player', 'store-admin', 'ttg-admin'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`text-[11px] px-3 py-1.5 rounded-[6px] border capitalize transition-colors ${
              roleFilter === r ? 'bg-purple/10 text-purple border-purple/30' : 'bg-surface-2 text-ink-3 border-line hover:text-ink'
            }`}
          >
            {r === 'all' ? 'All roles' : r.replace('-', ' ')}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-ink-4 mb-3">{filtered.length} users</p>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="bg-surface-2 border border-line rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-ink-4 uppercase tracking-wider">Member since</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-line hover:bg-surface-3 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={getInitials(u.name)} size="sm" />
                      <p className="text-[12px] font-medium text-ink">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-3">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={roleVariant(u.role)}>
                      {u.role === 'ttg-admin' ? 'TTG Admin' : u.role === 'store-admin' ? 'Store Admin' : 'Player'}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-4">{formatIsoDate(u.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-[13px] text-ink-4">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
