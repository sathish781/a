import React, { useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import AppScrollView from '../components/AppScrollView';
import AppHeader from '../components/AppHeader';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { user, updateLocalUser, logout } = useAuth();
  const { theme, themeMode, toggleTheme } = useThemeMode();
  const isLight = theme.mode === 'light';

  const [form, setForm] = useState({
    name: user?.name || user?.shopName || user?.libraryName || '',
    phone: user?.phone || '',
    college: user?.college || user?.shopAddress || user?.libraryAddress || '',
    location: user?.location || '',
  });

  function setValue(key, value) {
    setForm({
      ...form,
      [key]: value,
    });
  }

  async function saveProfile() {
    try {
      const res = await api.put('/auth/profile', form);
      await updateLocalUser(res.data.user);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Profile update failed. Check backend server.');
    }
  }

  const initial = (user?.name || user?.shopName || user?.libraryName || 'U').charAt(0).toUpperCase();

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <AppHeader
          icon="👤"
          label="Account Settings"
          title="My Profile"
          subtitle="Manage your profile details, badges, and theme preferences."
        />

        {/* Hero Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarRingOuter}>
            <LinearGradient
              colors={isLight ? [theme.primary, theme.accent] : ['#afb0e6ff', '#8b5cf6', '#9995dcff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradientRing}
            >
              <View style={[styles.avatarInner, isLight && { backgroundColor: '#ffffff' }]}>
                <Text style={[styles.avatarInitial, isLight && { color: theme.primary }]}>{initial}</Text>
              </View>
            </LinearGradient>
          </View>

          <Text style={[styles.name, { color: theme.text }]}>{user?.name || user?.shopName || user?.libraryName || 'User'}</Text>
          <Text style={[styles.email, { color: theme.muted }]}>{user?.email || 'user@university.edu'}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.redBadge, { borderColor: theme.primary, backgroundColor: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.15)' }]}>
              <Text style={[styles.redBadgeText, { color: theme.primary }]}>Role: {user?.role || 'student'}</Text>
            </View>

            <View style={[styles.redBadge, { borderColor: theme.primary, backgroundColor: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.15)' }]}>
              <Text style={[styles.redBadgeText, { color: theme.primary }]}>🎁 Badges: {user?.badgeCount || 0}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Theme Settings Card */}
        <GlassCard style={styles.formCard}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>App Appearance</Text>
          <Text style={[styles.helpText, { color: theme.muted }]}>Current Theme Mode: {themeMode === 'light' ? 'Pure White Light' : 'Obsidian Dark'}</Text>
          <AppButton
            title={themeMode === 'light' ? "🌙 SWITCH TO DARK MODE" : "☀️ SWITCH TO WHITE LIGHT MODE"}
            onPress={toggleTheme}
            variant="dark"
            style={{ marginTop: 8 }}
          />
        </GlassCard>

        {/* Form Details Card */}
        <GlassCard style={styles.formCard}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>Edit Account Details</Text>

          <AppTextInput
            placeholder="Full Name / Entity Name"
            value={form.name}
            onChangeText={(v) => setValue('name', v)}
          />

          <AppTextInput
            placeholder="Phone Number"
            value={form.phone}
            keyboardType="phone-pad"
            onChangeText={(v) => setValue('phone', v)}
          />

          <AppTextInput
            placeholder="College / Shop / Library Name"
            value={form.college}
            onChangeText={(v) => setValue('college', v)}
          />

          <AppTextInput
            placeholder="Location (City / Campus)"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />

          <AppButton title="SAVE PROFILE" onPress={saveProfile} style={{ marginTop: 10 }} />
          <AppButton title="LOGOUT ACCOUNT" variant="danger" onPress={logout} style={{ marginTop: 8 }} />
        </GlassCard>
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 110,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 8,
    marginBottom: 16,
  },
  avatarRingOuter: {
    marginBottom: 14,
    shadowColor: '#dc2626',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  avatarGradientRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    backgroundColor: '#090a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '900',
    color: '#6366f1',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  redBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  redBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  formCard: {
    padding: 20,
    marginVertical: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  helpText: {
    fontSize: 13,
    marginBottom: 6,
  },
});