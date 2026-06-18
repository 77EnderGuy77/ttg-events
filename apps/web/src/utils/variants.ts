import type { EventFormat, PlanTier, RegistrationStatus } from '@ttg/types'

export function tierBadgeVariant(tier: PlanTier): 'pro' | 'neutral' | 'free' {
  if (tier === 'pro') return 'pro'
  if (tier === 'basic') return 'neutral'
  return 'free'
}

export function formatBadgeVariant(format: EventFormat): 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral' {
  const map: Partial<Record<EventFormat, 'sealed' | '2hg' | 'prerelease' | 'launch' | 'neutral'>> = {
    sealed: 'sealed',
    '2hg': '2hg',
    prerelease: 'prerelease',
  }
  return map[format] ?? 'neutral'
}

export function registrationStatusVariant(
  status: RegistrationStatus,
): 'active' | 'waitlisted' | 'neutral' | 'sealed' | 'pending' {
  const map: Record<RegistrationStatus, 'active' | 'waitlisted' | 'neutral' | 'sealed' | 'pending'> = {
    registered: 'sealed',
    waitlisted: 'waitlisted',
    'checked-in': 'active',
    attended: 'neutral',
    cancelled: 'neutral',
  }
  return map[status]
}
