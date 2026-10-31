import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import SectionHeader from '../components/SectionHeader';
import AnimatedModal from '../components/AnimatedModal';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { user, updateLocalUser, logout } = useAuth();
  const { theme, themeMode, toggleTheme } = useThemeMode();
  const { showToast } = useToast();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const avatarScale = useRef(new Animated.Value(1)).current;

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || '',
    location: user?.location || '',
    recoveryHint: user?.recoveryHint || '',
  });

  function setValue(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    try {
      setSaving(true);
      const res = await api.put('/auth/profile', form);
      await updateLocalUser(res.data.user);
      showToast('Profile updated successfully! ✨', 'success');
    } catch (error) {
      showToast('Profile update failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.timing(avatarScale, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleAvatarPress}>
            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
              <LinearGradient colors={[theme.primary, theme.accent]} style={styles.avatarCircle}>
                <Text style={styles.initialText}>{initial}</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
          <Text style={[styles.userEmail, { color: theme.muted }]}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.primary + '18' }]}>
            <Text style={[styles.roleText, { color: theme.primary }]}>
              {user?.role?.toUpperCase() || 'STUDENT'}
            </Text>
          </View>
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance & Preferences" />
        <GlassCard style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
              </Text>
              <Text style={[styles.settingSub, { color: theme.muted }]}>
                Toggle app visual color theme
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.toggleBtn, { backgroundColor: theme.primary }]}
              onPress={toggleTheme}
            >
              <Text style={styles.toggleIcon}>{themeMode === 'light' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Edit Profile Form */}
        <SectionHeader title="Edit Profile Details" />
        <GlassCard style={styles.formCard}>
          <AppTextInput
            label="Full Name"
            value={form.name}
            onChangeText={(v) => setValue('name', v)}
          />
          <AppTextInput
            label="Phone Number"
            value={form.phone}
            onChangeText={(v) => setValue('phone', v)}
          />
          <AppTextInput
            label="Institution / College"
            value={form.college}
            onChangeText={(v) => setValue('college', v)}
          />
          <AppTextInput
            label="Location"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />
          <AppTextInput
            label="Security Hint"
            value={form.recoveryHint}
            onChangeText={(v) => setValue('recoveryHint', v)}
          />

          <AppButton
            title={saving ? 'SAVING...' : 'SAVE CHANGES'}
            onPress={saveProfile}
            loading={saving}
            style={{ marginTop: 15 }}
          />
        </GlassCard>

        {/* Logout Trigger */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowLogoutModal(true)}
          style={styles.logoutBtn}
        >
          <Text style={[styles.logoutText, { color: theme.danger }]}>LOGOUT SESSION</Text>
        </TouchableOpacity>

        {/* Logout Confirmation Modal */}
        <AnimatedModal visible={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
          <Text style={[styles.modalEmoji]}>👋</Text>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Log Out of BookConnect?</Text>
          <Text style={[styles.modalSub, { color: theme.muted }]}>
            Are you sure you want to end your active session on this device?
          </Text>

          <View style={styles.modalBtnRow}>
            <TouchableOpacity
              style={[styles.modalCancelBtn, { borderColor: theme.glassBorder }]}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={[styles.modalCancelText, { color: theme.text }]}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalLogoutBtn, { backgroundColor: theme.danger }]}
              onPress={() => {
                setShowLogoutModal(false);
                logout();
              }}
            >
              <Text style={styles.modalLogoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </AnimatedModal>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 22, paddingBottom: 110 },
  header: { alignItems: 'center', marginBottom: 25 },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  initialText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '900', marginTop: 14, letterSpacing: -0.4 },
  userEmail: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginTop: 8 },
  roleText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  settingsCard: { padding: 18, borderRadius: 22 },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { fontSize: 15, fontWeight: '800' },
  settingSub: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  toggleBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  toggleIcon: { fontSize: 18 },
  formCard: { padding: 18, borderRadius: 22 },
  logoutBtn: { marginTop: 28, alignItems: 'center', paddingVertical: 12 },
  logoutText: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  modalEmoji: { fontSize: 44, textAlign: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: '900', textAlign: 'center' },
  modalSub: { fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18, fontWeight: '500' },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: { fontSize: 13, fontWeight: '800' },
  modalLogoutBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLogoutText: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
});
