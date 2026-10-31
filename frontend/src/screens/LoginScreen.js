import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

import NeonAuthScreen, { NeonInput, NeonButton } from '../components/NeonAuthScreen';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'shop', label: 'Shop Owner', icon: '🏪' },
  { id: 'library', label: 'Librarian', icon: '📚' },
];

export default function LoginScreen({ route, navigation }) {
  const { login } = useAuth();
  const { theme } = useThemeMode();
  const { showToast } = useToast();

  const initialRole = route?.params?.role || 'student';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    try {
      setLoading(true);
      const loggedUser = await login(cleanEmail, password, selectedRole);
      showToast(`Welcome back, ${loggedUser.name || 'User'}! 🎉`, 'success');
    } catch (error) {
      console.log('Login Error Object:', error);
      let errorMsg = 'Check your credentials or server connection.';

      if (error.response) {
        errorMsg = error.response.data?.message || `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMsg = 'Cannot reach server. Verify your internet/server connection.';
      }

      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <NeonAuthScreen
      icon="🔒"
      title={selectedRole === 'admin' ? "Admin Portal Login" : "Welcome Back"}
      subtitle={selectedRole === 'admin' ? "Sign in with administrator privileges to manage the platform." : "Sign in to manage your books, exchanges, and orders."}
      footerText={selectedRole === 'admin' ? "" : "Don't have an account?"}
      footerLinkText={selectedRole === 'admin' ? "" : "Create one"}
      onFooterLinkPress={() => navigation.navigate('Register', { role: selectedRole })}
    >
      {/* Role Selection Chips */}
      {selectedRole !== 'admin' ? (
        <>
          <Text style={styles.roleHeaderLabel}>Select Your Role</Text>
          <View style={styles.roleRow}>
            {ROLES.map((role) => {
              const isActive = selectedRole === role.id;
              return (
                <TouchableOpacity
                  key={role.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedRole(role.id)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: theme.backgroundOne,
                      borderColor: isActive ? theme.primary : theme.glassBorder,
                    },
                    isActive && {
                      shadowColor: theme.primary,
                      shadowOpacity: 0.35,
                      shadowRadius: 8,
                      elevation: 4,
                    },
                  ]}
                >
                  <Text style={styles.roleChipIcon}>{role.icon}</Text>
                  <Text
                    style={[
                      styles.roleChipText,
                      { color: isActive ? theme.primary : theme.muted, fontWeight: isActive ? '800' : '600' },
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.adminBanner}>
          <Text style={[styles.adminBannerText, { color: theme.danger }]}>
            🛡️ Logging in with System Administrator Role
          </Text>
        </View>
      )}

      <NeonInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@university.edu"
        keyboardType="email-address"
        autoCapitalize="none"
        icon="✉️"
      />

      <NeonInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        icon="🔑"
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotBtn}
        activeOpacity={0.7}
      >
        <Text style={[styles.forgotText, { color: theme.accent }]}>Forgot password?</Text>
      </TouchableOpacity>

      <NeonButton
        title={selectedRole === 'admin' ? "LOG IN AS ADMIN" : "LOG IN"}
        onPress={handleLogin}
        loading={loading}
      />

      <TouchableOpacity
        onPress={() => setSelectedRole(selectedRole === 'admin' ? 'student' : 'admin')}
        style={styles.adminToggleBtn}
        activeOpacity={0.8}
      >
        <Text style={[styles.adminToggleText, { color: theme.danger }]}>
          {selectedRole === 'admin' ? "← Return to Standard Login" : "🛡️ Admin Login Access"}
        </Text>
      </TouchableOpacity>
    </NeonAuthScreen>
  );
}

const styles = StyleSheet.create({
  roleHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  roleChipIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  roleChipText: {
    fontSize: 12,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 14,
    marginTop: -2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
  },
  adminToggleBtn: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  adminToggleText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  adminBanner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginBottom: 16,
    alignItems: 'center',
  },
  adminBannerText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
