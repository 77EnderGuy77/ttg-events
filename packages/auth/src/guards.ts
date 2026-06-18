import type { User, UserRole } from '@ttg/types'
import { useCurrentUser } from './store'

/**
 * Returns the current user if authenticated, null otherwise.
 * Use in route components to redirect unauthenticated users.
 */
export function useRequireAuth(): User | null {
  return useCurrentUser()
}

/**
 * Returns the current user if they have one of the allowed roles, null otherwise.
 * Use in route components to gate by role.
 */
export function useRequireRole(...roles: UserRole[]): User | null {
  const user = useCurrentUser()
  if (!user) return null
  return roles.includes(user.role) ? user : null
}

/** Guard specifically for player dashboard routes */
export function useRequirePlayer(): User | null {
  return useRequireRole('player', 'store-admin', 'ttg-admin')
}

/** Guard for store admin routes — store-admin only */
export function useRequireStoreAdmin(): User | null {
  return useRequireRole('store-admin')
}

/** Guard for internal TTG admin routes — ttg-admin only */
export function useRequireTtgAdmin(): User | null {
  return useRequireRole('ttg-admin')
}
