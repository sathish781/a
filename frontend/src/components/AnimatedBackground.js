import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const FLOATING_ICONS = [
  { icon: '📚', top: '15%', left: '10%', duration: 6000, distance: -18 },
  { icon: '🏛️', top: '25%', right: '12%', duration: 7500, distance: 22 },
  { icon: '🏪', top: '55%', left: '8%', duration: 8000, distance: -20 },
  { icon: '🎓', top: '70%', right: '15%', duration: 6500, distance: 25 },
  { icon: '📖', top: '82%', left: '42%', duration: 7000, distance: -15 },
];

export default function AnimatedBackground({ children, style, showIcons = true }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  // Ambient blob animations
  const blobAnim1 = useRef(new Animated.Value(0)).current;
  const blobAnim2 = useRef(new Animated.Value(0)).current;

  // Icon floating animations
  const iconAnims = useRef(FLOATING_ICONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Blob 1 loop
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim1, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(blobAnim1, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    );

    // Blob 2 loop
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim2, { toValue: 1, duration: 11000, useNativeDriver: true }),
        Animated.timing(blobAnim2, { toValue: 0, duration: 11000, useNativeDriver: true }),
      ])
    );

    loop1.start();
    loop2.start();

    // Floating icons loops
    if (showIcons) {
      iconAnims.forEach((anim, idx) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: FLOATING_ICONS[idx].duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: FLOATING_ICONS[idx].duration,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }

    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, []);

  const translateY1 = blobAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  const scale1 = blobAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });

  const translateY2 = blobAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const scale2 = blobAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.12, 1],
  });

  return (
    <View style={[styles.container, { backgroundColor: isLight ? '#fffaf5' : '#0a0a0f' }, style]}>
      {/* Background Soft Blobs */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blob1,
          {
            backgroundColor: theme.primary + (isLight ? '15' : '18'),
            transform: [{ translateY: translateY1 }, { scale: scale1 }],
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blob2,
          {
            backgroundColor: (isLight ? theme.accent : theme.primaryDark) + (isLight ? '12' : '15'),
            transform: [{ translateY: translateY2 }, { scale: scale2 }],
          },
        ]}
      />

      {/* Floating Particles/Icons */}
      {showIcons &&
        FLOATING_ICONS.map((item, idx) => {
          const iconTranslateY = iconAnims[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [0, item.distance],
          });
          const iconOpacity = iconAnims[idx].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.25, 0.45, 0.25],
          });

          return (
            <Animated.Text
              key={idx}
              pointerEvents="none"
              style={[
                styles.floatingIcon,
                {
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  opacity: iconOpacity,
                  transform: [{ translateY: iconTranslateY }],
                },
              ]}
            >
              {item.icon}
            </Animated.Text>
          );
        })}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blob1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.25,
    right: -width * 0.25,
  },
  blob2: {
    width: width * 0.9,
    height: width * 0.9,
    bottom: -width * 0.3,
    left: -width * 0.3,
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 0,
  },
});
