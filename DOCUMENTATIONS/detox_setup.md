# Detox setup:
   1. npm install -g detox-cli
   2. npm install detox --save-dev
   3. npx detox init


### ⭐What Was Configured:  

#### 1. Mapped out [`.detoxrc.js`](D:/FlashlightApp/.detoxrc.js)
- Pointed `binaryPath` to your CPU architecture APK: `android/app/build/outputs/apk/debug/app-arm64-v8a-debug.apk`.
- Pointed `testBinaryPath` to `android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk`.

#### 2. Native Android Instrumentation Setup
- Created [`DetoxTest.java`](D:/FlashlightApp/android/app/src/androidTest/java/com/flashlightapp/DetoxTest.java) under `android/app/src/androidTest/java/com/flashlightapp/`.
- Added the Detox maven repository in [`android/build.gradle`](D:/FlashlightApp/android/build.gradle).
- Added `androidTestImplementation('com.wix:detox:+')`, test runner, and Espresso dependencies in [`android/app/build.gradle`](D:/FlashlightApp/android/app/build.gradle).
- Configured [`network_security_config.xml`](D:/FlashlightApp/android/app/src/main/res/xml/network_security_config.xml) to permit local WebSocket traffic for Detox and Metro.

#### 3. Exposed `testID` Elements in React Native
- **Torch Toggle Button**: Added `testID` prop support in [`ToggleButton.tsx`](D:/FlashlightApp/src/shared/components/Button/ToggleButton.tsx) and exposed `testID="torch-toggle-button"`.
- **Status Text**: Exposed `testID="torch-status-text"` in [`FlashlightWrapper.tsx`](D:/FlashlightApp/src/features/flashlight/screens/FlashlightWrapper.tsx).
- **Navigation Tabs**: Exposed `testID="tab-torch"`, `testID="tab-white"`, `testID="tab-strobe"`, and `testID="tab-morse"` in [`BottomNav.tsx`](D:/FlashlightApp/src/features/flashlight/components/BottomNav.tsx).

#### 4. Created First E2E Test ([`e2e/starter.test.js`](D:/FlashlightApp/e2e/starter.test.js))

---

# ⭐How to Run Detox Anytime:

1. **Ensure Metro Bundler is running**:
   ```powershell
   npm start
   ```

2. **To Build the Test Binaries** (only needed when native code or dependencies change):
   ```powershell
   npx detox build -c android.att.debug
   ```

2. **On your phone**:
   - Keep the screen **unlocked and awake**.
   - **Do NOT open the Flashlight app** (stay on the home screen).

3. **In a second terminal, run**:
   ```powershell
   npm run test:e2e
   ```
   *(or `npx detox test -c android.att.debug -r`)*
    > **Note on `-r` (`--reuse`)**: Reuses the already-installed APK on your device, preventing Xiaomi / MIUI from prompting the "Install via USB" confirmation dialog on every test run.







## ⭐Failure and Error while configuring Dtox


1. **MIUI Background Permissions for Test Runner:**
   On Xiaomi / POCO devices, MIUI by default blocks secondary packages (specifically `com.flashlightapp.test`, the Android instrumentation runner) from launching activities in the background or displaying pop-ups. We permanently granted the required background permissions (`10021`, `SYSTEM_ALERT_WINDOW`, `10020`, `10008`) to both `com.flashlightapp` and `com.flashlightapp.test`.



These permissions were granted using Android's built-in **`appops` (Application Operations)** command via ADB.

---

### 1. What are these Op Codes?

MIUI (Xiaomi / POCO) adds custom proprietary security operations on top of standard Android to restrict apps from waking up or displaying windows without user intervention:

| Op Code / Name | MIUI Permission Name | Purpose for Detox / Automated Tests |
| :--- | :--- | :--- |
| `10021` | **Start in background** (`OP_BACKGROUND_START_ACTIVITY`) | Allows the test runner (`com.flashlightapp.test`) to launch `MainActivity` when triggered from terminal. |
| `SYSTEM_ALERT_WINDOW` | **Display pop-up window** | Allows overlays and alert windows to be shown without OS interception. |
| `10008` | **Display pop-up windows while running in background** | Prevents MIUI security manager from suppressing the app when launched by another process. |
| `10020` | **Show on Lock screen** | Ensures the test activity can display even if the device screen was locked or dimmed. |

---

### 2. The Commands Executed     (🧧`IMPORTANT`)

Because ADB connects with elevated `shell` privileges, it can modify app operations directly in Android's system policy without needing root:

```powershell
# For the main application:
adb shell appops set com.flashlightapp 10021 allow
adb shell appops set com.flashlightapp SYSTEM_ALERT_WINDOW allow
adb shell appops set com.flashlightapp 10020 allow
adb shell appops set com.flashlightapp 10008 allow

# For the Detox Android instrumentation test runner package:
adb shell appops set com.flashlightapp.test 10021 allow
adb shell appops set com.flashlightapp.test SYSTEM_ALERT_WINDOW allow
adb shell appops set com.flashlightapp.test 10020 allow
adb shell appops set com.flashlightapp.test 10008 allow
```

---

### 3. Why are they "Permanently" Granted?

* The `appops set` command writes directly into Android’s `/data/system/appops.xml` system database on your device.
* These permissions remain saved on the phone across reboots. They only reset if you completely uninstall the APK or manually reset app permissions in **Settings → Apps → Manage Apps → Permissions**.


