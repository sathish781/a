import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';

export default function SuccessAnimation({ title = 'Success!', subtitle = '' }) {
  const { theme } = useThemeMode();

  const circleScale = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(circleScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 65,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: theme.success || '#10b981',
            transform: [{ scale: circleScale }],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.checkMark,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          ✓
        </Animated.Text>
      </Animated.View>

      <Animated.View style={{ opacity: textFade, alignItems: 'center', marginTop: 16 }}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});
