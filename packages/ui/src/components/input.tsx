import * as React from 'react'
import { cn } from '../lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink',
        'outline-none transition-colors placeholder:text-ink-4',
        'focus:border-gold',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink cursor-pointer',
        'outline-none transition-colors',
        'focus:border-gold',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
)
Select.displayName = 'Select'

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-[11px] text-ink-3 mb-[5px]', className)}
      {...props}
    />
  ),
)
FieldLabel.displayName = 'FieldLabel'

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {}

function Field({ className, ...props }: FieldProps) {
  return <div className={cn('mb-[14px]', className)} {...props} />
}

export { Input, Select, FieldLabel, Field }
