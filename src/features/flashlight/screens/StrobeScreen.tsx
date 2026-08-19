import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/core/theme';
import { TorchButton } from '../components/TorchButton';
import { STROBE_MAX_INTERVAL, STROBE_MIN_INTERVAL } from '../../../core/constants';
import { useTorchContext } from '../../../app/providers/AppProviders';

export const StrobeScreen = () => {
  const { isOn, toggle, strobeSpeed, setStrobeSpeed } = useTorchContext();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="lightning-bolt"
        size={100}
        color={colors.yellow}
      />

      <View style={styles.controls}>
        <Text style={styles.heading}>Frequency</Text>
        <Slider
          style={styles.slider}
          minimumValue={STROBE_MAX_INTERVAL}
          maximumValue={STROBE_MIN_INTERVAL}
          value={strobeSpeed}
          onValueChange={value => setStrobeSpeed(value)}
          minimumTrackTintColor={colors.yellow}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.yellow}
          accessibilityLabel="Strobe frequency"
        />
        <View style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>Slow</Text>
          <Text style={styles.rangeLabel}>Fast</Text>
        </View>
      </View>

      <TorchButton isOn={isOn} onPress={toggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
  },

  controls: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },

  slider: {
    alignSelf: 'stretch',
    height: 40,
  },

  rangeRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  rangeLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
