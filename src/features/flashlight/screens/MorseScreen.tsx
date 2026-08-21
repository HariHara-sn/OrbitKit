import Slider from '@react-native-community/slider';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MORSE_MAX_UNIT, MORSE_MIN_UNIT } from '../../../core/constants';
import { colors } from '@/core/theme';
import { useHaptic } from '../hooks/useHaptic';
import { useSound } from '../hooks/useSound';
import { useMorseTransmitter } from '../hooks/useMorseTransmitter';
import {
  MORSE_LETTERS,
  MORSE_NUMBERS,
  MORSE_SYMBOLS,
  encodeToMorse,
  morseToSignals,
} from '../utils/morse';
import type { MorseSignal } from '../utils/morse';

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
  const { isTransmitting, activeIndex, unit, setUnit, start, stop } =
    useMorseTransmitter();
  const { trigger: haptic } = useHaptic();
  const { playClick } = useSound();

  const morseCode = useMemo(
    () => (message.trim() ? encodeToMorse(message) : 'Your Morse code'),
    [message],
  );

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

  const handleTransmit = useCallback(() => {
    if (message.trim() && !isTransmitting) {
      haptic();
      playClick();
      start(morseToSignals(morseCode));
    }
  }, [message, isTransmitting, morseCode, start, haptic, playClick]);

  const handleStop = useCallback(() => {
    haptic();
    playClick();
    stop();
  }, [stop, haptic, playClick]);

  const canTransmit = message.trim().length > 0 && !isTransmitting;

  return (
    <SafeAreaView style={styles.container}>
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
            placeholderTextColor={colors.placeholder}
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

        <View style={styles.outputCard}>
          <View style={styles.outputRow}>
            {displaySignals.map((item, index) => (
              <Text
                key={index}
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
            onPress={handleStop}
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
            accessibilityLabel={
              dropdown ? 'Hide Morse reference' : 'Show Morse reference'
            }
          >
            <MaterialCommunityIcons
              name={dropdown ? 'chevron-down' : 'chevron-up'}
              size={20}
              color={colors.white}
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
                  <Text style={styles.referenceCode}>{value}</Text>
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
          minimumTrackTintColor={colors.yellow}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.yellow}
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
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: 14,
  },

  header: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
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
    color: colors.primarySubtle,
    textTransform: 'uppercase',
  },

  inputCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 64,
    justifyContent: 'space-between',
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    padding: 0,
    minHeight: 40,
  },

  counter: {
    alignSelf: 'flex-end',
    color: colors.textSubtle,
    fontSize: 16,
    paddingTop: 6,
  },

  outputCard: {
    marginTop: 16,
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    color: colors.textLight,
    fontSize: 16,
    fontStyle: 'italic',
  },

  outputCharActive: {
    color: colors.yellow,
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
    borderColor: colors.white,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 54,
  },
  speedLabel: {
    marginTop: 16,
    color: colors.text,
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
    color: colors.textMuted,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  transmitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  stopButton: {
    flex: 1,
    backgroundColor: colors.stopButton,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  status: {
    color: colors.yellow,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },

  referenceCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    paddingBottom: 10,
  },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.tabsRow,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabActive: {
    backgroundColor: colors.primaryLight,
  },

  tabText: {
    color: colors.textSubtle,
    fontSize: 16,
    fontWeight: '700',
  },

  tabTextActive: {
    color: colors.white,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  referenceCode: {
    color: colors.textLight,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
