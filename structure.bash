[Featurebased Architecture]
src/
├── app/
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── routes.ts
│   │   └── types.ts
│   │
│   └── providers/
│       └── AppProviders.tsx
│
├── core/
│   ├── config/
│   ├── theme/
│   ├── constants/
│   └── assets/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── types/
│
├── features/
│   ├── flashlight/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── routes.ts
│   │
│   ├── routeOptimization/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── types/
│   │   └── routes.ts
│   │
│   ├── gpsAlarm/
│   │   └── ...
│   │
│   └── location/
│       └── ...
│
├── App.tsx
└── index.ts