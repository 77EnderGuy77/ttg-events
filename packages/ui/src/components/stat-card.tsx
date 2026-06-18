import * as React from 'react'
import { cn } from '../lib/utils'

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  sub?: string
  gold?: boolean
}

function StatCard({ label, value, sub, gold = false, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn('bg-surface-2 border border-line rounded-[8px] px-[14px] py-[12px]', className)}
      {...props}
    >
      <div className="text-[10px] text-ink-3 uppercase tracking-[.08em] mb-[5px]">{label}</div>
      <div className={cn('text-[22px] font-medium tracking-[-0.01em]', gold ? 'text-gold' : 'text-ink')}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-ink-4 mt-[3px]">{sub}</div>}
    </div>
  )
}

export { StatCard }
