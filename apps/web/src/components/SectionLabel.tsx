interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className = 'mb-4' }: SectionLabelProps) {
  return (
    <p className={`text-[11px] font-semibold text-ink-3 uppercase tracking-wider ${className}`}>
      {children}
    </p>
  )
}
