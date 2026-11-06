import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useTorch } from '../src/features/flashlight/hooks/useTorch';
import { flashlightService } from '../src/features/flashlight/services/flashlightService';
import { SettingsProvider, useSettings } from '../src/app/providers/SettingsProvider';
import { SettingsScreen } from '../src/features/flashlight/screens/SettingsScreen';

describe('Automatic On Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('turns flashlight on at startup when automaticOn is true', async () => {
    const setTorchModeSpy = jest
      .spyOn(flashlightService, 'setTorchMode')
      .mockResolvedValue(true);

    let hookResult: any;
    const TestComponent = () => {
      hookResult = useTorch({
        automaticOn: true,
        automaticOff: false,
        automaticOffTimer: 0,
        powerControl: false,
      });
      return null;
    };

    await act(async () => {
      ReactTestRenderer.create(<TestComponent />);
    });

    expect(setTorchModeSpy).toHaveBeenCalledWith(true);
    expect(hookResult.isOn).toBe(true);
    setTorchModeSpy.mockRestore();
  });

  it('keeps flashlight off at startup when automaticOn is false', async () => {
    const setTorchModeSpy = jest
      .spyOn(flashlightService, 'setTorchMode')
      .mockResolvedValue(true);

    let hookResult: any;
    const TestComponent = () => {
      hookResult = useTorch({
        automaticOn: false,
        automaticOff: false,
        automaticOffTimer: 0,
        powerControl: false,
      });
      return null;
    };

    await act(async () => {
      ReactTestRenderer.create(<TestComponent />);
    });

    expect(setTorchModeSpy).not.toHaveBeenCalled();
    expect(hookResult.isOn).toBe(false);
    setTorchModeSpy.mockRestore();
  });

  it('renders Automatic on in SettingsScreen and toggles state', () => {
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

    expect(settingsContext.settings.automaticOn).toBe(false);

    act(() => {
      settingsContext.setSetting('automaticOn', true);
    });

    expect(settingsContext.settings.automaticOn).toBe(true);
  });
});
