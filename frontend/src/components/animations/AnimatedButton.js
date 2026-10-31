import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../../context/ThemeContext';

export default function AnimatedButton({
  title,
  onPress,
  loading = false,
  variant = 'primary', // 'primary' | 'secondary' | 'glass'
  icon,
  style,
  textStyle,
}) {
  const { theme } = useThemeMode();

  const shineTranslate = useRef(new Animated.Value(-150)).current;
  const glowPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Moving shine highlight sweep animation every 3.5s
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(shineTranslate, {
          toValue: 350,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(shineTranslate, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shineLoop.start();

    // Idle glow pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1.02, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    return () => {
      shineLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  if (variant === 'secondary' || variant === 'glass') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={loading}
        style={[styles.touchable, style]}
      >
        <View
          style={[
            styles.glassBtn,
            {
              borderColor: theme.glassBorder,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.text} size="small" />
          ) : (
            <View style={styles.contentRow}>
              {icon && <Text style={styles.leftIcon}>{icon}</Text>}
              <Text style={[styles.glassBtnText, { color: theme.text }, textStyle]}>
                {title}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
      style={[styles.touchable, style]}
    >
      <Animated.View
        style={[
          styles.btnShadowWrap,
          {
            shadowColor: theme.primary,
            transform: [{ scale: glowPulse }],
          },
        ]}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryGradient}
        >
          {/* Moving Shine Sweep Layer */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shineLayer,
              {
                transform: [{ translateX: shineTranslate }, { rotate: '25deg' }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shineGradient}
            />
          </Animated.View>

          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View style={styles.contentRow}>
              <Text style={[styles.primaryBtnText, textStyle]}>{title}</Text>
              {icon ? (
                <Text style={styles.rightIcon}>{icon}</Text>
              ) : (
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  btnShadowWrap: {
    borderRadius: 20,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  primaryGradient: {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  shineLayer: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 60,
  },
  shineGradient: {
    flex: 1,
  },
  glassBtn: {
    height: 54,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  glassBtnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  leftIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  rightIcon: {
    marginLeft: 8,
    fontSize: 18,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});
