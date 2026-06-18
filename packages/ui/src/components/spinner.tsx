import * as React from 'react'
import { cn } from '../lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
}

function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  const dim = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-[18px] h-[18px]'
  return (
    <span
      className={cn(
        dim,
        'rounded-full border-2 border-surface-4 border-t-gold inline-block',
        '[animation:spin_.6s_linear_infinite]',
        className,
      )}
      {...props}
    />
  )
}

export { Spinner }
