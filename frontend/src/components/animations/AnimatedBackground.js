import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import FloatingParticles from './FloatingParticles';
import FloatingBooks from './FloatingBooks';
import CampusIllustration from './CampusIllustration';
import { useThemeMode } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground({
  children,
  style,
  intensity = 'full', // 'full' | 'subtle'
  parallaxOffset = 0,
}) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  // Layer 1: Gradient Blobs
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  const blob3Anim = useRef(new Animated.Value(0)).current;

  // Layer 5: Light Waves
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Blob 1 loop (Horizontal + scale)
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(blob1Anim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(blob1Anim, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    );

    // Blob 2 loop (Vertical + scale)
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(blob2Anim, { toValue: 1, duration: 11000, useNativeDriver: true }),
        Animated.timing(blob2Anim, { toValue: 0, duration: 11000, useNativeDriver: true }),
      ])
    );

    // Blob 3 loop (Rotate + scale)
    const loop3 = Animated.loop(
      Animated.sequence([
        Animated.timing(blob3Anim, { toValue: 1, duration: 13000, useNativeDriver: true }),
        Animated.timing(blob3Anim, { toValue: 0, duration: 13000, useNativeDriver: true }),
      ])
    );

    // Light Wave diagonal sweep loop
    const waveLoop = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: true,
      })
    );

    loop1.start();
    loop2.start();
    loop3.start();
    waveLoop.start();

    return () => {
      loop1.stop();
      loop2.stop();
      loop3.stop();
      waveLoop.stop();
    };
  }, []);

  const translateX1 = blob1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 45],
  });
  const scale1 = blob1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.92, 1.12, 0.92],
  });

  const translateY2 = blob2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });
  const scale2 = blob2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.15, 1],
  });

  const rotate3 = blob3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const waveTranslateY = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height || 800, -200],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 0.25, 0.25, 0],
  });

  // Safely interpolate parallaxOffset
  const computedParallaxOffset =
    parallaxOffset && typeof parallaxOffset === 'object' && parallaxOffset.interpolate
      ? parallaxOffset.interpolate({
          inputRange: [0, width * 3],
          outputRange: [0, -width * 0.25],
          extrapolate: 'clamp',
        })
      : typeof parallaxOffset === 'number'
      ? parallaxOffset * 0.25
      : 0;

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: isLight ? '#fffaf5' : '#07070c' },
        style,
      ]}
    >
      {/* Layer 1: Animated Soft Gradient Blobs */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blob1,
          {
            backgroundColor: theme.primary + (intensity === 'full' ? (isLight ? '18' : '22') : '10'),
            transform: [{ translateX: translateX1 }, { scale: scale1 }],
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blob2,
          {
            backgroundColor: (theme.accent || '#f59e0b') + (intensity === 'full' ? (isLight ? '15' : '18') : '08'),
            transform: [{ translateY: translateY2 }, { scale: scale2 }],
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blob3,
          {
            backgroundColor: (isLight ? '#3b82f6' : '#6366f1') + (intensity === 'full' ? '12' : '06'),
            transform: [{ rotate: rotate3 }],
          },
        ]}
      />

      {/* Layer 5: Subtle Diagonal Light Wave */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.lightWave,
          {
            opacity: waveOpacity,
            transform: [{ translateY: waveTranslateY }, { rotate: '-35deg' }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', theme.primary + '30', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Layer 2: Floating Particles */}
      <FloatingParticles />

      {/* Layer 3: Floating Books */}
      {intensity === 'full' && <FloatingBooks />}

      {/* Layer 7: Campus Skyline Parallax Footer */}
      {intensity === 'full' && <CampusIllustration parallaxOffset={computedParallaxOffset} />}

      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  childrenContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blob: {
    position: 'absolute',
    borderRadius: 220,
  },
  blob1: {
    width: width * 0.85,
    height: width * 0.85,
    top: -width * 0.25,
    right: -width * 0.25,
  },
  blob2: {
    width: width * 0.95,
    height: width * 0.95,
    bottom: -width * 0.3,
    left: -width * 0.3,
  },
  blob3: {
    width: width * 0.6,
    height: width * 0.6,
    top: height * 0.38,
    left: width * 0.2,
  },
  lightWave: {
    position: 'absolute',
    width: width * 1.5,
    height: 40,
    left: -width * 0.25,
  },
});
