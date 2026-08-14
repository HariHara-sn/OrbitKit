import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DummyScreenProps {
  title: string;
}

export const DummyScreen = ({ title }: DummyScreenProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.hint}>Coming soon</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8FAFC',
  },

  hint: {
    fontSize: 16,
    color: '#94A3B8',
  },
});
