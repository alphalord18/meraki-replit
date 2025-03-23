// src/lib/routes.tsx
import { lazy, useEffect } from 'react';

// Define a simpler structure that requires less duplication
type RouteConfig = {
  path: string;
  componentPath: string; // Direct path to the component file
};

// Create a function that generates both the component and preload function
const createRoute = (config: RouteConfig) => {
  const { path, componentPath } = config;
  
  return {
    ...config,
    // Only define the import path once
    component: lazy(() => import(`../${componentPath}`)),
    preload: () => import(`../${componentPath}`)
  };
};

// Define your routes just once with minimal information
const routeConfigs: RouteConfig[] = [
  { path: '/', componentPath: 'pages/Home' },
  { path: '/contact', componentPath: 'pages/Contact' },
  { path: '/sponsors', componentPath: 'pages/Sponsors' },
  { path: '/events', componentPath: 'pages/Events' },
  // Add new routes by just specifying path and component path
];

// Generate the full route objects
export const routes = routeConfigs.map(createRoute);

// Your prefetching utilities
export const prefetchAllRoutes = () => {
  routes.forEach(route => route.preload());
};

export const usePrefetchRoutes = () => {
  useEffect(() => {
    prefetchAllRoutes();
  }, []);
};
