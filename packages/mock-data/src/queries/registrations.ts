import type { Registration, RegistrationFilters, RegistrationWithUser } from '@ttg/types'
import { REGISTRATIONS } from '../seed/registrations'
import { getUserById } from './users'

export function getRegistrations(filters?: RegistrationFilters): Registration[] {
  return REGISTRATIONS.filter(r => {
    if (filters?.eventId && r.eventId !== filters.eventId) return false
    if (filters?.userId && r.userId !== filters.userId) return false
    if (filters?.status && r.status !== filters.status) return false
    return true
  })
}

export function getRegistrationById(id: string): Registration | undefined {
  return REGISTRATIONS.find(r => r.id === id)
}

/** All registrations for an event, with user details joined */
export function getRegistrationsWithUsers(eventId: string): RegistrationWithUser[] {
  return REGISTRATIONS
    .filter(r => r.eventId === eventId)
    .map(r => {
      const user = getUserById(r.userId)
      return user ? { ...r, user } : null
    })
    .filter((r): r is RegistrationWithUser => r !== null)
}

/** All registrations for a single user across all events */
export function getMyRegistrations(userId: string): Registration[] {
  return REGISTRATIONS.filter(r => r.userId === userId)
}

/** Count of confirmed (non-waitlisted, non-cancelled) registrations for an event */
export function getConfirmedCount(eventId: string): number {
  return REGISTRATIONS.filter(
    r => r.eventId === eventId && (r.status === 'registered' || r.status === 'checked-in' || r.status === 'attended'),
  ).length
}

export function getWaitlistCount(eventId: string): number {
  return REGISTRATIONS.filter(r => r.eventId === eventId && r.status === 'waitlisted').length
}
