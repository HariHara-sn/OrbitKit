/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../src/App';
import { MorseScreen } from '../src/features/flashlight/screens/MorseScreen';

test('renders Morse screen UI', () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  act(() => {
    tree = ReactTestRenderer.create(<MorseScreen />);
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
