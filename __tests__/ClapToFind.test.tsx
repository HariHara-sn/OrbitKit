import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useTorch } from '../src/features/flashlight/hooks/useTorch';
import { clapService } from '../src/features/flashlight/services/clapService';
import { flashlightService } from '../src/features/flashlight/services/flashlightService';
import { SettingsProvider, useSettings } from '../src/app/providers/SettingsProvider';
import { SettingsScreen } from '../src/features/flashlight/screens/SettingsScreen';

describe('Clap to Find Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('turns torch ON on 2 claps and OFF on 1 clap', async () => {
    let clapTurnOnCb: (() => void) | null = null;
    let clapTurnOffCb: (() => void) | null = null;
    const startListeningSpy = jest.spyOn(clapService, 'startListening').mockResolvedValue(true);
    const stopListeningSpy = jest.spyOn(clapService, 'stopListening').mockResolvedValue(true);
    const setTorchStateSpy = jest.spyOn(clapService, 'setTorchState').mockImplementation(() => {});
    const onClapTurnOnSpy = jest.spyOn(clapService, 'onClapTurnOn').mockImplementation((cb) => {
      clapTurnOnCb = cb;
      return () => {};
    });
    const onClapTurnOffSpy = jest.spyOn(clapService, 'onClapTurnOff').mockImplementation((cb) => {
      clapTurnOffCb = cb;
      return () => {};
    });
    const setTorchModeSpy = jest.spyOn(flashlightService, 'setTorchMode').mockResolvedValue(true);

    let hookResult: any;
    const TestComponent = ({ clapToFind }: { clapToFind: boolean }) => {
      hookResult = useTorch({
        automaticOn: false,
        automaticOff: false,
        automaticOffTimer: 0,
        powerControl: false,
        clapToFind,
      });
      return null;
    };

    let renderer: any;
    await act(async () => {
      renderer = ReactTestRenderer.create(<TestComponent clapToFind={true} />);
    });

    expect(startListeningSpy).toHaveBeenCalled();
    expect(onClapTurnOnSpy).toHaveBeenCalled();
    expect(onClapTurnOffSpy).toHaveBeenCalled();
    expect(hookResult.isOn).toBe(false);

    // Trigger turn ON event (2 claps detected)
    await act(async () => {
      clapTurnOnCb?.();
    });

    expect(setTorchModeSpy).toHaveBeenCalledWith(true);
    expect(hookResult.isOn).toBe(true);
    expect(setTorchStateSpy).toHaveBeenCalledWith(true);

    // Trigger turn OFF event (1 clap detected)
    await act(async () => {
      clapTurnOffCb?.();
    });

    expect(setTorchModeSpy).toHaveBeenCalledWith(false);
    expect(hookResult.isOn).toBe(false);
    expect(setTorchStateSpy).toHaveBeenCalledWith(false);

    // Disable clap to find
    await act(async () => {
      renderer.update(<TestComponent clapToFind={false} />);
    });

    expect(stopListeningSpy).toHaveBeenCalled();

    startListeningSpy.mockRestore();
    stopListeningSpy.mockRestore();
    setTorchStateSpy.mockRestore();
    onClapTurnOnSpy.mockRestore();
    onClapTurnOffSpy.mockRestore();
    setTorchModeSpy.mockRestore();
  });

  it('renders Clap to find in SettingsScreen and toggles state', () => {
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

    expect(settingsContext.settings.clapToFind).toBe(false);

    act(() => {
      settingsContext.setSetting('clapToFind', true);
    });

    expect(settingsContext.settings.clapToFind).toBe(true);
  });
});
