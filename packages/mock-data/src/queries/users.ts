import type { User } from '@ttg/types'
import { USERS } from '../seed/users'

export function getUsers(): User[] {
  return USERS
}

export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return USERS.find(u => u.email === email)
}

export function getPlayerCount(): number {
  return USERS.filter(u => u.role === 'player').length
}
