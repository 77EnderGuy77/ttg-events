import { create } from 'zustand'
import type { User } from '@ttg/types'

// Inline to avoid @ttg/auth's sessionStorage dependency in React Native
export const DEMO_ACCOUNTS: User[] = [
  { id: 'usr-001', email: 'alex@example.com', name: 'Alex Johnson', role: 'player', createdAt: '2025-09-10T08:00:00Z' },
  { id: 'usr-002', email: 'owner@dragonslair.com', name: 'Tomáš Drábek', role: 'store-admin', storeId: 'str-001', createdAt: '2025-08-01T08:00:00Z' },
  { id: 'usr-003', email: 'internal@ttgevents.com', name: 'TTG Admin', role: 'ttg-admin', createdAt: '2025-01-01T00:00:00Z' },
]

interface AuthState {
  user: User | null
  login: (email: string, _password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  login: (email, _password) => {
    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (!account) return false
    set({ user: account })
    return true
  },
  logout: () => set({ user: null }),
}))

export function useCurrentUser(): User | null {
  return useAuthStore(s => s.user)
}
