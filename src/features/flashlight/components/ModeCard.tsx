import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme';
import type { FlashlightMode } from '../../../core/constants';
import { MODE_LABELS } from '../../../core/constants';

interface ModeCardProps {
  mode: FlashlightMode;
  isActive: boolean;
}

export const ModeCard = ({ mode, isActive }: ModeCardProps) => (
  <View style={[styles.card, isActive && styles.cardActive]}>
    <Text style={[styles.title, isActive && styles.titleActive]}>
      {MODE_LABELS[mode]}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: {
    borderColor: colors.yellow,
    backgroundColor: colors.border,
  },
  title: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  titleActive: {
    color: colors.yellow,
  },
});
