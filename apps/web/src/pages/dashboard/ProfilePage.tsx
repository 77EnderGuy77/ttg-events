import { useCurrentUser } from '@ttg/auth'
import { Avatar } from '@ttg/ui'
import { formatIsoDate, getInitials } from '@ttg/utils'

export function ProfilePage() {
  const user = useCurrentUser()!

  const roleLabel = user.role === 'player' ? 'Player'
    : user.role === 'store-admin' ? 'Store Admin'
    : 'TTG Admin'

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink">Profile</h1>
        <p className="text-[13px] text-ink-3">Your account details</p>
      </div>

      <div className="bg-surface-2 border border-line rounded-[10px] p-5 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <Avatar initials={getInitials(user.name)} size="md" />
          <div>
            <p className="text-[18px] font-semibold text-ink">{user.name}</p>
            <p className="text-[13px] text-ink-3">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Name', value: user.name },
            { label: 'Email', value: user.email },
            { label: 'Role', value: roleLabel },
            { label: 'Member since', value: formatIsoDate(user.createdAt) },
          ].map(item => (
            <div key={item.label} className="bg-surface-3 rounded-[7px] p-3">
              <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="text-[13px] text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-2 border border-line rounded-[10px] p-5">
        <p className="text-[12px] font-semibold text-ink-3 uppercase tracking-wider mb-3">Demo mode</p>
        <p className="text-[13px] text-ink-2 leading-relaxed">
          This is a demo account. In production, you'd be able to update your name, change your
          password, and manage notification preferences here.
        </p>
        <p className="text-[12px] text-ink-4 mt-2">
          Use the ⚡ Demo button in the corner to switch between demo accounts.
        </p>
      </div>
    </div>
  )
}
