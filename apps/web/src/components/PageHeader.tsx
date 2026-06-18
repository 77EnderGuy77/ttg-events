interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({ title, subtitle, className = 'mb-6' }: PageHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-[24px] font-semibold text-ink mb-1">{title}</h1>
      {subtitle && <p className="text-[13px] text-ink-3">{subtitle}</p>}
    </div>
  )
}
