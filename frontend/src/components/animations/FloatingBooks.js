import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const BOOKS = [
  { icon: '📖', top: '12%', left: '8%', distanceY: -18, distanceX: 10, rotate: '-8deg', duration: 5200, fontSize: 24 },
  { icon: '📚', top: '22%', right: '10%', distanceY: 22, distanceX: -12, rotate: '10deg', duration: 6400, fontSize: 28 },
  { icon: '📕', top: '48%', left: '6%', distanceY: -20, distanceX: 14, rotate: '-12deg', duration: 5800, fontSize: 22 },
  { icon: '📘', top: '62%', right: '8%', distanceY: 24, distanceX: -10, rotate: '8deg', duration: 6800, fontSize: 26 },
  { icon: '📗', top: '78%', left: '38%', distanceY: -16, distanceX: 12, rotate: '-6deg', duration: 6000, fontSize: 22 },
  { icon: '📙', top: '86%', right: '28%', distanceY: 18, distanceX: -8, rotate: '12deg', duration: 5500, fontSize: 20 },
];

export default function FloatingBooks() {
  const anims = useRef(BOOKS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = anims.map((anim, idx) => {
      const b = BOOKS[idx];
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: b.duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: b.duration,
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

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {BOOKS.map((b, idx) => {
        const translateY = anims[idx].interpolate({
          inputRange: [0, 1],
          outputRange: [0, b.distanceY],
        });

        const translateX = anims[idx].interpolate({
          inputRange: [0, 1],
          outputRange: [0, b.distanceX],
        });

        const scale = anims[idx].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.92, 1.08, 0.92],
        });

        const opacity = anims[idx].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.28, 0.55, 0.28],
        });

        return (
          <Animated.Text
            key={idx}
            style={[
              styles.bookIcon,
              {
                top: b.top,
                left: b.left,
                right: b.right,
                fontSize: b.fontSize,
                opacity,
                transform: [
                  { translateY },
                  { translateX },
                  { rotate: b.rotate },
                  { scale },
                ],
              },
            ]}
          >
            {b.icon}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bookIcon: {
    position: 'absolute',
    zIndex: 0,
  },
});
