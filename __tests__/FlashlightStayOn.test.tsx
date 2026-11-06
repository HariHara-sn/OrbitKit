import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { useTorch } from '../src/features/flashlight/hooks/useTorch';
import { flashlightService } from '../src/features/flashlight/services/flashlightService';
import { SettingsProvider, useSettings } from '../src/app/providers/SettingsProvider';
import { SettingsScreen } from '../src/features/flashlight/screens/SettingsScreen';

describe('Flashlight Stay On Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('syncs flashlightStayOn state to native module via flashlightService', () => {
    const setStayOnSpy = jest.spyOn(flashlightService, 'setFlashlightStayOn').mockImplementation(() => {});

    let hookResult: any;
    const TestComponent = ({ stayOn }: { stayOn: boolean }) => {
      hookResult = useTorch({
        automaticOn: false,
        automaticOff: false,
        automaticOffTimer: 0,
        powerControl: false,
        flashlightStayOn: stayOn,
      });
      return null;
    };

    let renderer: any;
    act(() => {
      renderer = ReactTestRenderer.create(<TestComponent stayOn={false} />);
    });

    expect(setStayOnSpy).toHaveBeenCalledWith(false);

    act(() => {
      renderer.update(<TestComponent stayOn={true} />);
    });

    expect(setStayOnSpy).toHaveBeenCalledWith(true);
    setStayOnSpy.mockRestore();
  });

  it('renders Flashlight stay on in SettingsScreen and toggles state', () => {
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

    expect(settingsContext.settings.flashlightStayOn).toBe(false);

    act(() => {
      settingsContext.setSetting('flashlightStayOn', true);
    });

    expect(settingsContext.settings.flashlightStayOn).toBe(true);
  });
});
