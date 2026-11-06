describe('Flashlight & Power Control E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  describe('Torch Controls', () => {
    it('should display the torch screen in initial OFF state', async () => {
      await expect(element(by.id('torch-toggle-button'))).toBeVisible();
      await expect(element(by.id('torch-status-text'))).toHaveText('Tap to turn on');
    });

    it('should turn the torch ON when tapped', async () => {
      await element(by.id('torch-toggle-button')).tap();
      await expect(element(by.id('torch-status-text'))).toHaveText('Torch is ON');
    });

    it('should turn the torch OFF when tapped again', async () => {
      await element(by.id('torch-toggle-button')).tap();
      await expect(element(by.id('torch-status-text'))).toHaveText('Tap to turn on');
    });
  });

  describe('SettingsScreen & Power Control', () => {
    it('should navigate to SettingsScreen when settings icon is tapped', async () => {
      await expect(element(by.id('settings-header-button'))).toBeVisible();
      await element(by.id('settings-header-button')).tap();
      await expect(element(by.id('settings-back-button'))).toBeVisible();
    });

    it('should toggle Power Control and display "How Power Control works" documentation', async () => {
      // Find and toggle Power Control switch ON
      await expect(element(by.id('setting-power-control-switch'))).toBeVisible();
      await element(by.id('setting-power-control-switch')).tap();

      // Verify that the documentation card appears
      await expect(element(by.id('power-control-doc'))).toExist();
      await expect(element(by.id('power-control-doc'))).toBeVisible(25);
    });

    it('should toggle Power Control OFF and hide documentation', async () => {
      // Toggle Power Control switch OFF
      await element(by.id('setting-power-control-switch')).tap();

      // Verify that the documentation card disappears
      await expect(element(by.id('power-control-doc'))).not.toExist();
    });

    it('should toggle Automatic on switch in SettingsScreen', async () => {
      await expect(element(by.id('setting-automatic-on-switch'))).toBeVisible();
      await element(by.id('setting-automatic-on-switch')).tap();
      await element(by.id('setting-automatic-on-switch')).tap();
    });

    it('should toggle Flashlight stay on switch in SettingsScreen', async () => {
      await expect(element(by.id('setting-flashlight-stay-on-switch'))).toBeVisible();
      await element(by.id('setting-flashlight-stay-on-switch')).tap();
      await element(by.id('setting-flashlight-stay-on-switch')).tap();
    });

    it('should toggle Shake to switch switch in SettingsScreen', async () => {
      await expect(element(by.id('setting-shake-to-switch-switch'))).toBeVisible();
      await element(by.id('setting-shake-to-switch-switch')).tap();
      await element(by.id('setting-shake-to-switch-switch')).tap();
    });

    it('should toggle Notification toolbar switch in SettingsScreen', async () => {
      await expect(element(by.id('setting-notification-toolbar-switch'))).toBeVisible();
      await element(by.id('setting-notification-toolbar-switch')).tap();
      await element(by.id('setting-notification-toolbar-switch')).tap();
    });

    it('should scroll and toggle Clap to find switch in SettingsScreen', async () => {
      await waitFor(element(by.id('setting-clap-to-find-switch')))
        .toBeVisible()
        .whileElement(by.id('settings-scroll'))
        .scroll(150, 'down');
      await element(by.id('setting-clap-to-find-switch')).tap();
      await element(by.id('setting-clap-to-find-switch')).tap();
    });

    it('should navigate back to Torch screen when back button is pressed', async () => {
      await element(by.id('settings-back-button')).tap();
      await expect(element(by.id('torch-toggle-button'))).toBeVisible();
      await expect(element(by.id('torch-status-text'))).toBeVisible();
    });
  });

  describe('ExitAppModal Controls', () => {
    it('should open ExitAppModal when hardware back is pressed on Torch tab', async () => {
      await device.pressBack();
      await expect(element(by.text('Leave the App?'))).toBeVisible();
      await expect(element(by.text('Stay'))).toBeVisible();
      await expect(element(by.text('Leave'))).toBeVisible();
    });

    it('should close ExitAppModal when hardware back is pressed again', async () => {
      await device.pressBack();
      await expect(element(by.text('Leave the App?'))).not.toBeVisible();
      await expect(element(by.id('torch-toggle-button'))).toBeVisible();
    });

    it('should open ExitAppModal and close when Stay button is pressed', async () => {
      await device.pressBack();
      await expect(element(by.text('Leave the App?'))).toBeVisible();
      await element(by.text('Stay')).tap();
      await expect(element(by.text('Leave the App?'))).not.toBeVisible();
      await expect(element(by.id('torch-toggle-button'))).toBeVisible();
    });
  });
});
