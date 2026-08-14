import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ToggleButtonProps {
  isOn: boolean;
  onPress: () => void;
}

export const ToggleButton = ({ isOn, onPress }: ToggleButtonProps) => (
  <View style={styles.wrapper}>
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isOn && styles.buttonOn,
        pressed && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={isOn ? 'Turn flashlight off' : 'Turn flashlight on'}
      accessibilityState={{ selected: isOn }}>
      <Text style={[styles.icon, isOn && styles.iconOn]}>
        {isOn ? 'ON' : 'OFF'}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1E293B',
    borderWidth: 6,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  buttonOn: {
    backgroundColor: '#FDE047',
    borderColor: '#FACC15',
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },

  icon: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#64748B',
  },

  iconOn: {
    color: '#713F12',
  },
});
