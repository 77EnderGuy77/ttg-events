interface DetailFieldProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function DetailField({ label, value, className }: DetailFieldProps) {
  return (
    <div className={`rounded-[8px] p-3 ${className ?? 'bg-surface-2 border border-line'}`}>
      <p className="text-[10px] text-ink-4 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[13px] font-medium text-ink">{value}</p>
    </div>
  )
}
