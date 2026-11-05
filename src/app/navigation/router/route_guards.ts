/**
 * route_guards.ts
 * Guard functions that decide whether navigation to a screen is allowed.
 * These can be expanded as auth or feature-flags are added.
 */

import type { RouteName } from './route_names';

/**
 * A future-proof guard hook placeholder.
 * Extend this with real auth checks as the app grows.
 */
export function canNavigateTo(_routeName: RouteName): boolean {
  return true;
}
