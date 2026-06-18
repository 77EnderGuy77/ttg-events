import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 font-medium transition-[filter,background,border-color,color] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-gold text-[#0f1117] rounded-[8px] hover:brightness-[1.08]',
        ghost:   'bg-transparent text-ink-3 border border-line rounded-[8px] hover:text-ink hover:border-ink-4',
        login:   'bg-transparent text-gold border border-gold/20 rounded-[6px] hover:bg-gold/10',
        danger:  'bg-transparent text-red border border-red/30 rounded-[8px] hover:bg-red/10',
        success: 'bg-transparent text-green border border-green/30 rounded-[8px] hover:bg-green/10',
      },
      size: {
        default: 'px-4 py-2 text-[12px]',
        sm:      'px-3 py-[5px] text-[11px]',
        xs:      'px-[7px] py-[2px] text-[10px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
