import * as React from 'react'
import { cn } from '../lib/utils'

interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Highlights border gold — use when card is full/active */
  highlighted?: boolean
}

function EventCard({ highlighted = false, className, ...props }: EventCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-2 border rounded-[8px] py-3.5 px-4 cursor-pointer transition-colors',
        highlighted ? 'border-gold/40' : 'border-line hover:border-gold/40',
        className,
      )}
      {...props}
    />
  )
}

export { EventCard }
