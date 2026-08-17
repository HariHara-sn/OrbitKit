import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardActive: {
    borderColor: '#FDE047',
    backgroundColor: '#334155',
  },
  title: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  titleActive: {
    color: '#FDE047',
  },
});
