/**
 * route_guards.ts
 * Guard functions that decide whether navigation to a screen is allowed.
 * These can be expanded as auth, permissions, or feature-flags are added.
 */

import { AppRoutes } from './app_routes';
import type { RouteName } from './route_names';

/**
 * Returns true when the given route requires camera permission.
 * Use this before navigating to torch/strobe/morse screens.
 */
export function routeRequiresCamera(routeName: RouteName): boolean {
  const route = AppRoutes.find(r => r.name === routeName);
  return route?.requiresCamera ?? false;
}

/**
 * A future-proof guard hook placeholder.
 * Extend this with real permission/auth checks as the app grows.
 */
export function canNavigateTo(_routeName: RouteName): boolean {
  return true;
}
