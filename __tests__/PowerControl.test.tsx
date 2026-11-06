import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SettingsScreen } from '../src/features/flashlight/screens/SettingsScreen';
import { SettingsProvider, useSettings } from '../src/app/providers/SettingsProvider';
import {
  BATTERY_WARN,
  BATTERY_DIM,
  BATTERY_CUTOFF,
  DIM_BRIGHTNESS,
} from '../src/core/constants';

describe('Power Control Specification and SettingsScreen', () => {
  it('has correct power control threshold constants matching documentation', () => {
    // 10% for warning banner
    expect(BATTERY_WARN).toBe(0.10);
    // 5% for auto-dimming
    expect(BATTERY_DIM).toBe(0.05);
    // 3% for auto-cutoff
    expect(BATTERY_CUTOFF).toBe(0.03);
    // Dims to 50%
    expect(DIM_BRIGHTNESS).toBe(0.5);
  });

  it('renders Power Control documentation when enabled in SettingsScreen', () => {
    const TestComponent = () => {
      const { setSetting } = useSettings();
      React.useEffect(() => {
        setSetting('powerControl', true);
      }, [setSetting]);
      return <SettingsScreen onBack={jest.fn()} />;
    };

    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <TestComponent />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);

    // Verify documentation header
    expect(texts).toContain('📋 How Power Control works');

    // Verify all 4 bullet points are present in the documentation
    const docBody = texts.find(
      t => typeof t === 'string' && t.includes('Monitors battery level in the background'),
    ) as string;

    expect(docBody).toBeDefined();
    expect(docBody).toContain('• Monitors battery level in the background.');
    expect(docBody).toContain('• Shows a warning banner when battery drops below 10%.');
    expect(docBody).toContain('• Automatically dims the torch at 5% to preserve charge.');
    expect(docBody).toContain('• Turns the flashlight off at 3% to protect the battery.');
  });

  it('hides Power Control documentation when disabled in SettingsScreen', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <SettingsScreen onBack={jest.fn()} />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).not.toContain('📋 How Power Control works');
  });
});
