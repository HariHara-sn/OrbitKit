import { FLASHLIGHT_ROUTES } from '../../features/flashlight/routes';
import { ROUTE_OPTIMIZATION_ROUTES } from '../../features/routeOptimization/routes';
import { GPS_ALARM_ROUTES } from '../../features/gpsAlarm/routes';
import { LOCATION_ROUTES } from '../../features/location/routes';

export const ROUTES = {
  ...FLASHLIGHT_ROUTES,
  ...ROUTE_OPTIMIZATION_ROUTES,
  ...GPS_ALARM_ROUTES,
  ...LOCATION_ROUTES,
} as const;

export type AppRoutes = typeof ROUTES;
