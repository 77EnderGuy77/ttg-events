import * as React from 'react'
import { cn } from '../lib/utils'

interface SidebarNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  active?: boolean
  locked?: boolean
  badge?: number
}

function SidebarNavItem({
  icon,
  label,
  active = false,
  locked = false,
  badge,
  className,
  ...props
}: SidebarNavItemProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-2 px-4 py-[7px] text-[12px] transition-colors border-r-2',
        active
          ? 'text-gold bg-gold/[0.04] border-r-gold'
          : locked
            ? 'text-ink-5 cursor-not-allowed border-r-transparent'
            : 'text-ink-3 hover:text-ink hover:bg-surface-3 border-r-transparent',
        className,
      )}
      disabled={locked}
      {...props}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-red text-white rounded-full px-[5px] text-[10px] font-medium leading-[15px] min-w-[15px] text-center">
          {badge}
        </span>
      )}
      {locked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      )}
    </button>
  )
}

export { SidebarNavItem }
