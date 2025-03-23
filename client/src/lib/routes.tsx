// src/lib/routes.tsx
import { useEffect } from 'react';

// Define the route configuration type
type RouteConfig = {
  path: string;
  component: React.ComponentType<any>;
  preload: () => Promise<any>;
};

// Create routes array
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Home,
    preload: () => import('@/pages/home').then(m => m)
  },
  {
    path: '/events',
    component: Events,
    preload: () => import('@/pages/events').then(m => m)
  },
  {
    path: '/speakers',
    component: Speakers,
    preload: () => import('@/pages/speakers').then(m => m)
  },
  {
    path: '/blog',
    component: Blog,
    preload: () => import('@/pages/blog').then(m => m)
  },
  {
    path: '/sponsors',
    component: Sponsors,
    preload: () => import('@/pages/sponsors').then(m => m)
  },
  {
    path: '/register',
    component: Register,
    preload: () => import('@/pages/register').then(m => m)
  },
  {
    path: '/contact',
    component: Contact,
    preload: () => import('@/pages/contact').then(m => m)
  }
];

// Add the not found route separately
export const notFoundRoute = {
  component: NotFound,
  preload: () => import('@/pages/not-found').then(m => m)
};

// Utility function to prefetch all routes
export const prefetchAllRoutes = () => {
  // Preload all regular routes
  routes.forEach(route => {
    route.preload();
  });
  
  // Also preload the not found route
  notFoundRoute.preload();
};

// React hook to use in components
export const usePrefetchRoutes = () => {
  useEffect(() => {
    prefetchAllRoutes();
  }, []);
};
