import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ICONS } from '@/core/constants/icons';
import { colors } from '@/core/theme';
import { AUTO_OFF_TIMER_OPTIONS } from '@/core/constants';
import { SettingsRow } from '../components/SettingsRow';
import { useSettings } from '../../../app/providers/SettingsProvider';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { settings, setSetting } = useSettings();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon name={ICONS.back} size={24} color={colors.text} />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Settings
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text allowFontScaling={false} style={styles.sectionLabel}>
          FLASHLIGHT
        </Text>

        <SettingsRow
          iconName={ICONS.flashlight}
          title="Automatic on"
          description="Turn on flashlight on startup"
          value={settings.automaticOn}
          onValueChange={() => setSetting('automaticOn', !settings.automaticOn)}
        />

        <SettingsRow
          iconName={ICONS.power}
          title="Flashlight stay on"
          description="Stay on after locking the screen"
          value={settings.flashlightStayOn}
          onValueChange={() => setSetting('flashlightStayOn', !settings.flashlightStayOn)}
        />

        <SettingsRow
          iconName={ICONS.phonePortrait}
          title="Shake to switch"
          description="Shake your phone to turn on/off flashlight"
          value={settings.shakeToSwitch}
          onValueChange={() => setSetting('shakeToSwitch', !settings.shakeToSwitch)}
        />

        <SettingsRow
          iconName={ICONS.notifications}
          title="Notification toolbar toggle"
          description="Shortcut to turn on/off flashlight"
          value={settings.notificationToolbarToggle}
          onValueChange={() => setSetting('notificationToolbarToggle', !settings.notificationToolbarToggle)}
        />

        <SettingsRow
          iconName={ICONS.compass}
          title="Compass"
          description="Navigate with built-in compass"
          value={settings.compass}
          onValueChange={() => setSetting('compass', !settings.compass)}
        />

        <SettingsRow
          iconName={ICONS.volumeHigh}
          title="Sound"
          description="Instant sound flashlight switch"
          value={settings.sound}
          onValueChange={() => setSetting('sound', !settings.sound)}
        />

        <SettingsRow
          iconName={ICONS.handLeft}
          title="Haptic"
          description="Vibration feedback for controls"
          value={settings.haptic}
          onValueChange={() => setSetting('haptic', !settings.haptic)}
        />

        <SettingsRow
          iconName={ICONS.batteryWarning}
          title="Power control"
          description="Low battery warning below 10%"
          value={settings.powerControl}
          onValueChange={() => setSetting('powerControl', !settings.powerControl)}
        />

        <SettingsRow
          iconName={ICONS.timer}
          title="Automatic Off"
          description={`Turn off flashlight automatically`}
          value={settings.automaticOff}
          onValueChange={() => setSetting('automaticOff', !settings.automaticOff)}
          extra={
            settings.automaticOff && (
              <View style={styles.timerSection}>
                <Text allowFontScaling={false} style={styles.timerTitle}>
                  Automatic OFF
                </Text>
                <View style={styles.timerOptions}>
                  {AUTO_OFF_TIMER_OPTIONS.map(option => {
                    const selected = settings.automaticOffTimer === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => setSetting('automaticOffTimer', option.value)}
                        style={[
                          styles.timerOption,
                          selected && styles.timerOptionActive,
                        ]}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.timerOptionText,
                            selected && styles.timerOptionTextActive,
                          ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )
          }
        />

        <Text allowFontScaling={false} style={styles.sectionLabel}>
          GENERAL
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Icon name={ICONS.language} size={22} color={colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text allowFontScaling={false} style={styles.infoTitle}>
              App Languages
            </Text>
            <Text allowFontScaling={false} style={styles.infoDescription}>
              English
            </Text>
          </View>
        </View>

        <Text allowFontScaling={false} style={styles.sectionLabel}>
          OTHERS
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Icon name={ICONS.star} size={22} color={colors.primary} />
          </View>
          <Text allowFontScaling={false} style={styles.infoTitle}>
            Rate Us
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Icon name={ICONS.share} size={22} color={colors.primary} />
          </View>
          <Text allowFontScaling={false} style={styles.infoTitle}>
            Share App
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Icon name={ICONS.shieldCheckmark} size={22} color={colors.primary} />
          </View>
          <Text allowFontScaling={false} style={styles.infoTitle}>
            Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  timerSection: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  timerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 10,
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timerOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerOptionActive: {
    backgroundColor: colors.primary19,
    borderColor: colors.primary,
  },
  timerOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  timerOptionTextActive: {
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  infoDescription: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
