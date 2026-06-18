import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserRole } from '@ttg/types'
import { findDemoAccount } from './accounts'

interface AuthState {
  user: User | null
  /** Returns true if a matching demo account was found */
  login: (email: string, _password: string) => boolean
  logout: () => void
  /** Instantly switch to any demo account by email — for demo switcher UI */
  switchAccount: (email: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (email, _password) => {
        const account = findDemoAccount(email)
        if (!account) return false
        set({ user: account })
        return true
      },

      logout: () => set({ user: null }),

      switchAccount: (email) => {
        const account = findDemoAccount(email)
        if (account) set({ user: account })
      },
    }),
    {
      name: 'ttg-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

// ─── Selectors ───────────────────────────────────────────────────────────────

export function useCurrentUser(): User | null {
  return useAuthStore(s => s.user)
}

export function useIsAuthenticated(): boolean {
  return useAuthStore(s => s.user !== null)
}

export function useUserRole(): UserRole | null {
  return useAuthStore(s => s.user?.role ?? null)
}

export function useIsStoreAdmin(): boolean {
  return useAuthStore(s => s.user?.role === 'store-admin')
}

export function useIsTtgAdmin(): boolean {
  return useAuthStore(s => s.user?.role === 'ttg-admin')
}

/** Returns the storeId for the current store-admin, or null */
export function useAdminStoreId(): string | null {
  return useAuthStore(s =>
    s.user?.role === 'store-admin' ? (s.user.storeId ?? null) : null,
  )
}
