package com.flashlightapp.modules.notification

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.flashlightapp.MainActivity

class NotificationToolbarModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  companion object {
    private var instance: NotificationToolbarModule? = null

    fun emitOpenSettings() {
      try {
        instance?.reactContext
          ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          ?.emit("openSettings", null)
      } catch (_: Exception) {}
    }
  }

  init {
    instance = this
  }

  override fun getName(): String = "NotificationToolbarModule"

  @ReactMethod
  fun setToolbarEnabled(enabled: Boolean, promise: Promise) {
    try {
      NotificationHelper.setToolbarEnabled(reactContext, enabled)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("NOTIFICATION_ERROR", e.message ?: "Failed to set toolbar state", e)
    }
  }

  @ReactMethod
  fun isToolbarEnabled(promise: Promise) {
    promise.resolve(NotificationHelper.isToolbarEnabled(reactContext))
  }

  @ReactMethod
  fun updateToolbar(isTorchOn: Boolean, promise: Promise) {
    try {
      NotificationHelper.updateNotification(reactContext, isTorchOn)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("NOTIFICATION_ERROR", e.message ?: "Failed to update notification", e)
    }
  }

  @ReactMethod
  fun checkInitialOpenSettings(promise: Promise) {
    val shouldOpen = MainActivity.initialOpenSettings
    MainActivity.initialOpenSettings = false
    promise.resolve(shouldOpen)
  }
}
