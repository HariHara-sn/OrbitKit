## APP LauncherIcon setup 
[video-https://www.youtube.com/watch?v=aOXN1yJ6vxs&t=292s]
stp 1: visit https://easyappicon.com/
stp 2: download and extract the zip
stp 3: replace them
stp 4: npx react-native run-android 


## App name change
stp 1: Change strings.xml
open : android/app/src/main/res/values/strings.xml
edit : <string name="app_name">FlashlightApp</string>
stp2 : Rebuild the app



## build apk 
1. Install the APK on a connected device, use the app without metro
cd android
./gradlew assembleRelease

2. cd ..
   adb install -r app/build/outputs/apk/release/app-release.apk


## reduce app size form 70mb to 23mb
changes are in gradle.properties, build.gradle
then need to run - adb install -r android\app\build\outputs\apk\release\app-arm64-v8a-release.apk


## List of all icons of `import Icon from 'react-native-vector-icons/Ionicons';`
visit https://ionic.io/ionicons?utm_source=chatgpt.com



## Rebuild Commands Used for Native Kotlin Changes
`must recompile and reinstall the native Android APK.`
1. Rebuild the debug APK with Gradle
cd android
.\gradlew.bat assembleDebug
cd ..

2. Reinstall the newly compiled APK onto the phone
`adb install -r android/app/build/outputs/apk/debug/app-arm64-v8a-debug.apk`

3. Restore MIUI background start permissions (MIUI resets them on new APK installs)
`adb shell "appops set com.flashlightapp 10021 allow; appops set com.flashlightapp SYSTEM_ALERT_WINDOW allow; appops set com.flashlightapp.test 10021 allow; appops set com.flashlightapp.test SYSTEM_ALERT_WINDOW allow"`

4. Launch the updated app
`adb shell am start -n com.flashlightapp/.MainActivity`
