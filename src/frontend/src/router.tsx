import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import BrowsePage from './pages/BrowsePage';
import VideoDetailPage from './pages/VideoDetailPage';
import AccountPage from './pages/AccountPage';
import RequireAuth from './components/auth/RequireAuth';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BrowsePage,
});

const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/video/$videoId',
  component: VideoDetailPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: () => (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute, videoRoute, accountRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
