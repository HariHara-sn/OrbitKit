/**
 * app_routes.ts
 * Defines the shape/type of each route in the app.
 * Add param types here as the app grows.
 */

import type { RouteName } from './route_names';

export interface RouteDefinition {
  name: RouteName;
  /** Whether this route is accessible without a navigation stack (modal-style) */
  isModal?: boolean;
}

export const AppRoutes: RouteDefinition[] = [
  { name: 'Flashlight' },
  { name: 'Morse' },
  { name: 'Strobe' },
  { name: 'WhiteScreen' },
  { name: 'Settings', isModal: false },
  { name: 'RouteOptimizationMain' },
  { name: 'GpsAlarmMain' },
  { name: 'LocationMain' },
];
