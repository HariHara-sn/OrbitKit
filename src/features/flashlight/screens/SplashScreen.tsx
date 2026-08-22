import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/core/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const SPLASH_DURATION = 2200; 

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const exitFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Fade + scale in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Glow pulse loop briefly
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 },
      ).start(() => {
        // 3. Fade out whole splash
        Animated.timing(exitFade, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(() => onFinish());
      });
    });
  }, [fadeAnim, scaleAnim, glowAnim, exitFade, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: exitFade }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Glow ring behind icon */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glowAnim,
            transform: [
              {
                scale: glowAnim.interpolate({
                  inputRange: [0.4, 1],
                  outputRange: [1, 1.18],
                }),
              },
            ],
          },
        ]}
      />

      {/* Icon + wordmark */}
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Icon name="flashlight" size={52} color={colors.yellow} />
        </View>

        <Text style={styles.appName} allowFontScaling={false}>
          Flashlight
        </Text>

        <Text style={styles.tagline} allowFontScaling={false}>
          Always bright, always ready
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },

  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.yellow15,
  },

  iconWrapper: {
    alignItems: 'center',
    gap: 14,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.yellowDark,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
  },

  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1.5,
  },

  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
