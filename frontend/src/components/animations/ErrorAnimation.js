import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';

export function shakeElement(animValue) {
  Animated.sequence([
    Animated.timing(animValue, { toValue: -6, duration: 60, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 6, duration: 60, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: -4, duration: 60, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 4, duration: 60, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();
}

export default function ErrorShakeWrapper({ children, triggerShake = false, style }) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (triggerShake) {
      shakeElement(shakeAnim);
    }
  }, [triggerShake]);

  return (
    <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }, style]}>
      {children}
    </Animated.View>
  );
}
