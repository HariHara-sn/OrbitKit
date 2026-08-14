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

2. adb install -r app/build/outputs/apk/release/app-release.apk


# reduce app size form 70mb to 23mb
changes are in gradle.properties, build.gradle
then need to run - adb install -r android\app\build\outputs\apk\release\app-arm64-v8a-release.apk




# 1st commit message:
 flashlight app 

# 2nd commit message:
 app size reduction


# 3rd commit message: [dintImplemented] - use the opencode latestmess to continue to reduce to even smaller
 godMode appsize reduction