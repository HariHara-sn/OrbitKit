/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../src/App';
import { MorseScreen } from '../src/features/flashlight/screens/MorseScreen';
import { SettingsProvider } from '../src/app/providers/SettingsProvider';

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children, ...props }: any) => React.createElement('View', props, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 0, height: 0 }),
  };
});

test('renders Morse screen UI', () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(
      <SettingsProvider>
        <MorseScreen />
      </SettingsProvider>,
    );
  });

  const labels = tree!.root
    .findAllByType(Text)
    .map(node => node.props.children);
  expect(labels).toContain('TEXT TO MORSE');
  expect(labels).toContain('4. MORSE REFERENCE');
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
