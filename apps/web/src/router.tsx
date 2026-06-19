import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { RootLayout } from './layouts/RootLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { InternalLayout } from './layouts/InternalLayout'
// Public pages
import { LandingPage } from './pages/LandingPage'
import { StoresPage } from './pages/StoresPage'
import { StoreDetailPage } from './pages/StoreDetailPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { RegisterPage } from './pages/RegisterPage'
import { PricingPage } from './pages/PricingPage'
import { ApplyPage } from './pages/ApplyPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { HistoryPage } from './pages/dashboard/HistoryPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
// Admin pages
import { DashboardPage as AdminDashboardPage } from './pages/admin/DashboardPage'
import { EventsPage as AdminEventsPage } from './pages/admin/EventsPage'
import { EventDetailPage as AdminEventDetailPage } from './pages/admin/EventDetailPage'
import { NewEventPage } from './pages/admin/NewEventPage'
import { StoresPage as AdminStoresPage } from './pages/admin/StoresPage'
import { StoreRequestsPage } from './pages/admin/StoreRequestsPage'
import { SubscriptionsPage as AdminSubscriptionsPage } from './pages/admin/SubscriptionsPage'
import { SubscriptionPage } from './pages/admin/SubscriptionPage'
import { RevenuePage } from './pages/admin/RevenuePage'
import { NotificationsPage } from './pages/admin/NotificationsPage'
import { AuditLogPage } from './pages/admin/AuditLogPage'
import { SettingsPage } from './pages/admin/SettingsPage'
// Internal pages
import { OverviewPage } from './pages/internal/OverviewPage'
import { StoresPage as InternalStoresPage } from './pages/internal/StoresPage'
import { StoreDetailPage as InternalStoreDetailPage } from './pages/internal/StoreDetailPage'
import { ApplicationsPage } from './pages/internal/ApplicationsPage'
import { EventsPage as InternalEventsPage } from './pages/internal/EventsPage'
import { UsersPage } from './pages/internal/UsersPage'
import { SubscriptionsPage as InternalSubscriptionsPage } from './pages/internal/SubscriptionsPage'

const rootRoute = createRootRoute({ component: RootLayout })

// Public routes
const indexRoute         = createRoute({ getParentRoute: () => rootRoute, path: '/',                          component: LandingPage })
const storesRoute        = createRoute({ getParentRoute: () => rootRoute, path: '/stores',                    component: StoresPage })
const storeDetailRoute   = createRoute({ getParentRoute: () => rootRoute, path: '/stores/$storeSlug',         component: StoreDetailPage })
const eventDetailRoute   = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventId',           component: EventDetailPage })
const registerRoute      = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventId/register',  component: RegisterPage })
const pricingRoute       = createRoute({ getParentRoute: () => rootRoute, path: '/pricing',                   component: PricingPage })
const applyRoute         = createRoute({ getParentRoute: () => rootRoute, path: '/apply',                     component: ApplyPage })
const loginRoute         = createRoute({ getParentRoute: () => rootRoute, path: '/login',                     component: LoginPage })

// Player dashboard
const dashboardLayoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard', component: DashboardLayout })
const dashboardIndexRoute  = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/',        component: DashboardPage })
const historyRoute         = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/history', component: HistoryPage })
const profileRoute         = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/profile', component: ProfilePage })

// Admin
const adminLayoutRoute         = createRoute({ getParentRoute: () => rootRoute,        path: '/admin',          component: AdminLayout })
const adminIndexRoute          = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/',               component: AdminDashboardPage })
const adminEventsRoute         = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/events',         component: AdminEventsPage })
const adminNewEventRoute       = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/events/new',     component: NewEventPage })
const adminEventDetailRoute    = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/events/$eventId', component: AdminEventDetailPage })
const adminStoresRoute         = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/stores',         component: AdminStoresPage })
const adminStoreRequestsRoute  = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/store-requests', component: StoreRequestsPage })
const adminSubscriptionsRoute  = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/subscriptions',  component: AdminSubscriptionsPage })
const adminSubscriptionRoute   = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/subscription',   component: SubscriptionPage })
const adminRevenueRoute        = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/revenue',        component: RevenuePage })
const adminNotificationsRoute  = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/notifications',  component: NotificationsPage })
const adminAuditLogRoute       = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/audit-log',      component: AuditLogPage })
const adminSettingsRoute       = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/settings',       component: SettingsPage })

// Internal
const internalLayoutRoute        = createRoute({ getParentRoute: () => rootRoute,           path: '/internal',               component: InternalLayout })
const internalIndexRoute         = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/',                       component: OverviewPage })
const internalStoresRoute        = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/stores',                 component: InternalStoresPage })
const internalStoreDetailRoute   = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/stores/$storeId',        component: InternalStoreDetailPage })
const internalApplicationsRoute  = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/applications',           component: ApplicationsPage })
const internalEventsRoute        = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/events',                 component: InternalEventsPage })
const internalUsersRoute         = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/users',                  component: UsersPage })
const internalSubscriptionsRoute = createRoute({ getParentRoute: () => internalLayoutRoute, path: '/subscriptions',          component: InternalSubscriptionsPage })

const routeTree = rootRoute.addChildren([
  indexRoute,
  storesRoute,
  storeDetailRoute,
  eventDetailRoute,
  registerRoute,
  pricingRoute,
  applyRoute,
  loginRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    historyRoute,
    profileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminEventsRoute,
    adminNewEventRoute,
    adminEventDetailRoute,
    adminStoresRoute,
    adminStoreRequestsRoute,
    adminSubscriptionsRoute,
    adminSubscriptionRoute,
    adminRevenueRoute,
    adminNotificationsRoute,
    adminAuditLogRoute,
    adminSettingsRoute,
  ]),
  internalLayoutRoute.addChildren([
    internalIndexRoute,
    internalStoresRoute,
    internalStoreDetailRoute,
    internalApplicationsRoute,
    internalEventsRoute,
    internalUsersRoute,
    internalSubscriptionsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
