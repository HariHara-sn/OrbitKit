/**
 * app_router.ts
 * Central entry point for the routing layer.
 * Re-exports everything consumers need from one place.
 */

export { RouteNames } from './route_names';
export type { RouteName } from './route_names';
export { AppRoutes } from './app_routes';
export type { RouteDefinition } from './app_routes';
export { canNavigateTo, routeRequiresCamera } from './route_guards';
