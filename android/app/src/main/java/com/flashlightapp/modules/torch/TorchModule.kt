package com.flashlightapp.modules.torch

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONObject

class TorchModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  override fun getName(): String = "TorchModule"

  private val mainHandler = Handler(Looper.getMainLooper())
  private var autoOffRunnable: Runnable? = null
  private var wakeLock: PowerManager.WakeLock? = null
  private var torchCallback: CameraManager.TorchCallback? = null
  private var callbackRegistered = false

  private var isTorchOn = false
  private var flashlightStayOn = false
  private var screenOffReceiverRegistered = false

  private fun getCameraId(cameraManager: CameraManager): String {
    return cameraManager.cameraIdList.firstOrNull { id ->
      cameraManager
        .getCameraCharacteristics(id)
        .get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
    } ?: throw IllegalStateException("No camera with flash available")
  }

  // Receiver for screen off (lock screen): turns off torch if flashlightStayOn is false
  private val screenOffReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      if (intent.action == Intent.ACTION_SCREEN_OFF) {
        if (!flashlightStayOn && isTorchOn) {
          try {
            val cameraManager =
              reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            val cameraId = getCameraId(cameraManager)
            cameraManager.setTorchMode(cameraId, false)
            isTorchOn = false

            reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("torchStateChanged", false)
          } catch (_: Exception) {}
        }
      }
    }
  }

  override fun initialize() {
    super.initialize()
    registerTorchCallback()
    registerScreenOffReceiver()
    loadFlashlightStayOnSetting()
  }

  private fun registerTorchCallback() {
    if (callbackRegistered || Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return

    try {
      val cameraManager =
        reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val targetCameraId = getCameraId(cameraManager)

      torchCallback = object : CameraManager.TorchCallback() {
        override fun onTorchModeChanged(cameraId: String, enabled: Boolean) {
          if (cameraId == targetCameraId) {
            isTorchOn = enabled
            reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("torchStateChanged", enabled)
          }
        }

        override fun onTorchModeUnavailable(cameraId: String) {
          if (cameraId == targetCameraId) {
            isTorchOn = false
            reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("torchStateChanged", false)
          }
        }
      }

      cameraManager.registerTorchCallback(torchCallback!!, mainHandler)
      callbackRegistered = true
    } catch (_: Exception) {}
  }

  private fun unregisterTorchCallback() {
    if (callbackRegistered && torchCallback != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      try {
        val cameraManager =
          reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        cameraManager.unregisterTorchCallback(torchCallback!!)
      } catch (_: Exception) {}
      torchCallback = null
      callbackRegistered = false
    }
  }

  private fun registerScreenOffReceiver() {
    if (!screenOffReceiverRegistered) {
      try {
        val filter = IntentFilter(Intent.ACTION_SCREEN_OFF)
        reactContext.registerReceiver(screenOffReceiver, filter)
        screenOffReceiverRegistered = true
      } catch (_: Exception) {}
    }
  }

  private fun unregisterScreenOffReceiver() {
    if (screenOffReceiverRegistered) {
      try {
        reactContext.unregisterReceiver(screenOffReceiver)
      } catch (_: Exception) {}
      screenOffReceiverRegistered = false
    }
  }

  private fun loadFlashlightStayOnSetting() {
    try {
      val prefs = reactContext.getSharedPreferences("flashlight_settings", Context.MODE_PRIVATE)
      val json = prefs.getString("app_settings", null)
      if (json != null) {
        val jsonObject = JSONObject(json)
        flashlightStayOn = jsonObject.optBoolean("flashlightStayOn", false)
      }
    } catch (_: Exception) {}
  }

  @ReactMethod
  fun setFlashlightStayOn(stayOn: Boolean) {
    flashlightStayOn = stayOn
  }

  @ReactMethod
  fun setTorchMode(enabled: Boolean, promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      promise.reject("TORCH_UNSUPPORTED", "Torch is not supported on this device")
      return
    }

    try {
      val cameraManager =
        reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = getCameraId(cameraManager)

      cameraManager.setTorchMode(cameraId, enabled)
      isTorchOn = enabled

      if (!enabled) {
        cancelAutoOffInternal()
      }

      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("TORCH_ERROR", e.message ?: "Failed to set torch mode", e)
    }
  }

  @ReactMethod
  fun scheduleAutoOff(seconds: Double, promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      promise.reject("TORCH_UNSUPPORTED", "Torch is not supported on this device")
      return
    }

    cancelAutoOffInternal()

    if (seconds <= 0) {
      promise.resolve(null)
      return
    }

    val millis = (seconds * 1000).toLong()

    try {
      val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
      wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "FlashlightApp:AutoOffWakeLock").apply {
        setReferenceCounted(false)
        acquire(millis + 2000)
      }

      autoOffRunnable = Runnable {
        try {
          val cameraManager =
            reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
          val cameraId = getCameraId(cameraManager)
          cameraManager.setTorchMode(cameraId, false)
          isTorchOn = false

          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("torchAutoOff", null)
        } catch (_: Exception) {
        } finally {
          releaseWakeLock()
        }
      }

      mainHandler.postDelayed(autoOffRunnable!!, millis)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("SCHEDULE_ERROR", e.message ?: "Failed to schedule auto off", e)
    }
  }

  @ReactMethod
  fun cancelAutoOff() {
    cancelAutoOffInternal()
  }

  @ReactMethod
  fun getSetting(key: String, defaultValue: String, promise: Promise) {
    try {
      val prefs = reactContext.getSharedPreferences("flashlight_settings", Context.MODE_PRIVATE)
      val value = prefs.getString(key, defaultValue) ?: defaultValue
      promise.resolve(value)
    } catch (_: Exception) {
      promise.resolve(defaultValue)
    }
  }

  @ReactMethod
  fun setSetting(key: String, value: String, promise: Promise) {
    try {
      val prefs = reactContext.getSharedPreferences("flashlight_settings", Context.MODE_PRIVATE)
      prefs.edit().putString(key, value).apply()
      if (key == "app_settings") {
        try {
          val jsonObject = JSONObject(value)
          flashlightStayOn = jsonObject.optBoolean("flashlightStayOn", false)
        } catch (_: Exception) {}
      }
      promise.resolve(true)
    } catch (_: Exception) {
      promise.resolve(false)
    }
  }

  private fun cancelAutoOffInternal() {
    autoOffRunnable?.let {
      mainHandler.removeCallbacks(it)
      autoOffRunnable = null
    }
    releaseWakeLock()
  }

  private fun releaseWakeLock() {
    try {
      if (wakeLock?.isHeld == true) {
        wakeLock?.release()
      }
    } catch (_: Exception) {}
    wakeLock = null
  }

  @ReactMethod
  fun addListener(eventName: String) {
    registerTorchCallback()
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Required for NativeEventEmitter
  }

  override fun invalidate() {
    super.invalidate()
    cancelAutoOffInternal()
    unregisterTorchCallback()
    unregisterScreenOffReceiver()
  }
}
