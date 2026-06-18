import { useQuery } from '@tanstack/react-query'
import type { EventFilters, RegistrationFilters } from '@ttg/types'
import {
  getEvents,
  getEventById,
  getEventsWithStore,
  getEventsByCity,
  getEventStats,
  getStores,
  getStoreBySlug,
  getStoreById,
  getStoreApplications,
  getRegistrations,
  getRegistrationsWithUsers,
  getMyRegistrations,
  getUsers,
} from '@ttg/mock-data'
import { queryKeys } from './query-keys'

// ─── Events ──────────────────────────────────────────────────────────────────

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => getEvents(filters),
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => getEventById(id) ?? null,
    enabled: !!id,
  })
}

export function useEventsWithStore(filters?: EventFilters) {
  return useQuery({
    queryKey: [...queryKeys.events.list(filters), 'with-store'],
    queryFn: () => getEventsWithStore(filters),
  })
}

export function useEventsByCity(city: string) {
  return useQuery({
    queryKey: queryKeys.events.byCity(city),
    queryFn: () => getEventsByCity(city),
    enabled: !!city,
  })
}

export function useEventStats(eventId: string) {
  return useQuery({
    queryKey: queryKeys.events.stats(eventId),
    queryFn: () => getEventStats(eventId),
    enabled: !!eventId,
  })
}

// ─── Stores ──────────────────────────────────────────────────────────────────

export function useStores() {
  return useQuery({
    queryKey: queryKeys.stores.all(),
    queryFn: getStores,
  })
}

export function useStore(slug: string) {
  return useQuery({
    queryKey: queryKeys.stores.detail(slug),
    queryFn: () => getStoreBySlug(slug) ?? null,
    enabled: !!slug,
  })
}

export function useStoreById(id: string) {
  return useQuery({
    queryKey: ['stores', 'id', id],
    queryFn: () => getStoreById(id) ?? null,
    enabled: !!id,
  })
}

export function useStoreApplications() {
  return useQuery({
    queryKey: queryKeys.stores.applications(),
    queryFn: getStoreApplications,
  })
}

// ─── Registrations ───────────────────────────────────────────────────────────

export function useRegistrations(filters?: RegistrationFilters) {
  return useQuery({
    queryKey: queryKeys.registrations.list(filters),
    queryFn: () => getRegistrations(filters),
  })
}

export function useRegistrationsWithUsers(eventId: string) {
  return useQuery({
    queryKey: queryKeys.registrations.withUsers(eventId),
    queryFn: () => getRegistrationsWithUsers(eventId),
    enabled: !!eventId,
  })
}

export function useMyRegistrations(userId: string) {
  return useQuery({
    queryKey: queryKeys.registrations.mine(userId),
    queryFn: () => getMyRegistrations(userId),
    enabled: !!userId,
  })
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: getUsers,
  })
}

// ─── Re-export query keys for external invalidation ──────────────────────────

export { queryKeys }
