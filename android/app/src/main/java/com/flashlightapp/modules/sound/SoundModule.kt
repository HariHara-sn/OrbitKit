package com.flashlightapp.modules.sound

import android.media.AudioAttributes
import android.media.AudioManager
import android.media.ToneGenerator
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SoundModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  override fun getName(): String = "SoundModule"

  private var toneGenerator: ToneGenerator? = null

  private fun getToneGenerator(): ToneGenerator {
    if (toneGenerator == null) {
      toneGenerator = ToneGenerator(
        AudioManager.STREAM_NOTIFICATION,
        80
      )
    }
    return toneGenerator!!
  }

  @ReactMethod
  fun playToggleOn(promise: Promise) {
    try {
      val tg = getToneGenerator()
      tg.startTone(ToneGenerator.TONE_PROP_ACK, 120)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("SOUND_ERROR", e.message ?: "Failed to play sound", e)
    }
  }

  @ReactMethod
  fun playToggleOff(promise: Promise) {
    try {
      val tg = getToneGenerator()
      tg.startTone(ToneGenerator.TONE_PROP_BEEP, 80)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("SOUND_ERROR", e.message ?: "Failed to play sound", e)
    }
  }

  @ReactMethod
  fun playClick(promise: Promise) {
    try {
      val tg = getToneGenerator()
      tg.startTone(ToneGenerator.TONE_PROP_BEEP2, 50)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("SOUND_ERROR", e.message ?: "Failed to play sound", e)
    }
  }

  fun cleanup() {
    toneGenerator?.release()
    toneGenerator = null
  }
}
