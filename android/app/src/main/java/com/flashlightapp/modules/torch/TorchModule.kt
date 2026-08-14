package com.flashlightapp.modules.torch

import android.content.Context
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TorchModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  override fun getName(): String = "TorchModule"

  @ReactMethod
  fun setTorchMode(enabled: Boolean, promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      promise.reject("TORCH_UNSUPPORTED", "Torch is not supported on this device")
      return
    }

    try {
      val cameraManager =
        reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId =
        cameraManager.cameraIdList.firstOrNull { id ->
          cameraManager
            .getCameraCharacteristics(id)
            .get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
        }
          ?: throw IllegalStateException("No camera with flash available")

      cameraManager.setTorchMode(cameraId, enabled)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("TORCH_ERROR", e.message ?: "Failed to set torch mode", e)
    }
  }
}
