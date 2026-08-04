import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

import NeumorphicScreen from '../components/NeumorphicScreen';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'shop_owner', label: 'Shop Owner', icon: '🏪' },
  { id: 'library', label: 'Librarian', icon: '📚' }
];

export default function RoleSelectionScreen({ navigation }) {
  const { theme } = useThemeMode();
  const isDark = theme.mode === 'dark';
  const [selectedRole, setSelectedRole] = useState('student');
  const [tapCount, setTapCount] = useState(0);

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#1a2235' : '#e0eaf5';
  const shadowDark = isDark ? '#0e1420' : '#b8c8da';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';

  const handleContinue = () => {
    navigation.navigate('Register', { role: selectedRole });
  };

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    if (newCount >= 5) {
      setTapCount(0);
      navigation.navigate('Login', { role: 'admin' });
    } else {
      setTapCount(newCount);
    }
  };

  return (
    <NeumorphicScreen>
      <View style={styles.hero}>
        <TouchableWithoutFeedback onPress={handleLogoTap}>
          <Text style={styles.logoEmoji}>📚</Text>
        </TouchableWithoutFeedback>
        <Text style={[styles.appName, { color: textColor }]}>BookConnect</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Select Your Role
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor,
            shadowColor: shadowDark,
            shadowOpacity: Platform.OS === 'ios' ? 0.7 : 0,
            shadowRadius: 18,
            shadowOffset: { width: 8, height: 8 },
            elevation: Platform.OS === 'android' ? 10 : 0,
          },
        ]}
      >
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role.id}
            activeOpacity={0.8}
            onPress={() => setSelectedRole(role.id)}
            style={[
              styles.roleItem,
              {
                backgroundColor: isDark ? '#1e2a42' : '#dde8f3',
                borderColor: selectedRole === role.id ? theme.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                borderWidth: selectedRole === role.id ? 2 : 1
              }
            ]}
          >
            <View style={styles.roleContent}>
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <Text style={[styles.roleText, { color: textColor, fontWeight: selectedRole === role.id ? '800' : '600' }]}>
                {role.label}
              </Text>
            </View>
            <View style={[styles.radioCircle, { borderColor: selectedRole === role.id ? theme.primary : mutedColor }]}>
              {selectedRole === role.id && <View style={[styles.radioDot, { backgroundColor: theme.primary }]} />}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          style={[
            styles.btnPrimary,
            { backgroundColor: theme.primary, marginTop: 16 },
          ]}
        >
          <Text style={styles.btnPrimaryText}>Continue Registration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login', { role: selectedRole })}
          activeOpacity={0.8}
          style={[
            styles.btnSecondary,
            { borderColor: theme.primary, marginTop: 12 },
          ]}
        >
          <Text style={[styles.btnSecondaryText, { color: theme.primary }]}>
            Already Registered? Login
          </Text>
        </TouchableOpacity>
      </View>
    </NeumorphicScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 24,
    marginVertical: 8,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 12,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  roleText: {
    fontSize: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  btnSecondary: {
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
