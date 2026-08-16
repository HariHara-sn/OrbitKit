import Slider from '@react-native-community/slider';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MORSE_MAX_UNIT, MORSE_MIN_UNIT } from '../constants';
import { useMorseTransmitter } from '../hooks/useMorseTransmitter';
import {
  MORSE_LETTERS,
  MORSE_NUMBERS,
  MORSE_SYMBOLS,
  encodeToMorse,
  morseToSignals,
} from '../utils/morse';
import type { MorseSignal } from '../utils/morse';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type MorseTab = 'letters' | 'numbers' | 'symbols';

const MORSE_TAB_VALUES: Record<
  MorseTab,
  ReadonlyArray<readonly [string, string]>
> = {
  letters: MORSE_LETTERS,
  numbers: MORSE_NUMBERS,
  symbols: MORSE_SYMBOLS,
};

export const MorseScreen = () => {
  const [message, setMessage] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [tab, setTab] = useState<MorseTab>('letters');
  const { isTransmitting, activeIndex, unit, setUnit, start, stop } = useMorseTransmitter();

  const morseCode = useMemo(
    () => (message.trim() ? encodeToMorse(message) : 'Your Morse code'),
    [message],
  );

  // The displayed characters map 1:1 to the transmission tokens.
  const displaySignals = useMemo(
    () =>
      morseCode
        .split('')
        .map((char): { char: string; signal: MorseSignal } => ({
          char,
          signal:
            char === '.'
              ? 'DOT'
              : char === '-'
              ? 'DASH'
              : char === ' '
              ? 'CHARACTER_GAP'
              : 'WORD_GAP',
        })),
    [morseCode],
  );

  const handleTransmit = () => {
    if (message.trim() && !isTransmitting) {
      start(morseToSignals(morseCode));
    }
  };

  const canTransmit = message.trim().length > 0 && !isTransmitting;

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text allowFontScaling={false} style={styles.header}>
        Morse Code
      </Text> */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text allowFontScaling={false} style={styles.sectionLabel}>
          TEXT TO MORSE
        </Text>
        <View style={styles.inputCard}>
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="Type your message..!"
            placeholderTextColor="#A8B3C7"
            value={message}
            maxLength={200}
            onChangeText={setMessage}
            autoCapitalize="characters"
            multiline
            textAlignVertical="top"
          />
          <Text allowFontScaling={false} style={styles.counter}>
            {`${message.length}/200`}
          </Text>
        </View>

        {/* <Text allowFontScaling={false} style={styles.sectionLabel}>
          MORSE CODE
        </Text> */}
        <View style={styles.outputCard}>
          <View style={styles.outputRow}>
            {displaySignals.map((item, index) => (
              <Text
                key={index}
                // allowFontScaling={false}
                style={[
                  styles.outputChar,
                  index === activeIndex && styles.outputCharActive,
                ]}
              >
                {item.char === ' ' ? '\u00A0' : item.char}
              </Text>
            ))}
          </View>
        </View>

        {/* <Text allowFontScaling={false} style={styles.sectionLabel}>
          TRANSMIT
        </Text> */}

        <View style={styles.buttonRow}>
          <Pressable
            onPress={handleTransmit}
            disabled={!canTransmit}
            style={[
              styles.transmitButton,
              !canTransmit && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canTransmit }}
          >
            <Text allowFontScaling={false} style={styles.buttonText}>
              TRANSMIT
            </Text>
          </Pressable>
          <Pressable
            onPress={stop}
            disabled={!isTransmitting}
            style={[
              styles.stopButton,
              !isTransmitting && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isTransmitting }}
          >
            <Text allowFontScaling={false} style={styles.buttonText}>
              STOP
            </Text>
          </Pressable>
        </View>

        {isTransmitting && (
          <Text allowFontScaling={false} style={styles.status}>
            Transmitting...
          </Text>
        )}

        <View style={styles.morseReferenceRow}>
          <Text
            allowFontScaling={false}
            style={[styles.sectionLabel, { marginTop: 54 }]}
          >
            4. MORSE REFERENCE
          </Text>

          <Pressable
            style={styles.morsereferencedownbutton}
            onPress={() => setDropdown(prev => !prev)}
            accessibilityRole="button"
            accessibilityState={{ expanded: dropdown }}
            accessibilityLabel={dropdown ? 'Hide Morse reference' : 'Show Morse reference'}
          >
            <MaterialCommunityIcons
              name={dropdown ? 'chevron-down' : 'chevron-up'}
              size={20}
              color="white"
            />
          </Pressable>
        </View>

        {dropdown && (
          <View style={styles.referenceCard}>
          <View style={styles.tabsRow}>
            {(['letters', 'numbers', 'symbols'] as MorseTab[]).map(tabKey => (
              <Pressable
                key={tabKey}
                onPress={() => setTab(tabKey)}
                style={[styles.tab, tab === tabKey && styles.tabActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: tab === tabKey }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.tabText,
                    tab === tabKey && styles.tabTextActive,
                  ]}
                >
                  {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView
            style={styles.referenceScroll}
            contentContainerStyle={styles.referenceGrid}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {MORSE_TAB_VALUES[tab].map(([label, value], index) => (
              <View
                key={`${tab}-${label}-${index}`}
                style={styles.referenceItem}
              >
                <Text allowFontScaling={false} style={styles.referenceLetter}>
                  {label}
                </Text>
                <Text  style={styles.referenceCode}>
                  {value}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        )}
        <Text allowFontScaling={false} style={styles.speedLabel}>
          Speed
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={MORSE_MAX_UNIT}
          maximumValue={MORSE_MIN_UNIT}
          value={unit}
          disabled={isTransmitting}
          onValueChange={value => setUnit(value)}
          minimumTrackTintColor="#FDE047"
          maximumTrackTintColor="#334155"
          thumbTintColor="#FDE047"
          accessibilityLabel="Morse transmission speed"
        />
        <View style={styles.rangeRow}>
          <Text allowFontScaling={false} style={styles.rangeLabel}>
            Slow
          </Text>
          <Text allowFontScaling={false} style={styles.rangeLabel}>
            Fast
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#071827',
    paddingHorizontal: 14
  },

  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    paddingTop: 6,
    paddingBottom: 4,
  },

  scrollContent: {
    paddingBottom: 16,
  },

  sectionLabel: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#B487F8',
    textTransform: 'uppercase',
  },

  inputCard: {
    backgroundColor: '#1C2434',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B475E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 64,
    justifyContent: 'space-between',
  },

  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    padding: 0,
    minHeight: 40,
  },

  counter: {
    alignSelf: 'flex-end',
    color: '#CBD5E1',
    fontSize: 16,
    paddingTop: 6,
  },

  outputCard: {
    marginTop: 16,
    backgroundColor: '#1C2434',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B475E',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 40,
  },

  outputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  outputChar: {
    color: '#E2E8F0',
    fontSize: 16,
    fontStyle: 'italic',
  },

  outputCharActive: {
    color: '#FDE047',

    fontWeight: '700',
  },
  morseReferenceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  morsereferencedownbutton: {
    width: 22,
    height: 22,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 54,
  },
  speedLabel: {
    marginTop: 16,
    color: '#F8FAFC',
    fontSize: 16,
    marginBottom: 4,
  },

  slider: {
    alignSelf: 'stretch',
    height: 32,
  },

  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  rangeLabel: {
    fontSize: 16,
    color: '#94A3B8',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  transmitButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  stopButton: {
    flex: 1,
    backgroundColor: '#475569',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  status: {
    color: '#FDE047',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },

  referenceCard: {
    backgroundColor: '#1C2434',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B475E',
    overflow: 'hidden',
    paddingBottom: 10,
  },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#111827',
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabActive: {
    backgroundColor: '#A78BFA',
  },

  tabText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '700',
  },

  tabTextActive: {
    color: '#FFFFFF',
  },

  referenceScroll: {
    height: 132,
  },

  referenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  referenceItem: {
    width: '31%',
    marginBottom: 6,
    alignItems: 'flex-start',
  },

  referenceLetter: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },

  referenceCode: {
    color: '#E2E8F0',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
