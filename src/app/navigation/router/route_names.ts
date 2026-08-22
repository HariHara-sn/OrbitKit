/**
 * route_names.ts
 * Single source of truth for all screen name strings.
 * Import from here rather than using raw strings.
 */

export const RouteNames = {
  // Flashlight feature
  FLASHLIGHT: 'Flashlight',
  MORSE: 'Morse',
  STROBE: 'Strobe',
  WHITE_SCREEN: 'WhiteScreen',
  SETTINGS: 'Settings',

  // Route Optimization feature
  ROUTE_OPTIMIZATION: 'RouteOptimizationMain',

  // GPS Alarm feature
  GPS_ALARM: 'GpsAlarmMain',

  // Location feature
  LOCATION: 'LocationMain',
} as const;

export type RouteName = (typeof RouteNames)[keyof typeof RouteNames];
