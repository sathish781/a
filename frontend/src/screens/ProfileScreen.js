import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';

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

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || '',
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

      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', 'Profile update failed');
    }
  }

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <AppHeader
          icon="👤"
          label="Account Settings"
          title="My Profile"
          subtitle="Manage profile, theme, and account settings."
        />

        <GlassCard style={styles.profileCard}>
          <Text style={styles.avatar}>👤</Text>

          <Text style={[styles.name, { color: theme.white }]}>
            {user?.name}
          </Text>

          <Text style={[styles.email, { color: theme.muted }]}>
            {user?.email}
          </Text>

          <Text style={[styles.badge, { color: theme.white }]}>
            Role: {user?.role}
          </Text>

          <Text style={[styles.badge, { color: theme.white }]}>
            Donation Badges: {user?.badgeCount || 0}
          </Text>

          <Text style={[styles.badge, { color: theme.white }]}>
            Theme: {themeMode}
          </Text>
        </GlassCard>

        <GlassCard>
          <AppButton
            title={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            variant="gold"
            onPress={toggleTheme}
          />

          <AppTextInput
            placeholder="Name"
            value={form.name}
            onChangeText={(v) => setValue('name', v)}
          />

          <AppTextInput
            placeholder="Phone"
            value={form.phone}
            keyboardType="phone-pad"
            onChangeText={(v) => setValue('phone', v)}
          />

          <AppTextInput
            placeholder="College / Shop / Library"
            value={form.college}
            onChangeText={(v) => setValue('college', v)}
          />

          <AppTextInput
            placeholder="Location"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />

          <AppButton title="Save Profile" onPress={saveProfile} />
          <AppButton title="Logout" variant="danger" onPress={logout} />
        </GlassCard>
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 26,
  },
  avatar: {
    fontSize: 62,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
  },
  email: {
    marginTop: 5,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    fontWeight: '900',
  },
});