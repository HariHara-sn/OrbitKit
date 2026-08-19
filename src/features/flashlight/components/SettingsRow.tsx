import React from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/core/theme';

interface SettingsRowProps {
  iconName: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  extra?: React.ReactNode;
}

export const SettingsRow = ({
  iconName,
  title,
  description,
  value,
  onValueChange,
  extra,
}: SettingsRowProps) => (
  <View style={[styles.wrapper, value && styles.wrapperGlow]}>
    <View style={styles.row}>
      <View style={[styles.iconContainer, value && styles.iconGlow]}>
        <Icon
          name={iconName}
          size={22}
          color={value ? colors.yellow : colors.iconInactive}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          allowFontScaling={false}
          style={[styles.title, value && styles.titleActive]}
        >
          {title}
        </Text>
        <Text allowFontScaling={false} style={styles.description}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary50 }}
        thumbColor={value ? colors.primary : colors.textMuted}
        ios_backgroundColor={colors.border}
      />
    </View>
    {extra}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  wrapperGlow: {
    borderColor: colors.placeholder,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconGlow: {
    backgroundColor: colors.yellow15,
    ...Platform.select({
      ios: {
        shadowColor: colors.yellow,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 20,
      },
    }),
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSubtle,
  },
  titleActive: {
    color: colors.text,
  },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
