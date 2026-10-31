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

// ─── Warm Glowing Input Component ──────────────────────────────────────────────
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
  const inputRef = useRef(null);

  // Animations
  const borderAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const eyeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.spring(iconScale, {
      toValue: focused ? 1.15 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const togglePassword = () => {
    Animated.sequence([
      Animated.timing(eyeScale, { toValue: 0.7, duration: 100, useNativeDriver: true }),
      Animated.timing(eyeScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setShowPassword(!showPassword);
  };

  const borderColorInterpolate = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.glassBorder, theme.primary],
  });

  return (
    <View style={[inputStyles.wrapper, style]}>
      {label && (
        <Text
          style={[
            inputStyles.label,
            { color: focused ? theme.primary : theme.muted },
          ]}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <Animated.View
          style={[
            inputStyles.inputBox,
            {
              backgroundColor: isLight ? theme.backgroundOne : theme.backgroundTwo,
              borderColor: borderColorInterpolate,
            },
            focused && {
              shadowColor: theme.primary,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            },
          ]}
        >
          {icon && (
            <Animated.Text
              style={[inputStyles.leftIcon, { transform: [{ scale: iconScale }] }]}
            >
              {icon}
            </Animated.Text>
          )}

          <TextInput
            ref={inputRef}
            style={[inputStyles.input, { color: theme.text }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.muted + '90'}
            secureTextEntry={secureTextEntry ? !showPassword : false}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize || 'none'}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            underlineColorAndroid="transparent"
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={togglePassword}
              style={inputStyles.eyeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Animated.Text
                style={[inputStyles.eyeIcon, { transform: [{ scale: eyeScale }] }]}
              >
                {showPassword ? '👁️' : '🔒'}
              </Animated.Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  leftIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
    opacity: 0.85,
  },
});

// ─── Warm Glowing Button Component ──────────────────────────────────────────────
export function NeonButton({ title, onPress, loading, style }) {
  const { theme } = useThemeMode();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      disabled={loading}
      style={[btnStyles.touchable, style]}
    >
      <Animated.View
        style={[
          btnStyles.animatedWrap,
          { transform: [{ scale }], shadowColor: theme.primary },
        ]}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryDark, theme.accent]}
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
    borderRadius: 16,
  },
  animatedWrap: {
    width: '100%',
    borderRadius: 16,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  gradientBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

// ─── Main Auth Screen Wrapper ──────────────────────────────────
export default function NeonAuthScreen({
  icon = '+',
  title = 'Create Your Account',
  subtitle = 'Start smarter transactions with campus book exchange.',
  children,
  footerText = 'Already have an account?',
  footerLinkText = 'Log in',
  onFooterLinkPress,
}) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

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
  }, []);

  const translateY1 = anim1.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const translateY2 = anim2.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });

  return (
    <LinearGradient
      colors={isLight ? [theme.backgroundOne, theme.backgroundTwo, theme.backgroundThree] : [theme.backgroundOne, '#121212', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <StatusBar barStyle={isLight ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowBlob1,
          { backgroundColor: theme.primary + '20' },
          { transform: [{ translateY: translateY1 }] },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowBlob2,
          { backgroundColor: theme.accent + '15' },
          { transform: [{ translateY: translateY2 }] },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.cardFrame,
              {
                backgroundColor: theme.tabBg,
                borderColor: theme.glassBorder,
                shadowColor: isLight ? '#000' : theme.primary,
                opacity: cardFade,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <View
              pointerEvents="none"
              style={[styles.topAccentGlow, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            />

            <View style={[styles.iconCircleOuter, { shadowColor: theme.primary }]}>
              <LinearGradient
                colors={[theme.primary, theme.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircleGradient}
              >
                <View style={[styles.iconCircleInner, { backgroundColor: theme.backgroundTwo }]}>
                  <Text style={[styles.iconText, { color: theme.primary }]}>{icon}</Text>
                </View>
              </LinearGradient>
            </View>

            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}

            <View style={styles.cardContent}>{children}</View>

            {footerText ? (
              <View style={styles.footerRow}>
                <Text style={[styles.footerText, { color: theme.muted }]}>{footerText} </Text>
                <TouchableOpacity onPress={onFooterLinkPress} activeOpacity={0.7}>
                  <Text style={[styles.footerLink, { color: theme.primary }]}>{footerLinkText}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100%',
  },
  glowBlob1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  glowBlob2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 65 : 45,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFrame: {
    width: '100%',
    maxWidth: width > 500 ? 460 : 400,
    borderRadius: 28,
    borderWidth: 1.5,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  topAccentGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  iconCircleOuter: {
    marginBottom: 16,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircleGradient: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 26,
    fontWeight: '300',
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  cardContent: {
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '800',
  },
});
