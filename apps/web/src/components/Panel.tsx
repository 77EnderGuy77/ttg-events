interface PanelProps {
  children: React.ReactNode
  className?: string
}

export function Panel({ children, className = 'p-5' }: PanelProps) {
  return (
    <div className={`bg-surface-2 border border-line rounded-[10px] ${className}`}>
      {children}
    </div>
  )
}
