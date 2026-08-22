## Settings

### Flashlight

| Title                           | Description                                                               |
| ------------------------------- | ------------------------------------------------------------------------- |
| **Automatic on**                | Turn on flashlight on startup [when user opens app]                       |
| **Flashlight stay on**          | Stay on after locking the screen                                          |
| **Shake to switch**             | Shake your phone to turn on/off flashlight                                |
| **Notification toolbar toggle** | Shortcut to turn on/off flashlight                                        |
| **Compass**                     | Navigate with built-in compass                                            |
| **Sound**                       | Instant sound flashlight switch (toggleSound)                             |
| **Haptic**                      | Vibration feedback for controls                                           |
| **Power control**               | Low battery warning below 10% (pop for set warning perctage using slider) |
| **Automatic Off**               | Turn off flashlight automatically (pop for set timer 10sec to 30min)      |

### General

| Title             | Description |
| ----------------- | ----------- |
| **App Languages** | English     |

### Others

| Title              | Description                                        |
| ------------------ | -------------------------------------------------- |
| **Rate Us**        | Rate OrbitKit on the App Store                     |
| **Share App**      | Share OrbitKit with your friends                   |
| **Privacy Policy** | Learn how OrbitKit collects and protects your data |



## Architecture:
1. Sound — new Android native SoundModule using ToneGenerator + JS service layer
2. Haptic — React Native's built-in Vibration API, no native code needed
3. Auto-off — timer logic inside useTorch, settings passed from AppProviders