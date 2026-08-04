import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeMode } from '../context/ThemeContext';

export default function GlassScreen({ children }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  // Animation values for glowing blobs
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateBlob = (anim, duration, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateBlob(moveAnim1, 8000, 0);
    animateBlob(moveAnim2, 10000, 2000);
  }, [moveAnim1, moveAnim2]);

  const translateY1 = moveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });
  const translateY2 = moveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  return (
    <LinearGradient
      colors={isLight ? ['#ffffff', '#f8fafc', '#f1f5f9'] : ['#050508', '#0a0a12', '#06060c']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Ambient Blobs */}
      <Animated.View
        style={[
          styles.blobOne,
          isLight && { backgroundColor: 'rgba(220, 38, 38, 0.05)' },
          { transform: [{ translateY: translateY1 }] },
        ]}
      />

      <Animated.View
        style={[
          styles.blobTwo,
          isLight && { backgroundColor: 'rgba(10, 2, 4, 0.04)' },
          { transform: [{ translateY: translateY2 }] },
        ]}
      />

      <SafeAreaView style={styles.safe}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  blobOne: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -80,
    right: -70,
    backgroundColor: 'rgba(218, 148, 165, 0.18)',
  },
  blobTwo: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    bottom: -110,
    left: -100,
    backgroundColor: 'rgba(244, 157, 176, 0.14)',
  },
});