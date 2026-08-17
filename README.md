# OrbitKit

> **Smart tools. One orbit.**

OrbitKit is a modular React Native utility application that brings practical everyday tools into one place.

## Features

### 🔦 Flashlight

* Torch
* White Screen
* Strobe Mode
* SOS
* DJ Mode
* Morse Code

### 🗺️ Route Optimization

* Source selection
* Destination selection
* Optimized route
* Dijkstra algorithm

### ⏰ GPS Alarm

* Location-based alarms
* Enter/exit location alerts
* GPS notifications

### 📍 Location & Address

* Current location
* Address
* Coordinates
* Location information

---

## Architecture

OrbitKit follows a **Feature-Based Architecture**.

The project is organized around business features, with shared application capabilities separated from feature-specific functionality.

---

## Project Structure

```text
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
```

---

## State Management

OrbitKit uses feature-level state management.

* **Zustand** for shared feature state
* **React state** for local UI state
* **Server-state management** for API/server data when required

Feature state should remain scoped to the feature that owns it.

---

## Navigation

Navigation is handled at the application level.

The application provides:

* Root navigation
* Main tab navigation
* Feature navigation
* Navigation types

Each feature exposes its own routes to the application navigation layer.

---

## Development Principles

* Feature-based architecture
* Strong TypeScript typing
* Reusable components
* Minimal coupling between features
* Clear separation of UI and business logic
* Prefer simple solutions over unnecessary abstractions
* Keep feature-specific code inside its feature
* Move functionality to `shared` only when genuinely reusable

---

## Development Status

### Flashlight

* [x] Torch
* [x] White Screen
* [x] Strobe
* [x] SOS
* [x] Morse Code
* [ ] DJ Mode refinement

### Route Optimization

* [ ] Source selection
* [ ] Destination selection
* [ ] Dijkstra algorithm
* [ ] Route visualization
* [ ] Route optimization

### GPS Alarm

* [ ] Create alarm
* [ ] Location selection
* [ ] Radius configuration
* [ ] Enter/exit triggers
* [ ] Notifications

### Location & Address

* [ ] Current location
* [ ] Coordinates
* [ ] Address lookup
* [ ] Location information

---

## License

Private project.