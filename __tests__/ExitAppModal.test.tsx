import React from 'react';
import { Modal, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ExitAppModal } from '../src/features/flashlight/components/ExitAppModal';
import { SettingsProvider } from '../src/app/providers/SettingsProvider';

describe('ExitAppModal', () => {
  it('renders modal content when visible', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <ExitAppModal visible={true} onCancel={jest.fn()} onConfirmExit={jest.fn()} />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).toContain('Leave the App?');
    expect(texts).toContain('Stay');
    expect(texts).toContain('Leave');
  });

  it('does not render when visible is false', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <ExitAppModal visible={false} onCancel={jest.fn()} onConfirmExit={jest.fn()} />
        </SettingsProvider>,
      );
    });

    const texts = tree!.root.findAllByType(Text);
    expect(texts.length).toBe(0);
  });

  it('triggers onCancel when hardware back button is pressed via onRequestClose', () => {
    const handleCancel = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <SettingsProvider>
          <ExitAppModal visible={true} onCancel={handleCancel} onConfirmExit={jest.fn()} />
        </SettingsProvider>,
      );
    });

    const modal = tree!.root.findByType(Modal);
    act(() => {
      modal.props.onRequestClose();
    });

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
