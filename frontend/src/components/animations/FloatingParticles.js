import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const PARTICLE_COUNT = 18;

const PARTICLES_DATA = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  id: i,
  size: 4 + (i % 5) * 1.5,
  left: `${(i * 5.8 + 3) % 94}%`,
  bottom: `${(i * 6 + 5) % 80}%`,
  duration: 4500 + (i % 6) * 750,
  delay: (i % 5) * 400,
  colorType: i % 3, // 0: primary orange, 1: accent gold, 2: white/light blue
}));

export default function FloatingParticles() {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  const anims = useRef(PARTICLES_DATA.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = anims.map((anim, idx) => {
      const data = PARTICLES_DATA[idx];
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(data.delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: data.duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return loop;
    });

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, []);

  const getParticleColor = (type) => {
    switch (type) {
      case 0:
        return theme.primary;
      case 1:
        return theme.accent || '#f59e0b';
      case 2:
      default:
        return isLight ? '#3b82f6' : '#ffffff';
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {PARTICLES_DATA.map((p, idx) => {
        const translateY = anims[idx].interpolate({
          inputRange: [0, 1],
          outputRange: [20, -110],
        });

        const translateX = anims[idx].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, (idx % 2 === 0 ? 12 : -12), 0],
        });

        const opacity = anims[idx].interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0, isLight ? 0.45 : 0.75, isLight ? 0.35 : 0.65, 0],
        });

        const scale = anims[idx].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.6, 1.2, 0.8],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                left: p.left,
                bottom: p.bottom,
                backgroundColor: getParticleColor(p.colorType),
                shadowColor: getParticleColor(p.colorType),
                opacity,
                transform: [{ translateY }, { translateX }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
});
