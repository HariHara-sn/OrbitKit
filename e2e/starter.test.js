describe('Flashlight E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

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
