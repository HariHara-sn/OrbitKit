/**
 * app_routes.ts
 * Defines the shape/type of each route in the app.
 * Add param types here as the app grows.
 */

import type { RouteName } from './route_names';

export interface RouteDefinition {
  name: RouteName;
  /** Whether this route requires the user to have granted camera permission */
  requiresCamera?: boolean;
  /** Whether this route is accessible without a navigation stack (modal-style) */
  isModal?: boolean;
}

export const AppRoutes: RouteDefinition[] = [
  { name: 'Flashlight', requiresCamera: true },
  { name: 'Morse', requiresCamera: true },
  { name: 'Strobe', requiresCamera: true },
  { name: 'WhiteScreen' },
  { name: 'Settings', isModal: false },
  { name: 'RouteOptimizationMain' },
  { name: 'GpsAlarmMain', requiresCamera: false },
  { name: 'LocationMain' },
];
