import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { RootLayout } from './layouts/RootLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
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

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })
const storesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stores', component: StoresPage })
const storeDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stores/$storeSlug', component: StoreDetailPage })
const eventDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventId', component: EventDetailPage })
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events/$eventId/register', component: RegisterPage })
const pricingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pricing', component: PricingPage })
const applyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/apply', component: ApplyPage })
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })

const dashboardLayoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard', component: DashboardLayout })
const dashboardIndexRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/', component: DashboardPage })
const historyRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/history', component: HistoryPage })
const profileRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/profile', component: ProfilePage })

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
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
