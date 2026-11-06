package com.flashlightapp.modules.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class NotificationToggleReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == NotificationHelper.ACTION_TOGGLE) {
      NotificationHelper.toggleTorch(context)
    }
  }
}
