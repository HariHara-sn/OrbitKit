import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { LowBatteryWarningBanner } from '../src/features/flashlight/components/LowBatteryWarningBanner';
import { SettingsProvider } from '../src/app/providers/SettingsProvider';

describe('LowBatteryWarningBanner (ExitAppModal-style UI/UX)', () => {
  it('renders nothing when visible is false', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <LowBatteryWarningBanner
            visible={false}
            batteryLevel={0.08}
          />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text);
    expect(texts.length).toBe(0);
  });

  it('renders floating banner and modal with warning content when visible at 8% battery', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <LowBatteryWarningBanner
            visible={true}
            batteryLevel={0.08}
            onOpenSettings={jest.fn()}
          />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    // Modal title & body
    expect(texts).toContain('Low Battery Warning (8%)');
    expect(texts).toContain('Got it');
    expect(texts).toContain('Settings');
  });

  it('renders dimmed warning details when battery is at 4%', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <LowBatteryWarningBanner
            visible={true}
            batteryLevel={0.04}
          />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).toContain('Battery Very Low (4%)');
  });

  it('renders critical cutoff warning details when battery is at 1%', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <LowBatteryWarningBanner
            visible={true}
            batteryLevel={0.01}
          />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).toContain('Critical Battery (1%)');
  });
});
