import type { Event, EventFilters, EventStats, EventWithStore } from '@ttg/types'
import { EVENTS } from '../seed/events'
import { REGISTRATIONS } from '../seed/registrations'
import { getStoreById } from './stores'

export function getEvents(filters?: EventFilters): Event[] {
  return EVENTS.filter(ev => {
    if (filters?.storeId && ev.storeId !== filters.storeId) return false
    if (filters?.game && ev.game !== filters.game) return false
    if (filters?.format && ev.format !== filters.format) return false
    if (filters?.status && ev.status !== filters.status) return false
    return true
  })
}

export function getEventById(id: string): Event | undefined {
  return EVENTS.find(e => e.id === id)
}

export function getEventsByStore(storeId: string): Event[] {
  return EVENTS.filter(e => e.storeId === storeId)
}

/** Returns events from all stores in the given city */
export function getEventsByCity(city: string): EventWithStore[] {
  return EVENTS
    .map(ev => {
      const store = getStoreById(ev.storeId)
      if (!store) return null
      return { ...ev, store }
    })
    .filter((ev): ev is EventWithStore => ev !== null && ev.store.city.toLowerCase() === city.toLowerCase())
}

export function getEventWithStore(id: string): EventWithStore | undefined {
  const ev = EVENTS.find(e => e.id === id)
  if (!ev) return undefined
  const store = getStoreById(ev.storeId)
  if (!store) return undefined
  return { ...ev, store }
}

export function getEventsWithStore(filters?: EventFilters): EventWithStore[] {
  return getEvents(filters)
    .map(ev => {
      const store = getStoreById(ev.storeId)
      return store ? { ...ev, store } : null
    })
    .filter((ev): ev is EventWithStore => ev !== null)
}

export function getEventStats(eventId: string): EventStats {
  const regs = REGISTRATIONS.filter(r => r.eventId === eventId)
  const confirmed = regs.filter(r => r.status === 'registered').length
  const waitlisted = regs.filter(r => r.status === 'waitlisted').length
  const checkedIn = regs.filter(r => r.status === 'checked-in').length
  const attended = regs.filter(r => r.status === 'attended').length
  const cancelled = regs.filter(r => r.status === 'cancelled').length
  const event = getEventById(eventId)
  const estimatedRevenue = (confirmed + checkedIn + attended) * (event?.entryFee ?? 0)
  return { eventId, confirmed, waitlisted, checkedIn, attended, cancelled, estimatedRevenue }
}
