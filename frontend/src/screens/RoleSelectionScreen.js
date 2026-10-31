import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import NeumorphicScreen from '../components/NeumorphicScreen';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓', desc: 'Browse, swap, donate & buy campus books' },
  { id: 'shop', label: 'Shop Owner', icon: '🏪', desc: 'Sell textbooks & fulfill student store orders' },
  { id: 'library', label: 'Librarian', icon: '📚', desc: 'Manage institutional catalog & borrowing' },
  { id: 'admin', label: 'Administrator', icon: '🛡️', desc: 'Platform overview, user & store management' },
];

export default function RoleSelectionScreen({ navigation }) {
  const { theme } = useThemeMode();
  const isDark = theme.mode === 'dark';
  const [selectedRole, setSelectedRole] = useState('student');
  const [tapCount, setTapCount] = useState(0);

  // Staggered Entrance Animations
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-20)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  // Role item press scale values
  const roleScales = useRef(ROLES.map(() => new Animated.Value(1))).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(heroSlide, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardFade, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handlePressInRole = (index) => {
    Animated.spring(roleScales[index], { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOutRole = (index) => {
    Animated.spring(roleScales[index], { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }).start();
  };

  const handleContinue = () => {
    if (selectedRole === 'admin') {
      navigation.navigate('Login', { role: 'admin' });
    } else {
      navigation.navigate('Register', { role: selectedRole });
    }
  };

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    if (newCount >= 5) {
      setTapCount(0);
      setSelectedRole('admin');
    } else {
      setTapCount(newCount);
    }
  };

  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#1a2235' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <NeumorphicScreen>
      <Animated.View
        style={[
          styles.hero,
          { opacity: heroFade, transform: [{ translateY: heroSlide }] },
        ]}
      >
        <TouchableWithoutFeedback onPress={handleLogoTap}>
          <Text style={styles.logoEmoji}>📚</Text>
        </TouchableWithoutFeedback>
        <Text style={[styles.appName, { color: textColor }]}>BookConnect</Text>
        <Text style={[styles.subtitle, { color: theme.primary }]}>
          Select Your Campus Role
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor,
            shadowColor: theme.primary,
            opacity: cardFade,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        {ROLES.map((role, idx) => {
          const isSelected = selectedRole === role.id;
          return (
            <Animated.View
              key={role.id}
              style={{ transform: [{ scale: roleScales[idx] }] }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => handlePressInRole(idx)}
                onPressOut={() => handlePressOutRole(idx)}
                onPress={() => setSelectedRole(role.id)}
                style={[
                  styles.roleItem,
                  {
                    backgroundColor: isSelected
                      ? theme.primary + '12'
                      : isDark
                      ? '#1e2a42'
                      : '#f8fafc',
                    borderColor: isSelected ? theme.primary : borderColor,
                    borderWidth: isSelected ? 2 : 1.5,
                  },
                  isSelected && {
                    shadowColor: theme.primary,
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 5,
                  },
                ]}
              >
                <View style={styles.roleContent}>
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.roleText,
                        {
                          color: textColor,
                          fontWeight: isSelected ? '800' : '600',
                        },
                      ]}
                    >
                      {role.label}
                    </Text>
                    <Text style={[styles.roleDesc, { color: mutedColor }]} numberOfLines={1}>
                      {role.desc}
                    </Text>
                  </View>
                </View>

                {/* Animated Radio Circle / Checkmark */}
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? theme.primary : mutedColor + '60',
                      backgroundColor: isSelected ? theme.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Continue Button */}
        <Animated.View style={{ transform: [{ scale: btnScale }], marginTop: 14 }}>
          <TouchableOpacity
            onPressIn={() => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(btnScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }).start()}
            onPress={handleContinue}
            activeOpacity={1}
            style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.btnPrimaryText}>
              {selectedRole === 'admin' ? 'Proceed to Admin Login' : 'Continue Registration'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Login Alternative */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Login', { role: selectedRole })}
          activeOpacity={0.8}
          style={[styles.btnSecondary, { borderColor: theme.primary + '50' }]}
        >
          <Text style={[styles.btnSecondaryText, { color: theme.primary }]}>
            Already Registered? Log In
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </NeumorphicScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 52,
    textAlign: 'center',
    marginBottom: 6,
  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  card: {
    width: '90%',
    maxWidth: 420,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: 20,
    marginVertical: 6,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    marginBottom: 10,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  roleIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  roleText: {
    fontSize: 15,
  },
  roleDesc: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  btnPrimary: {
    paddingVertical: 15,
    borderRadius: radius.md,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
