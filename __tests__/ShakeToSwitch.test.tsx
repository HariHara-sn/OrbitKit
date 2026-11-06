import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useTorch } from '../src/features/flashlight/hooks/useTorch';
import { shakeService } from '../src/features/flashlight/services/shakeService';
import { flashlightService } from '../src/features/flashlight/services/flashlightService';
import { SettingsProvider, useSettings } from '../src/app/providers/SettingsProvider';
import { SettingsScreen } from '../src/features/flashlight/screens/SettingsScreen';

describe('Shake to Switch Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts watching accelerometer when shakeToSwitch is enabled and toggles torch on shake', async () => {
    let shakeCallback: (() => void) | null = null;
    const startWatchingSpy = jest.spyOn(shakeService, 'startWatching').mockImplementation(() => {});
    const stopWatchingSpy = jest.spyOn(shakeService, 'stopWatching').mockImplementation(() => {});
    const onShakeSpy = jest.spyOn(shakeService, 'onShake').mockImplementation((cb) => {
      shakeCallback = cb;
      return () => {};
    });
    const setTorchModeSpy = jest.spyOn(flashlightService, 'setTorchMode').mockResolvedValue(true);

    let hookResult: any;
    const TestComponent = ({ shakeToSwitch }: { shakeToSwitch: boolean }) => {
      hookResult = useTorch({
        automaticOn: false,
        automaticOff: false,
        automaticOffTimer: 0,
        powerControl: false,
        shakeToSwitch,
      });
      return null;
    };

    let renderer: any;
    await act(async () => {
      renderer = ReactTestRenderer.create(<TestComponent shakeToSwitch={true} />);
    });

    expect(startWatchingSpy).toHaveBeenCalled();
    expect(onShakeSpy).toHaveBeenCalled();
    expect(hookResult.isOn).toBe(false);

    // Simulate shake event
    await act(async () => {
      shakeCallback?.();
    });

    expect(setTorchModeSpy).toHaveBeenCalledWith(true);
    expect(hookResult.isOn).toBe(true);

    // Toggle off when shakeToSwitch disabled
    await act(async () => {
      renderer.update(<TestComponent shakeToSwitch={false} />);
    });

    expect(stopWatchingSpy).toHaveBeenCalled();

    startWatchingSpy.mockRestore();
    stopWatchingSpy.mockRestore();
    onShakeSpy.mockRestore();
    setTorchModeSpy.mockRestore();
  });

  it('renders Shake to switch in SettingsScreen and toggles state', () => {
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

    expect(settingsContext.settings.shakeToSwitch).toBe(false);

    act(() => {
      settingsContext.setSetting('shakeToSwitch', true);
    });

    expect(settingsContext.settings.shakeToSwitch).toBe(true);
  });
});
