// ─── Primitive enums ────────────────────────────────────────────────────────

export type GameType =
  | 'mtg'
  | 'pokemon'
  | 'one-piece'
  | 'lorcana'
  | 'yugioh'
  | 'fab'
  | 'other'

export type EventFormat =
  | 'sealed'
  | '2hg'
  | 'draft'
  | 'standard'
  | 'commander'
  | 'prerelease'
  | 'other'

export type EventType = 'prerelease' | 'launch' | 'regular' | 'championship'

export type EventStatus = 'upcoming' | 'active' | 'completed' | 'cancelled'

export type RegistrationStatus =
  | 'registered'
  | 'waitlisted'
  | 'checked-in'
  | 'attended'
  | 'cancelled'

export type RegistrationType = '1v1' | '2v2-solo' | '2v2-team'

export type TeamRole = 'captain' | 'solo'

export type PlanTier = 'free' | 'basic' | 'pro'

export type UserRole = 'player' | 'store-admin' | 'ttg-admin'

export type StoreStatus = 'active' | 'suspended' | 'pending'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trialing'

export type BillingCycle = 'monthly' | 'annual'

export type AnnouncementType = 'reminder' | 'capacity' | 'schedule' | 'general'

// ─── Core models ────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  /** Set only when role === 'store-admin' */
  storeId?: string
  createdAt: string
}

export interface Store {
  id: string
  slug: string
  name: string
  city: string
  country: string
  address: string
  website?: string
  tier: PlanTier
  status: StoreStatus
  adminIds: string[]
  createdAt: string
}

export interface StoreApplication {
  id: string
  storeName: string
  city: string
  country: string
  address?: string
  contactName: string
  contactEmail: string
  website?: string
  wpn: boolean
  status: ApplicationStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface Event {
  id: string
  storeId: string
  name: string
  game: GameType
  format: EventFormat
  type: EventType
  status: EventStatus
  /** ISO date string e.g. "2026-06-14" */
  date: string
  /** 24h time e.g. "10:00" */
  time: string
  capacity: number
  waitlistCapacity: number
  /** Entry fee in local currency; 0 = free */
  entryFee: number
  currency: string
  notes?: string
  companionApp: boolean
  createdAt: string
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  type: RegistrationType
  status: RegistrationStatus
  /** Only for '2v2-team' */
  teamRole?: TeamRole
  /** Only for '2v2-team' */
  teammateName?: string
  companionName?: string
  registeredAt: string
  checkedInAt?: string
}

export interface Announcement {
  id: string
  eventId: string
  storeId: string
  title: string
  body: string
  type: AnnouncementType
  sentAt: string
  sentCount: number
  openCount: number
}

export interface Subscription {
  id: string
  storeId: string
  tier: PlanTier
  status: SubscriptionStatus
  /** Amount in cents */
  amount: number
  currency: string
  billingCycle: BillingCycle
  /** ISO date string */
  currentPeriodEnd: string
}

// ─── View / derived types ───────────────────────────────────────────────────

export interface EventWithStore extends Event {
  store: Store
}

export interface RegistrationWithUser extends Registration {
  user: User
}

export interface EventStats {
  eventId: string
  confirmed: number
  waitlisted: number
  checkedIn: number
  attended: number
  cancelled: number
  estimatedRevenue: number
}

export interface PlatformStats {
  totalStores: number
  totalEvents: number
  totalRegistrations: number
  totalUsers: number
  pendingApplications: number
}

// ─── Filter types ───────────────────────────────────────────────────────────

export interface EventFilters {
  storeId?: string
  storeSlug?: string
  game?: GameType
  format?: EventFormat
  status?: EventStatus
}

export interface RegistrationFilters {
  eventId?: string
  userId?: string
  status?: RegistrationStatus
}
