import React from 'react'

interface BreadcrumbProps {
  items: React.ReactNode[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-[12px] text-ink-4 mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {item}
        </React.Fragment>
      ))}
    </nav>
  )
}
