import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ICONS } from '@/core/constants/icons';
import { colors } from '@/core/theme';

interface FlashlightHeaderProps {
  title?: string;
  onSettingsPress?: () => void;
}

export const FlashlightHeader = ({
  title = 'Flashlight',
  onSettingsPress,
}: FlashlightHeaderProps) => (
  <View style={styles.headerContainer}>
    <Text style={styles.header}>{title}</Text>

    <Pressable
      onPress={onSettingsPress}
      style={styles.settingsIcon}
      accessibilityRole="button"
      accessibilityLabel="Open settings"
    >
      <View style={styles.settingsGlow} />
      <Icon name={ICONS.settings} size={30} color={colors.yellow} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 8,
    paddingBottom: 8,
  },

  header: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },

  settingsIcon: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsGlow: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary15,
    ...Platform.select({
      ios: {
        shadowColor: colors.yellow,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
