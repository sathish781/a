import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';

import NeumorphicScreen from '../components/NeumorphicScreen';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

export default function SplashScreen({ route, navigation }) {
  const { theme } = useThemeMode();
  const isDark = theme.mode === 'dark';

  const role = route?.params?.role || 'student';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#1a2235' : '#e0eaf5';
  const shadowDark = isDark ? '#0e1420' : '#b8c8da';
  const shadowLight = isDark ? '#232f47' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';

  return (
    <NeumorphicScreen>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.logoEmoji}>📚</Text>
        <Text style={[styles.appName, { color: textColor }]}>BookConnect</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          One Search, Three Sources – Library,{'\n'}Local Book Shop, and Student Marketplace.
        </Text>
      </View>

      {/* Card */}
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
        <Text style={[styles.cardTitle, { color: textColor }]}>Find Books Smarter</Text>
        <Text style={[styles.cardText, { color: mutedColor }]}>
          Search academic and competitive exam books from libraries, local shops, and students in one modern app.
        </Text>

        {/* Login Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Login', { role })}
          activeOpacity={0.85}
          style={[
            styles.btnPrimary,
            { backgroundColor: theme.primary },
          ]}
        >
          <Text style={styles.btnPrimaryText}>Login as {role}</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Register', { role })}
          activeOpacity={0.85}
          style={[
            styles.btnSecondary,
            {
              backgroundColor: cardBg,
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
              shadowColor: shadowDark,
              shadowOpacity: Platform.OS === 'ios' ? 0.5 : 0,
              shadowRadius: 10,
              shadowOffset: { width: 4, height: 4 },
              elevation: Platform.OS === 'android' ? 4 : 0,
            },
          ]}
        >
          <Text style={[styles.btnSecondaryText, { color: textColor }]}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer tagline */}
      <Text style={[styles.footer, { color: mutedColor }]}>
        Join thousands of students sharing books 🎓
      </Text>
    </NeumorphicScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoEmoji: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 28,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 20,
  },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  btnSecondary: {
    paddingVertical: 16,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  footer: {
    marginTop: 20,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});