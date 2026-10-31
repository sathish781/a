import React, { useRef } from 'react';
import { TouchableWithoutFeedback, Text, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { radius } from '../utils/theme';
import { useThemeMode } from '../context/ThemeContext';

export default function AppButton({ title, onPress, variant = 'primary', style }) {
  const { theme } = useThemeMode();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const gradientColors =
    variant === 'danger'
      ? ['#ef4444', '#b91c1c']
      : variant === 'success'
        ? ['#10b981', '#047857']
        : variant === 'dark'
          ? ['#1c1917', '#000000']
          : variant === 'gold'
            ? ['#f59e0b', '#b45309']
            : variant === 'purple'
              ? ['#a855f7', '#6b21a8']
              : [theme.primary, theme.primaryDark];

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, { shadowColor: theme.primary }]}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});