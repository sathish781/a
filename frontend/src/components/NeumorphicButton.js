import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Animated,
  View,
  Platform,
} from 'react-native';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

export default function NeumorphicButton({ title, onPress, variant = 'primary' }) {
  const { theme } = useThemeMode();
  const isDark = theme.mode === 'dark';
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 25,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 4,
    }).start();
  };

  // Button raised background (slightly lighter than card bg)
  const bgButton = isDark ? '#1e2a42' : '#dde8f3';
  const shadowLight = isDark ? '#283855' : '#ffffff';
  const shadowDark = isDark ? '#0f1825' : '#b0c4d6';

  // Accent gradient color based on variant
  const accentColor =
    variant === 'danger'
      ? '#f43f5e'
      : variant === 'success'
      ? '#10b981'
      : theme.primary;

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale }], marginVertical: 10 }}>
        <View
          style={[
            styles.button,
            {
              backgroundColor: bgButton,
              borderColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.9)',
              shadowColor: shadowDark,
              shadowOpacity: Platform.OS === 'ios' ? 0.7 : 0,
              shadowRadius: 12,
              shadowOffset: { width: 5, height: 5 },
              elevation: Platform.OS === 'android' ? 6 : 0,
            },
          ]}
        >
          {/* Top-left highlight layer on iOS */}
          {Platform.OS === 'ios' && (
            <View
              pointerEvents="none"
              style={[
                styles.highlightLayer,
                {
                  shadowColor: shadowLight,
                  shadowOpacity: 0.9,
                  shadowRadius: 12,
                  shadowOffset: { width: -5, height: -5 },
                },
              ]}
            />
          )}

          {/* Colored accent bar at the bottom of the button */}
          <View
            style={[styles.accentBar, { backgroundColor: accentColor }]}
          />

          <Text style={[styles.text, { color: isDark ? '#e2e8f0' : '#0f172a' }]}>
            {title}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  highlightLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
