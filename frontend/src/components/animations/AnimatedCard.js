import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';

export default function AnimatedCard({ children, onPress, style, disabled = false }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (disabled || !onPress) return;
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    if (disabled || !onPress) return;
    Animated.spring(scale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || !onPress}
      style={{ marginVertical: 8 }}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.tabBg || theme.backgroundTwo,
            borderColor: theme.glassBorder,
            shadowColor: isLight ? theme.darkText : theme.primary,
            transform: [{ scale }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    overflow: 'hidden',
  },
});
