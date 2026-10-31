import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';

const ORBITING_FEATURES = [
  { id: '1', icon: '📚', style: { top: 2, alignSelf: 'center' }, type: 'float', duration: 3200 },
  { id: '2', icon: '🏫', style: { top: 28, right: 16 }, type: 'float', duration: 3800 },
  { id: '3', icon: '❤️', style: { top: 28, left: 16 }, type: 'pulse', duration: 1800 },
  { id: '4', icon: '🏪', style: { bottom: 28, left: 16 }, type: 'float', duration: 4200 },
  { id: '5', icon: '🎓', style: { bottom: 28, right: 16 }, type: 'float', duration: 3600 },
  { id: '6', icon: '🔄', style: { bottom: 2, alignSelf: 'center' }, type: 'rotate', duration: 4000 },
];

export default function GlowOrb({ children }) {
  const { theme } = useThemeMode();

  // Orbit rotation animation
  const orbitRotation = useRef(new Animated.Value(0)).current;

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Feature icon micro-animations
  const featureAnims = useRef(ORBITING_FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Orbital path rotation
    const orbitLoop = Animated.loop(
      Animated.timing(orbitRotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    orbitLoop.start();

    // Pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    // Feature animations
    featureAnims.forEach((anim, idx) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: ORBITING_FEATURES[idx].duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: ORBITING_FEATURES[idx].duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => {
      orbitLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const spin = orbitRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Outer Rotating Glowing Ring */}
      <Animated.View
        style={[
          styles.orbitRing,
          {
            borderColor: theme.primary + '40',
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Glow Particles on Orbit */}
        <View style={[styles.orbitNode, { top: -4, left: '50%', backgroundColor: theme.primary }]} />
        <View style={[styles.orbitNode, { bottom: -4, right: '50%', backgroundColor: theme.accent || '#f59e0b' }]} />
        <View style={[styles.orbitNode, { top: '50%', right: -4, backgroundColor: '#3b82f6' }]} />
        <View style={[styles.orbitNode, { top: '50%', left: -4, backgroundColor: '#10b981' }]} />
      </Animated.View>

      {/* Orbiting Feature Icons around Logo */}
      {ORBITING_FEATURES.map((item, idx) => {
        const anim = featureAnims[idx];

        let transform = [];
        if (item.type === 'pulse') {
          const scale = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.22, 1],
          });
          transform = [{ scale }];
        } else if (item.type === 'rotate') {
          const rotate = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          });
          transform = [{ rotate }];
        } else {
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, idx % 2 === 0 ? -8 : 8],
          });
          transform = [{ translateY }];
        }

        return (
          <Animated.Text
            key={item.id}
            style={[
              styles.featureIcon,
              item.style,
              { transform },
            ]}
          >
            {item.icon}
          </Animated.Text>
        );
      })}

      {/* Main Center Logo Container */}
      <Animated.View style={[styles.centerWrap, { transform: [{ scale: pulseAnim }] }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  orbitNode: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  featureIcon: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 10,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
});
