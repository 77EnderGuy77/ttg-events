import { Link } from '@tanstack/react-router'

const LINKS = ['About', 'Stores', 'Privacy', 'Contact']

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-6 py-6" style={{ background: 'var(--bg1)' }}>
      <div className="max-w-[920px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <Link to="/" className="text-[13px] text-gold flex items-center gap-[6px] font-medium">
          ♦ TTG Events
        </Link>
        <div className="flex gap-[18px]">
          {LINKS.map(l => (
            <a key={l} href="#" className="text-[11px] text-ink-3 hover:text-ink transition-colors">
              {l}
            </a>
          ))}
        </div>
        <p className="text-[10px] text-ink-4">Independent · Not affiliated with Wizards of the Coast</p>
      </div>
    </footer>
  )
}
