import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 text-[10px] px-[7px] py-[2px] rounded-[4px] font-medium tracking-[.01em] border',
  {
    variants: {
      variant: {
        sealed:     'bg-gold/10      text-gold         border-gold/20',
        '2hg':      'bg-purple/10   text-purple-light border-purple/20',
        prerelease: 'bg-green/10    text-green        border-green/20',
        launch:     'bg-amber/10    text-amber        border-amber/20',
        pro:        'bg-gold/10      text-gold         border-gold/20',
        free:       'bg-purple/10   text-purple-light border-purple/20',
        active:     'bg-green/10    text-green        border-green/20',
        pending:    'bg-amber/10    text-amber        border-amber/20',
        suspended:  'bg-red/10      text-red          border-red/20',
        waitlisted: 'bg-surface-4   text-ink-3        border-line',
        neutral:    'bg-surface-3   text-ink-3        border-line',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
