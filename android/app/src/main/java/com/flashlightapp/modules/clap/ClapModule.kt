package com.flashlightapp.modules.clap

import android.Manifest
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.math.abs

class ClapModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule() {

  override fun getName(): String = "ClapModule"

  private var audioRecord: AudioRecord? = null
  private var isListening = false
  private var recordingThread: Thread? = null

  private var isTorchOn = false
  private var lastClapTime = 0L
  private var lastTriggerTime = 0L

  companion object {
    private const val SAMPLE_RATE = 16000
    private const val CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO
    private const val AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT
    // Amplitude threshold for a sharp clap sound (16-bit PCM max is 32767)
    private const val CLAP_AMPLITUDE_THRESHOLD = 17000
    // Time window between first clap and second clap when turning ON (ms)
    private const val MIN_CLAP_INTERVAL_MS = 150L
    private const val MAX_CLAP_INTERVAL_MS = 1200L
    // Cooldown after trigger before listening again (ms)
    private const val TRIGGER_COOLDOWN_MS = 1200L
  }

  @ReactMethod
  fun setTorchState(isOn: Boolean) {
    isTorchOn = isOn
    lastClapTime = 0L
  }

  @ReactMethod
  fun startListening(promise: Promise) {
    if (isListening) {
      promise.resolve(true)
      return
    }

    if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECORD_AUDIO)
      != PackageManager.PERMISSION_GRANTED
    ) {
      promise.reject("PERMISSION_DENIED", "RECORD_AUDIO permission is not granted")
      return
    }

    val minBufSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT)
    val bufferSize = if (minBufSize > 0) minBufSize * 2 else 4096

    try {
      audioRecord = AudioRecord(
        MediaRecorder.AudioSource.MIC,
        SAMPLE_RATE,
        CHANNEL_CONFIG,
        AUDIO_FORMAT,
        bufferSize
      )

      if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
        audioRecord?.release()
        audioRecord = null
        promise.reject("AUDIO_ERROR", "Failed to initialize AudioRecord")
        return
      }

      audioRecord?.startRecording()
      isListening = true

      recordingThread = Thread({
        processAudio()
      }, "ClapDetectorThread").apply { start() }

      promise.resolve(true)
    } catch (e: Exception) {
      audioRecord?.release()
      audioRecord = null
      isListening = false
      promise.reject("AUDIO_ERROR", e.message ?: "Failed to start AudioRecord", e)
    }
  }

  private fun processAudio() {
    val buffer = ShortArray(512)
    while (isListening) {
      val record = audioRecord ?: break
      val readCount = record.read(buffer, 0, buffer.size)
      if (readCount <= 0) continue

      var maxAmp = 0
      for (i in 0 until readCount) {
        val amp = abs(buffer[i].toInt())
        if (amp > maxAmp) {
          maxAmp = amp
        }
      }

      if (maxAmp >= CLAP_AMPLITUDE_THRESHOLD) {
        val now = System.currentTimeMillis()
        if (now - lastTriggerTime < TRIGGER_COOLDOWN_MS) {
          continue
        }

        if (isTorchOn) {
          // When torch is ON: 1 clap turns it OFF
          lastTriggerTime = now
          lastClapTime = 0L

          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("clapTurnOff", null)

          try {
            Thread.sleep(TRIGGER_COOLDOWN_MS)
          } catch (_: InterruptedException) {
            break
          }
        } else {
          // When torch is OFF: 2 claps turn it ON
          if (lastClapTime == 0L) {
            // First clap registered
            lastClapTime = now
            try {
              Thread.sleep(120) // Echo dissipation pause
            } catch (_: InterruptedException) {
              break
            }
          } else {
            val diff = now - lastClapTime
            if (diff in MIN_CLAP_INTERVAL_MS..MAX_CLAP_INTERVAL_MS) {
              // Second clap within 150ms-1200ms -> Turn ON!
              lastClapTime = 0L
              lastTriggerTime = now

              reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("clapTurnOn", null)

              try {
                Thread.sleep(TRIGGER_COOLDOWN_MS)
              } catch (_: InterruptedException) {
                break
              }
            } else if (diff > MAX_CLAP_INTERVAL_MS) {
              // Expired, mark this as the new first clap
              lastClapTime = now
              try {
                Thread.sleep(120)
              } catch (_: InterruptedException) {
                break
              }
            }
          }
        }
      } else {
        val now = System.currentTimeMillis()
        if (!isTorchOn && lastClapTime > 0L && (now - lastClapTime > MAX_CLAP_INTERVAL_MS)) {
          lastClapTime = 0L
        }
      }
    }
  }

  @ReactMethod
  fun stopListening(promise: Promise) {
    isListening = false
    try {
      recordingThread?.interrupt()
      recordingThread = null
      audioRecord?.stop()
      audioRecord?.release()
      audioRecord = null
      lastClapTime = 0L
      promise.resolve(true)
    } catch (e: Exception) {
      promise.resolve(false)
    }
  }

  @ReactMethod
  fun simulateClap() {
    if (isTorchOn) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("clapTurnOff", null)
    } else {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("clapTurnOn", null)
    }
  }

  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}

  override fun invalidate() {
    super.invalidate()
    isListening = false
    try {
      recordingThread?.interrupt()
      audioRecord?.stop()
      audioRecord?.release()
    } catch (_: Exception) {}
  }
}
