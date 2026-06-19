// ─── Date / time ─────────────────────────────────────────────────────────────

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const TIME_FMT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** "2026-06-28" → "28 Jun 2026" */
export function formatDate(dateStr: string): string {
  return DATE_FMT.format(new Date(dateStr + 'T00:00:00'))
}

/** "10:00" → "10:00" (passthrough; kept for consistency) */
export function formatTime(timeStr: string): string {
  return timeStr
}

/** "2026-06-28" + "10:00" → "28 Jun 2026 · 10:00" */
export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDate(dateStr)} · ${timeStr}`
}

/** ISO timestamp → "28 Jun 2026" */
export function formatIsoDate(iso: string): string {
  return DATE_FMT.format(new Date(iso))
}

/** Returns true if the event date is strictly in the past */
export function isEventPast(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr + 'T00:00:00') < today
}

// ─── Numbers / capacity ──────────────────────────────────────────────────────

/** 0-100 fill percentage */
export function calcFillPct(registered: number, capacity: number): number {
  if (capacity === 0) return 0
  return Math.round((registered / capacity) * 100)
}

export function isEventFull(confirmed: number, capacity: number): boolean {
  return confirmed >= capacity
}

/** Entry fee × confirmed count */
export function estimateRevenue(confirmed: number, entryFee: number): number {
  return confirmed * entryFee
}

// ─── Currency ────────────────────────────────────────────────────────────────

/** 280, "CZK" → "280 CZK" | 2400, "EUR" → "€24.00" */
export function formatCurrency(amountMinorOrFull: number, currency: string): string {
  if (currency === 'EUR') {
    const euros = amountMinorOrFull / 100
    return new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }).format(euros)
  }
  return `${amountMinorOrFull} ${currency}`
}

// ─── Strings ─────────────────────────────────────────────────────────────────

/** "Alex Johnson" → "AJ" */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** "dragons-lair" → "Dragon's Lair" (fallback from slug) */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Relative time: "2 min ago", "3h ago", "2d ago" */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ─── Registration labels ─────────────────────────────────────────────────────

import type { RegistrationStatus, RegistrationType } from '@ttg/types'

export function registrationStatusLabel(status: RegistrationStatus): string {
  const map: Record<RegistrationStatus, string> = {
    registered:  'Registered',
    waitlisted:  'Waitlisted',
    'checked-in': 'Checked In',
    attended:    'Attended',
    cancelled:   'Cancelled',
  }
  return map[status]
}

export function registrationTypeLabel(type: RegistrationType, teammateName?: string): string {
  if (type === '1v1') return '1v1'
  if (type === '2v2-solo') return '2HG — Looking for Partner'
  if (teammateName) return `2HG — Team (with ${teammateName})`
  return '2HG — Team'
}

// ─── Game labels ─────────────────────────────────────────────────────────────

import type { GameType, EventFormat, EventType } from '@ttg/types'

export function gameLabel(game: GameType): string {
  const map: Record<GameType, string> = {
    mtg:        'Magic: The Gathering',
    pokemon:    'Pokémon',
    'one-piece': 'One Piece',
    lorcana:    'Lorcana',
    yugioh:     'Yu-Gi-Oh!',
    fab:        'Flesh and Blood',
    other:      'Other',
  }
  return map[game]
}

export function formatLabel(format: EventFormat): string {
  const map: Record<EventFormat, string> = {
    sealed:     'Sealed',
    '2hg':      '2HG',
    draft:      'Draft',
    standard:   'Standard',
    commander:  'Commander',
    prerelease: 'Prerelease',
    other:      'Other',
  }
  return map[format]
}

type BadgeVariant = 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral'

/** Derives badge variant + label from event format + type, matching mock logic. */
export function getEventBadge(
  format: EventFormat,
  type: EventType,
): { variant: BadgeVariant; label: string } {
  if (format === '2hg')       return { variant: '2hg',   label: '2HG' }
  if (type === 'launch')      return { variant: 'launch', label: 'Launch' }
  if (type === 'prerelease')  return { variant: 'sealed', label: 'Sealed' }
  if (format === 'draft')     return { variant: 'neutral', label: 'Draft' }
  if (format === 'standard')  return { variant: 'neutral', label: 'Standard' }
  if (format === 'commander') return { variant: 'neutral', label: 'Commander' }
  return { variant: 'sealed', label: 'Sealed' }
}
