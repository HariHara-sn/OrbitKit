import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/core/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ARROW_SIZE = 7;

export const tooltipStyles = StyleSheet.create({
  // The outer wrapper sits inline where the trigger sits.
  // overflow: visible is critical so the bubble escapes the 44x44 box.
  container: {
    position: 'relative',
    width: 44,
    height: 44,
    overflow: 'visible',
    zIndex: 999,
  },

  bubble: {
    position: 'absolute',
    right: 0,
    // Expand up to most of the screen width, but shrink to content
    maxWidth: SCREEN_WIDTH - 32,
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.text,
    shadowColor: colors.black,
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 999,
  },

  bubbleTop: {
    bottom: 44 + ARROW_SIZE + 4,
  },

  bubbleBottom: {
    top: 44 + ARROW_SIZE + 4,
  },

  text: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },

  // Arrow caret pointing UP (toward trigger when bubble is below)
  arrowUp: {
    position: 'absolute',
    right: 14,
    top: 44 + 4,
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.text,
    zIndex: 1000,
  },

  // Arrow caret pointing DOWN (toward trigger when bubble is above)
  arrowDown: {
    position: 'absolute',
    right: 14,
    bottom: 44 + 4,
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderTopWidth: ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.text,
    zIndex: 1000,
  },
});
