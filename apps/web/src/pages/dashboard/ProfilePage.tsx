import { useCurrentUser } from '@ttg/auth'
import { Avatar } from '@ttg/ui'
import { formatIsoDate, getInitials } from '@ttg/utils'
import { DetailField, PageHeader, Panel, SectionLabel } from '../../components'

export function ProfilePage() {
  const user = useCurrentUser()!

  const roleLabel =
    user.role === 'player' ? 'Player'
    : user.role === 'store-admin' ? 'Store Admin'
    : 'TTG Admin'

  const profileFields = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: roleLabel },
    { label: 'Member since', value: formatIsoDate(user.createdAt) },
  ]

  return (
    <div className="page-enter">
      <PageHeader title="Profile" subtitle="Your account details" />

      <Panel className="p-5 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <Avatar initials={getInitials(user.name)} size="md" />
          <div>
            <p className="text-[18px] font-semibold text-ink">{user.name}</p>
            <p className="text-[13px] text-ink-3">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {profileFields.map(f => (
            <DetailField key={f.label} label={f.label} value={f.value} className="bg-surface-3" />
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <SectionLabel className="mb-3">Demo mode</SectionLabel>
        <p className="text-[13px] text-ink-2 leading-relaxed">
          This is a demo account. In production, you'd be able to update your name, change your
          password, and manage notification preferences here.
        </p>
        <p className="text-[12px] text-ink-4 mt-2">
          Use the ⚡ Demo button in the corner to switch between demo accounts.
        </p>
      </Panel>
    </div>
  )
}
