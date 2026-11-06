package com.flashlightapp.modules.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import com.flashlightapp.MainActivity
import com.flashlightapp.R

object NotificationHelper {
  const val CHANNEL_ID = "flashlight_toolbar_channel"
  const val NOTIFICATION_ID = 1001
  const val ACTION_TOGGLE = "com.flashlightapp.ACTION_NOTIFICATION_TOGGLE"

  private const val PREFS_NAME = "flashlight_settings"
  private const val KEY_TOOLBAR_ENABLED = "notificationToolbarToggle"
  private const val KEY_TORCH_STATE = "torch_state_on"

  fun isToolbarEnabled(context: Context): Boolean {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val appSettings = prefs.getString("app_settings", null)
    if (appSettings != null && appSettings.contains("\"notificationToolbarToggle\":true")) {
      return true
    }
    return prefs.getBoolean(KEY_TOOLBAR_ENABLED, false)
  }

  fun setToolbarEnabled(context: Context, enabled: Boolean) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putBoolean(KEY_TOOLBAR_ENABLED, enabled).apply()
    if (enabled) {
      updateNotification(context, isHardwareTorchOn(context))
    } else {
      cancelNotification(context)
    }
  }

  fun isHardwareTorchOn(context: Context): Boolean {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    return prefs.getBoolean(KEY_TORCH_STATE, false)
  }

  fun setHardwareTorchState(context: Context, isOn: Boolean) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putBoolean(KEY_TORCH_STATE, isOn).apply()
    if (isToolbarEnabled(context)) {
      updateNotification(context, isOn)
    }
  }

  private fun getCameraId(cameraManager: CameraManager): String? {
    return cameraManager.cameraIdList.firstOrNull { id ->
      cameraManager.getCameraCharacteristics(id)
        .get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
    }
  }

  fun toggleTorch(context: Context) {
    try {
      val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = getCameraId(cameraManager) ?: return
      val currentState = isHardwareTorchOn(context)
      val newState = !currentState

      cameraManager.setTorchMode(cameraId, newState)
      setHardwareTorchState(context, newState)
    } catch (_: Exception) {}
  }

  fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      val existing = manager.getNotificationChannel(CHANNEL_ID)
      if (existing == null) {
        val channel = NotificationChannel(
          CHANNEL_ID,
          "Flashlight Quick Toolbar",
          NotificationManager.IMPORTANCE_LOW
        ).apply {
          description = "Quick toggle shortcut for flashlight in notification shade and lock screen"
          setShowBadge(false)
          lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
          setSound(null, null)
          enableVibration(false)
        }
        manager.createNotificationChannel(channel)
      }
    }
  }

  fun updateNotification(context: Context, isTorchOn: Boolean) {
    if (!isToolbarEnabled(context)) return

    createNotificationChannel(context)

    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    // Content Intent: Opens MainActivity
    val contentIntent = Intent(context, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    val contentPendingIntent = PendingIntent.getActivity(
      context,
      0,
      contentIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    // Action Intent: Toggles torch
    val toggleIntent = Intent(context, NotificationToggleReceiver::class.java).apply {
      action = ACTION_TOGGLE
    }
    val togglePendingIntent = PendingIntent.getBroadcast(
      context,
      1,
      toggleIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    // Settings Intent: Opens Settings in app
    val settingsIntent = Intent(context, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
      action = "com.flashlightapp.OPEN_SETTINGS"
      putExtra("open_settings", true)
    }
    val settingsPendingIntent = PendingIntent.getActivity(
      context,
      2,
      settingsIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    // Collapsed View
    val collapsedView = RemoteViews(context.packageName, R.layout.notification_collapsed).apply {
      setTextViewText(R.id.tv_collapsed_title, "Flashlight")
      setTextViewText(
        R.id.tv_collapsed_subtitle,
        if (isTorchOn) "Torch is ON • Tap to turn off" else "Torch is OFF • Tap to turn on"
      )
      setOnClickPendingIntent(R.id.notif_collapsed_root, togglePendingIntent)
    }

    // Expanded View
    val expandedView = RemoteViews(context.packageName, R.layout.notification_expanded).apply {
      setTextViewText(
        R.id.tv_expanded_title,
        if (isTorchOn) "Flashlight is ON" else "Flashlight is OFF"
      )
      setImageViewResource(
        R.id.dot_status_indicator,
        if (isTorchOn) R.drawable.ic_dot_glowing_yellow else R.drawable.ic_dot_gray
      )
      setTextViewText(
        R.id.tv_expanded_subtitle,
        if (isTorchOn) "Tap to turn off the flashlight" else "Tap to turn on the flashlight"
      )
      setImageViewResource(
        R.id.ic_expanded_action,
        if (isTorchOn) R.drawable.ic_notif_power else R.drawable.ic_notif_power_white
      )
      setTextViewText(
        R.id.tv_expanded_action,
        if (isTorchOn) "Turn Off" else "Turn On"
      )
      setTextColor(
        R.id.tv_expanded_action,
        if (isTorchOn) 0xFF000000.toInt() else 0xFFFFFFFF.toInt()
      )
      setInt(
        R.id.btn_expanded_action,
        "setBackgroundResource",
        if (isTorchOn) R.drawable.bg_notif_btn_primary_on else R.drawable.bg_notif_btn_primary_off
      )
      setOnClickPendingIntent(R.id.btn_expanded_action, togglePendingIntent)
      setOnClickPendingIntent(R.id.btn_expanded_settings, settingsPendingIntent)
      setOnClickPendingIntent(R.id.notif_expanded_root, contentPendingIntent)
    }

    val fallbackTitle = if (isTorchOn) "Flashlight is ON" else "Flashlight is OFF"
    val fallbackText = if (isTorchOn) "Tap to turn off the flashlight" else "Tap to turn on the flashlight"

    val notification = NotificationCompat.Builder(context, CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_notif_torch)
      .setContentTitle(fallbackTitle)
      .setContentText(fallbackText)
      .setCustomContentView(collapsedView)
      .setCustomBigContentView(expandedView)
      .setStyle(NotificationCompat.DecoratedCustomViewStyle())
      .setContentIntent(contentPendingIntent)
      .setOngoing(true)
      .setAutoCancel(false)
      .setOnlyAlertOnce(true)
      .setShowWhen(false)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .build()

    manager.notify(NOTIFICATION_ID, notification)
  }

  fun cancelNotification(context: Context) {
    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.cancel(NOTIFICATION_ID)
  }
}
