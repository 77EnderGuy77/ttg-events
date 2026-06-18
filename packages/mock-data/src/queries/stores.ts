import type { Store, StoreApplication } from '@ttg/types'
import { STORES, STORE_APPLICATIONS } from '../seed/stores'

export function getStores(): Store[] {
  return STORES
}

export function getStoreById(id: string): Store | undefined {
  return STORES.find(s => s.id === id)
}

export function getStoreBySlug(slug: string): Store | undefined {
  return STORES.find(s => s.slug === slug)
}

export function getStoresByCity(city: string): Store[] {
  return STORES.filter(s => s.city.toLowerCase() === city.toLowerCase())
}

export function getStoreApplications(): StoreApplication[] {
  return STORE_APPLICATIONS
}

export function getStoreApplication(id: string): StoreApplication | undefined {
  return STORE_APPLICATIONS.find(a => a.id === id)
}
