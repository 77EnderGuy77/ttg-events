import type { User } from '@ttg/types'

/** The 3 demo accounts — any password accepted in fake auth */
export const DEMO_ACCOUNTS: User[] = [
  {
    id: 'usr-001',
    email: 'alex@example.com',
    name: 'Alex Johnson',
    role: 'player',
    createdAt: '2025-09-10T08:00:00Z',
  },
  {
    id: 'usr-002',
    email: 'owner@dragonslair.com',
    name: 'Tomáš Drábek',
    role: 'store-admin',
    storeId: 'str-001',
    createdAt: '2025-08-01T08:00:00Z',
  },
  {
    id: 'usr-003',
    email: 'internal@ttgevents.com',
    name: 'TTG Admin',
    role: 'ttg-admin',
    createdAt: '2025-01-01T00:00:00Z',
  },
]

export function findDemoAccount(email: string): User | undefined {
  return DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase())
}
