interface EmptyStateProps {
  message: string
  cta?: React.ReactNode
}

export function EmptyState({ message, cta }: EmptyStateProps) {
  return (
    <div className="bg-surface-2 border border-line rounded-[10px] p-8 text-center">
      <p className="text-[13px] text-ink-3 mb-3">{message}</p>
      {cta}
    </div>
  )
}
