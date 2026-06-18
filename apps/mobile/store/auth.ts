import { create } from 'zustand'
import type { User } from '@ttg/types'
import { DEMO_PLAYER, DEMO_STORE_ADMIN, DEMO_TTG_ADMIN } from '@ttg/mock-data'

const ACCOUNTS: User[] = [DEMO_PLAYER, DEMO_STORE_ADMIN, DEMO_TTG_ADMIN]

interface AuthState {
  user: User | null
  login: (email: string) => boolean
  logout: () => void
  switchAccount: (email: string) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  login: (email) => {
    const account = ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (!account) return false
    set({ user: account })
    return true
  },
  logout: () => set({ user: null }),
  switchAccount: (email) => {
    const account = ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (account) set({ user: account })
  },
}))

export { ACCOUNTS }
