import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { NewEventPage } from './pages/NewEventPage'
import { StoresPage } from './pages/StoresPage'
import { StoreRequestsPage } from './pages/StoreRequestsPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { AuditLogPage } from './pages/AuditLogPage'
import { SettingsPage } from './pages/SettingsPage'

const rootRoute = createRootRoute({ component: AdminLayout })

const loginRoute        = createRoute({ getParentRoute: () => rootRoute, path: '/login',           component: LoginPage })
const dashboardRoute    = createRoute({ getParentRoute: () => rootRoute, path: '/',                component: DashboardPage })
const eventsRoute       = createRoute({ getParentRoute: () => rootRoute, path: '/events',          component: EventsPage })
const newEventRoute     = createRoute({ getParentRoute: () => rootRoute, path: '/events/new',      component: NewEventPage })
const eventDetailRoute  = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventId', component: EventDetailPage })
const storesRoute       = createRoute({ getParentRoute: () => rootRoute, path: '/stores',          component: StoresPage })
const storeRequestsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/store-requests', component: StoreRequestsPage })
const subscriptionsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/subscriptions',  component: SubscriptionsPage })
const notificationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/notifications',  component: NotificationsPage })
const auditLogRoute     = createRoute({ getParentRoute: () => rootRoute, path: '/audit-log',       component: AuditLogPage })
const settingsRoute     = createRoute({ getParentRoute: () => rootRoute, path: '/settings',        component: SettingsPage })

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  eventsRoute,
  newEventRoute,
  eventDetailRoute,
  storesRoute,
  storeRequestsRoute,
  subscriptionsRoute,
  notificationsRoute,
  auditLogRoute,
  settingsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
