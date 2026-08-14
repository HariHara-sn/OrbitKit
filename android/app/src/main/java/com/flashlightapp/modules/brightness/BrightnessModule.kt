package com.flashlightapp.modules.brightness

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BrightnessModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  override fun getName(): String = "BrightnessModule"

  private fun currentActivity() = reactContext.currentActivity

  @ReactMethod
  fun setBrightness(brightness: Float) {
    val activity = currentActivity() ?: return
    activity.runOnUiThread {
      val window = activity.window
      window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
      val params = window.attributes
      params.screenBrightness = brightness.coerceIn(0f, 1f)
      window.attributes = params
    }
  }

  @ReactMethod
  fun resetBrightness() {
    val activity = currentActivity() ?: return
    activity.runOnUiThread {
      val window = activity.window
      window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
      val params = window.attributes
      params.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
      window.attributes = params
    }
  }
}
