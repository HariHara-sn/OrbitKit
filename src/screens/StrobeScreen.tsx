import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ToggleButton } from '../components/ToggleButton';
import {
  STROBE_MAX_INTERVAL,
  STROBE_MIN_INTERVAL,
} from '../constants';
import { useTorchContext } from '../context/TorchContext';

export const StrobeScreen = () => {
  const { isOn, toggle, strobeSpeed, setStrobeSpeed } = useTorchContext();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="lightning-bolt"    
        size={100}
        color="#FDE047"
      />

      <View style={styles.controls}>
        <Text style={styles.heading}>Frequency</Text>
        <Slider
          style={styles.slider}
          minimumValue={STROBE_MAX_INTERVAL}
          maximumValue={STROBE_MIN_INTERVAL}
          value={strobeSpeed}
          onValueChange={value => setStrobeSpeed(value)}
          minimumTrackTintColor="#FDE047"
          maximumTrackTintColor="#334155"
          thumbTintColor="#FDE047"
          accessibilityLabel="Strobe frequency"
        />
        <View style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>Slow</Text>
          <Text style={styles.rangeLabel}>Fast</Text>
        </View>
      </View>

      <ToggleButton isOn={isOn} onPress={toggle} />
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
    color: '#F8FAFC',
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
    color: '#94A3B8',
  },
});
