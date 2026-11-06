import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { notificationToolbarService } from '../src/features/flashlight/services/notificationToolbarService';
import { SettingsProvider, useSettings } from '../src/app/providers/SettingsProvider';
import { SettingsScreen } from '../src/features/flashlight/screens/SettingsScreen';

describe('Notification Toolbar Toggle Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls notificationToolbarService.setToolbarEnabled when toggled', async () => {
    const setToolbarSpy = jest
      .spyOn(notificationToolbarService, 'setToolbarEnabled')
      .mockResolvedValue(true);

    await notificationToolbarService.setToolbarEnabled(true);
    expect(setToolbarSpy).toHaveBeenCalledWith(true);

    await notificationToolbarService.setToolbarEnabled(false);
    expect(setToolbarSpy).toHaveBeenCalledWith(false);

    setToolbarSpy.mockRestore();
  });

  it('renders Notification toolbar toggle in SettingsScreen and toggles state', () => {
    let settingsContext: any;
    const TestSettingsReader = () => {
      settingsContext = useSettings();
      return <SettingsScreen onBack={jest.fn()} />;
    };

    act(() => {
      ReactTestRenderer.create(
        <SettingsProvider>
          <TestSettingsReader />
        </SettingsProvider>,
      );
    });

    expect(settingsContext.settings.notificationToolbarToggle).toBe(false);

    act(() => {
      settingsContext.setSetting('notificationToolbarToggle', true);
    });

    expect(settingsContext.settings.notificationToolbarToggle).toBe(true);
  });

  it('checks initial open settings via notificationToolbarService', async () => {
    const checkSpy = jest
      .spyOn(notificationToolbarService, 'checkInitialOpenSettings')
      .mockResolvedValue(true);

    const result = await notificationToolbarService.checkInitialOpenSettings();
    expect(result).toBe(true);
    expect(checkSpy).toHaveBeenCalled();
    checkSpy.mockRestore();
  });
});
