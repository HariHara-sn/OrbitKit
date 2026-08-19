import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/core/theme';
import { MODE_LABELS } from '../../../core/constants';
import type { FlashlightMode } from '../../../core/constants';

interface BottomNavProps {
  mode: FlashlightMode;
  onModeChange: (mode: FlashlightMode) => void;
}

const TABS: FlashlightMode[] = ['torch', 'white', 'strobe', 'morse'];

export const BottomNav = ({ mode, onModeChange }: BottomNavProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TABS.map(item => {
        const active = item === mode;
        return (
          <Pressable
            key={item}
            onPress={() => onModeChange(item)}
            style={[styles.tab, active && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <Text allowFontScaling={false} style={[styles.label, active && styles.labelActive]}>
              {MODE_LABELS[item]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingLeft: 8,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },

  tabActive: {
    backgroundColor: colors.yellow,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },

  labelActive: {
    color: colors.textOnYellow,
  },
});
