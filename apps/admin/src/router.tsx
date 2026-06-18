import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { NewEventPage } from './pages/NewEventPage'
import { RevenuePage } from './pages/RevenuePage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { SettingsPage } from './pages/SettingsPage'

const rootRoute = createRootRoute({ component: AdminLayout })

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })
const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: EventsPage })
const newEventRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/new', component: NewEventPage })
const eventDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventId', component: EventDetailPage })
const revenueRoute = createRoute({ getParentRoute: () => rootRoute, path: '/revenue', component: RevenuePage })
const subscriptionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/subscription', component: SubscriptionPage })
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage })

const routeTree = rootRoute.addChildren([
  loginRoute,
  eventsRoute,
  newEventRoute,
  eventDetailRoute,
  revenueRoute,
  subscriptionRoute,
  settingsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
