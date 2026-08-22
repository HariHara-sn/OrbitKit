import React, { ReactElement, useEffect, useState } from 'react';
import { PressableProps, Text, View } from 'react-native';
import { tooltipStyles } from './Tooltip.styles';

interface TooltipProps {
  children: ReactElement<PressableProps>;
  content: string;
  duration?: number;
  placement?: 'top' | 'bottom';
}

export const CustomTooltip = ({
  children,
  content,
  duration = 2500,
  placement = 'bottom',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Auto-hide after duration
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const timeout = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [duration, isVisible]);

  const showTooltip = () => setIsVisible(true);

  // Show tooltip on press; immediately call through to the original onPress too
  const trigger = React.cloneElement(children, {
    onPress: (...args) => {
      showTooltip();
      children.props.onPress?.(...args);
    },
    onLongPress: event => {
      showTooltip();
      children.props.onLongPress?.(event);
    },
  });

  return (
    <View style={tooltipStyles.container}>
      {trigger}

      {isVisible && (
        <>
          {/* Arrow caret */}
          <View
            pointerEvents="none"
            style={
              placement === 'top'
                ? tooltipStyles.arrowDown
                : tooltipStyles.arrowUp
            }
          />
          {/* Bubble */}
          <View
            pointerEvents="none"
            style={[
              tooltipStyles.bubble,
              placement === 'top'
                ? tooltipStyles.bubbleTop
                : tooltipStyles.bubbleBottom,
            ]}
          >
            <Text
              style={tooltipStyles.text}
              accessibilityLiveRegion="polite"
              numberOfLines={2}
            >
              {content}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default CustomTooltip;
