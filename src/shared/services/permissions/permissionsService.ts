import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Requests runtime camera permission, which is required to control the
 * flashlight torch on Android. Returns true when the permission is granted.
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const alreadyGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Flashlight permission',
      message: 'Flashlight needs camera access to control the LED flash.',
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
    },
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
};
