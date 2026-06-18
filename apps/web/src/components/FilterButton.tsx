interface FilterButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export function FilterButton({ active, onClick, children, className }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'text-[12px] px-3 py-1.5 rounded-[6px] border transition-colors',
        active
          ? 'bg-gold/10 text-gold border-gold/30'
          : 'bg-surface-2 text-ink-3 border-line hover:text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
