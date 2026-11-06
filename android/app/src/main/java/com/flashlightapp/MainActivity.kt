package com.flashlightapp

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.flashlightapp.modules.notification.NotificationToolbarModule

class MainActivity : ReactActivity() {

  companion object {
    @Volatile
    var initialOpenSettings: Boolean = false
  }

  override fun getMainComponentName(): String = "FlashlightApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleOpenSettingsIntent(intent)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent)
    handleOpenSettingsIntent(intent)
  }

  private fun handleOpenSettingsIntent(intent: Intent?) {
    val shouldOpen = intent?.getBooleanExtra("open_settings", false) == true ||
                     intent?.action == "com.flashlightapp.OPEN_SETTINGS"
    if (shouldOpen) {
      initialOpenSettings = true
      NotificationToolbarModule.emitOpenSettings()
    }
  }
}
