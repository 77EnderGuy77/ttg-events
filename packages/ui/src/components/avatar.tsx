import * as React from 'react'
import { cn } from '../lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string
  size?: 'sm' | 'md'
}

function Avatar({ initials, size = 'sm', className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-surface-3 border border-line flex items-center justify-center text-ink-3 font-medium flex-shrink-0',
        size === 'sm' ? 'w-[26px] h-[26px] text-[10px]' : 'w-8 h-8 text-[11px]',
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  )
}

export { Avatar }
