import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface FlashlightHeaderProps {
  title?: string;
}

export const FlashlightHeader = ({ title = 'Flashlight' }: FlashlightHeaderProps) => (
  <Text style={styles.header}>{title}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
});
