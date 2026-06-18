import type { EventFilters, RegistrationFilters } from '@ttg/types'

export const queryKeys = {
  events: {
    all:     () => ['events'] as const,
    list:    (filters?: EventFilters) => ['events', 'list', filters ?? {}] as const,
    detail:  (id: string) => ['events', 'detail', id] as const,
    stats:   (id: string) => ['events', 'stats', id] as const,
    byCity:  (city: string) => ['events', 'city', city] as const,
    byStore: (storeId: string) => ['events', 'store', storeId] as const,
  },
  stores: {
    all:          () => ['stores'] as const,
    detail:       (slug: string) => ['stores', 'detail', slug] as const,
    applications: () => ['stores', 'applications'] as const,
  },
  registrations: {
    list:      (filters?: RegistrationFilters) => ['registrations', 'list', filters ?? {}] as const,
    withUsers: (eventId: string) => ['registrations', 'event', eventId] as const,
    mine:      (userId: string) => ['registrations', 'mine', userId] as const,
  },
  users: {
    all: () => ['users'] as const,
  },
} as const
