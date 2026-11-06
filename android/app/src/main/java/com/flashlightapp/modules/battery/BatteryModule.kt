package com.flashlightapp.modules.battery

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  override fun getName(): String = "BatteryModule"

  private val batteryReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      val level = getBatteryLevel(intent)
      val isCharging = getChargingState(intent)
      val event = WritableNativeMap().apply {
        putDouble("level", level)
        putBoolean("isCharging", isCharging)
      }
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("batteryLevelChanged", event)
    }
  }

  private var receiverRegistered = false

  override fun initialize() {
    super.initialize()
    register()
  }

  override fun invalidate() {
    super.invalidate()
    unregister()
  }

  @ReactMethod
  fun getBatteryLevel(promise: Promise) {
    try {
      val intent = reactContext.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
      val level = if (intent != null) {
        getBatteryLevel(intent)
      } else {
        val bm = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY).toDouble() / 100.0
      }
      val isCharging = if (intent != null) {
        getChargingState(intent)
      } else {
        isCurrentlyCharging()
      }
      val result = WritableNativeMap().apply {
        putDouble("level", level)
        putBoolean("isCharging", isCharging)
      }
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("BATTERY_ERROR", e.message ?: "Failed to get battery level", e)
    }
  }

  @ReactMethod
  fun addListener(eventName: String) {
    register()
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Required for NativeEventEmitter
  }

  private fun isCurrentlyCharging(): Boolean {
    val bm = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
    return bm.isCharging
  }

  private fun getBatteryLevel(intent: Intent): Double {
    val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
    val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
    return if (level >= 0 && scale > 0) {
      level.toDouble() / scale.toDouble()
    } else {
      0.0
    }
  }

  private fun getChargingState(intent: Intent): Boolean {
    val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
    val plugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0)
    return plugged != 0 ||
      status == BatteryManager.BATTERY_STATUS_CHARGING ||
      status == BatteryManager.BATTERY_STATUS_FULL
  }

  fun register() {
    if (!receiverRegistered) {
      val filter = IntentFilter().apply {
        addAction(Intent.ACTION_BATTERY_CHANGED)
      }
      reactContext.registerReceiver(batteryReceiver, filter)
      receiverRegistered = true
    }
  }

  fun unregister() {
    if (receiverRegistered) {
      try {
        reactContext.unregisterReceiver(batteryReceiver)
      } catch (_: Exception) {}
      receiverRegistered = false
    }
  }
}
