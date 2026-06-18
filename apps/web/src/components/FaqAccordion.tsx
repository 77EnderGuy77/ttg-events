import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState(-1)

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.q} style={{ borderBottom: '0.5px solid var(--border)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between py-3 bg-transparent border-none text-[13px] text-ink cursor-pointer text-left"
          >
            <span>{item.q}</span>
            <span
              className="text-ink-4 text-[16px] shrink-0 ml-3"
              style={{
                transition: 'transform .2s',
                transform: open === i ? 'rotate(45deg)' : 'none',
              }}
            >
              +
            </span>
          </button>
          <div
            className="text-[12px] text-ink-3 leading-relaxed overflow-hidden"
            style={{
              maxHeight: open === i ? '200px' : '0',
              paddingBottom: open === i ? '12px' : '0',
              transition: 'max-height .2s, padding .2s',
            }}
          >
            {item.a}
          </div>
        </div>
      ))}
    </div>
  )
}
