import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { InternalLayout } from './layouts/InternalLayout'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { StoresPage } from './pages/StoresPage'
import { StoreDetailPage } from './pages/StoreDetailPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { EventsPage } from './pages/EventsPage'
import { UsersPage } from './pages/UsersPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'

const rootRoute = createRootRoute({ component: InternalLayout })

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })
const overviewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: OverviewPage })
const storesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stores', component: StoresPage })
const storeDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stores/$storeId', component: StoreDetailPage })
const applicationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/applications', component: ApplicationsPage })
const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events', component: EventsPage })
const usersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/users', component: UsersPage })
const subscriptionsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/subscriptions', component: SubscriptionsPage })

const routeTree = rootRoute.addChildren([
  loginRoute,
  overviewRoute,
  storesRoute,
  storeDetailRoute,
  applicationsRoute,
  eventsRoute,
  usersRoute,
  subscriptionsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
