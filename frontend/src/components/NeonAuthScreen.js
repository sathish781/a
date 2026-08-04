import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeMode } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// ─── Glowing Neon Input Component ──────────────────────────────────────────────
export function NeonInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  icon,
  style,
}) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View style={[inputStyles.wrapper, style]}>
      {label && <Text style={[inputStyles.label, { color: theme.muted }]}>{label}</Text>}
      <View
        style={[
          inputStyles.inputBox,
          {
            backgroundColor: isLight ? '#f8fafc' : '#090d20',
            borderColor: focused ? theme.primary : (isLight ? '#e2e8f0' : 'rgba(88, 101, 242, 0.25)'),
          },
          focused && {
            shadowColor: theme.primary,
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 3,
          },
        ]}
      >
        {icon && <Text style={inputStyles.leftIcon}>{icon}</Text>}
        <TextInput
          style={[inputStyles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isLight ? '#94a3b8' : 'rgba(148, 163, 184, 0.45)'}
          secureTextEntry={secureTextEntry ? !showPassword : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={inputStyles.eyeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={inputStyles.eyeIcon}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090d20',
    borderWidth: 1.5,
    borderColor: 'rgba(88, 101, 242, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  inputBoxFocused: {
    borderColor: '#00f0ff',
    backgroundColor: '#0c112b',
    shadowColor: '#00f0ff',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  leftIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
    opacity: 0.8,
  },
});

// ─── Glowing Neon Button Component ──────────────────────────────────────────────
export function NeonButton({ title, onPress, loading, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
      disabled={loading}
      style={[btnStyles.touchable, style]}
    >
      <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
        <LinearGradient
          colors={['#a855f7', '#3b82f6', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={btnStyles.gradientBtn}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={btnStyles.btnText}>{title}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  touchable: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 14,
    shadowColor: '#a855f7',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  gradientBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

// ─── Main Frame Wrapper (Matches User's Frame) ──────────────────────────────────
export default function NeonAuthScreen({
  icon = '+',
  title = 'Create Your Account',
  subtitle = 'Start smarter conversations with dual-model AI.',
  children,
  footerText = 'Already have an account?',
  footerLinkText = 'Log in',
  onFooterLinkPress,
}) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  // Breathing background ambient lights animation
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(anim1, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(anim2, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(anim2, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    ).start();
  }, [anim1, anim2]);

  const translateY1 = anim1.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const translateY2 = anim2.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });

  return (
    <LinearGradient
      colors={isLight ? ['#ffffff', '#f8fafc', '#f1f5f9'] : ['#050714', '#0a0e28', '#040612']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <StatusBar barStyle={isLight ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />

      {/* Background Ambient Glows */}
      <Animated.View
        style={[
          styles.glowBlob1,
          isLight && { backgroundColor: 'rgba(220, 38, 38, 0.06)' },
          { transform: [{ translateY: translateY1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.glowBlob2,
          isLight && { backgroundColor: 'rgba(225, 29, 72, 0.05)' },
          { transform: [{ translateY: translateY2 }] },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Outer Glass Frame */}
          <View
            style={[
              styles.cardFrame,
              isLight && {
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                shadowColor: '#0f172a',
                shadowOpacity: 0.08,
                shadowRadius: 20,
              },
            ]}
          >
            {/* Top Accent Glow */}
            <View style={[styles.topAccentGlow, isLight && { backgroundColor: theme.primary }]} />

            {/* Glowing Icon Circle Badge */}
            <View style={styles.iconCircleOuter}>
              <LinearGradient
                colors={isLight ? [theme.primary, theme.accent] : ['#00f0ff', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircleGradient}
              >
                <View style={[styles.iconCircleInner, isLight && { backgroundColor: '#ffffff' }]}>
                  <Text style={[styles.iconText, isLight && { color: theme.primary }]}>{icon}</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Title & Subtitle */}
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}

            {/* Card Main Body */}
            <View style={styles.cardContent}>{children}</View>

            {/* Footer switch link */}
            {footerText ? (
              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: theme.muted }]}>{footerText} </Text>
                <TouchableOpacity onPress={onFooterLinkPress} activeOpacity={0.7}>
                  <Text style={[styles.footerLink, { color: theme.primary }]}>{footerLinkText}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  glowBlob1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
  },
  glowBlob2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(0, 240, 255, 0.14)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  cardFrame: {
    width: '100%',
    maxWidth: width > 500 ? 460 : 400,
    backgroundColor: 'rgba(13, 17, 38, 0.88)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  topAccentGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00f0ff',
    shadowColor: '#00f0ff',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  iconCircleOuter: {
    marginBottom: 20,
    shadowColor: '#00f0ff',
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  iconCircleGradient: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
    backgroundColor: '#070a1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#00f0ff',
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  cardContent: {
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 14,
    color: '#c084fc',
    fontWeight: '700',
  },
});
