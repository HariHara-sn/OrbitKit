package com.flashlightapp.modules.shake

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.math.sqrt

class ShakeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(), SensorEventListener {

  override fun getName(): String = "ShakeModule"

  private var sensorManager: SensorManager? = null
  private var accelerometer: Sensor? = null
  private var isListening = false

  private var lastTriggerTimestamp = 0L
  private var lastPeakTimestamp = 0L
  private var firstPeakTimestamp = 0L
  private var peakCount = 0

  private val gravity = FloatArray(3) { 0f }
  private var hasGravity = false

  companion object {
    // Dynamic acceleration threshold in m/s^2 (excluding gravity)
    // 13.5 m/s^2 requires a firm, intentional shake
    private const val LINEAR_ACCEL_THRESHOLD = 13.5f

    // Minimum time between peaks to avoid double-counting the same stroke (ms)
    private const val MIN_PEAK_INTERVAL_MS = 100L

    // Maximum window to collect the required peaks (ms)
    private const val SHAKE_WINDOW_MS = 750L

    // Number of acceleration peaks required to qualify as a deliberate shake (avoids drops/tilts)
    private const val REQUIRED_PEAKS = 3

    // Cooldown after a shake triggers before another can be detected (ms)
    private const val TRIGGER_COOLDOWN_MS = 1000L

    // Low-pass filter smoothing factor for gravity estimation
    private const val ALPHA = 0.8f
  }

  @ReactMethod
  fun startWatching() {
    if (isListening) return
    if (sensorManager == null) {
      sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
      accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }
    accelerometer?.let {
      sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
      isListening = true
      hasGravity = false
      peakCount = 0
    }
  }

  @ReactMethod
  fun stopWatching() {
    if (!isListening) return
    sensorManager?.unregisterListener(this)
    isListening = false
    hasGravity = false
    peakCount = 0
  }

  @ReactMethod
  fun simulateShake() {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("shakeDetected", null)
  }

  override fun onSensorChanged(event: SensorEvent?) {
    if (event == null || event.sensor.type != Sensor.TYPE_ACCELEROMETER) return

    val now = System.currentTimeMillis()
    if (now - lastTriggerTimestamp < TRIGGER_COOLDOWN_MS) {
      return
    }

    val x = event.values[0]
    val y = event.values[1]
    val z = event.values[2]

    if (!hasGravity) {
      gravity[0] = x
      gravity[1] = y
      gravity[2] = z
      hasGravity = true
      return
    }

    // Isolate gravity using low-pass filter
    gravity[0] = ALPHA * gravity[0] + (1 - ALPHA) * x
    gravity[1] = ALPHA * gravity[1] + (1 - ALPHA) * y
    gravity[2] = ALPHA * gravity[2] + (1 - ALPHA) * z

    // Linear acceleration (high-pass filter removing gravity)
    val linearX = x - gravity[0]
    val linearY = y - gravity[1]
    val linearZ = z - gravity[2]

    val linearAccel = sqrt((linearX * linearX + linearY * linearY + linearZ * linearZ).toDouble()).toFloat()

    if (linearAccel > LINEAR_ACCEL_THRESHOLD) {
      if (now - lastPeakTimestamp < MIN_PEAK_INTERVAL_MS) {
        // Same stroke peak, ignore
        return
      }

      if (peakCount == 0 || (now - firstPeakTimestamp > SHAKE_WINDOW_MS)) {
        // First peak of a new shake gesture
        peakCount = 1
        firstPeakTimestamp = now
        lastPeakTimestamp = now
      } else {
        // Subsequent peak within the active window
        peakCount++
        lastPeakTimestamp = now

        if (peakCount >= REQUIRED_PEAKS) {
          // Deliberate multi-peak shake detected!
          lastTriggerTimestamp = now
          peakCount = 0
          firstPeakTimestamp = 0L
          lastPeakTimestamp = 0L

          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("shakeDetected", null)
        }
      }
    } else {
      // Check if time window expired without reaching REQUIRED_PEAKS
      if (peakCount > 0 && (now - firstPeakTimestamp > SHAKE_WINDOW_MS)) {
        peakCount = 0
        firstPeakTimestamp = 0L
        lastPeakTimestamp = 0L
      }
    }
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}

  override fun invalidate() {
    super.invalidate()
    stopWatching()
  }
}
