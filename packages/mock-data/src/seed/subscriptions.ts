import type { Subscription } from '@ttg/types'

export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-001',
    storeId: 'str-001',
    tier: 'pro',
    status: 'active',
    amount: 2400,
    currency: 'EUR',
    billingCycle: 'monthly',
    currentPeriodEnd: '2026-07-14T00:00:00Z',
  },
  {
    id: 'sub-002',
    storeId: 'str-002',
    tier: 'pro',
    status: 'active',
    amount: 2400,
    currency: 'EUR',
    billingCycle: 'monthly',
    currentPeriodEnd: '2026-06-28T00:00:00Z',
  },
  {
    id: 'sub-003',
    storeId: 'str-003',
    tier: 'basic',
    status: 'active',
    amount: 900,
    currency: 'EUR',
    billingCycle: 'monthly',
    currentPeriodEnd: '2026-07-20T00:00:00Z',
  },
  {
    id: 'sub-006',
    storeId: 'str-006',
    tier: 'basic',
    status: 'active',
    amount: 900,
    currency: 'EUR',
    billingCycle: 'monthly',
    currentPeriodEnd: '2026-07-10T00:00:00Z',
  },
]
