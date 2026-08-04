import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

import NeonAuthScreen, { NeonInput, NeonButton } from '../components/NeonAuthScreen';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'shop_owner', label: 'Shop Owner', icon: '🏪' },
  { id: 'library', label: 'Librarian', icon: '📚' },
];

export default function LoginScreen({ route, navigation }) {
  const { login } = useAuth();
  
  const initialRole = route?.params?.role || 'student';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const loggedUser = await login(email.trim(), password, selectedRole);
      Alert.alert('Welcome back!', `Hello, ${loggedUser.name || loggedUser.ownerName || loggedUser.librarianName || 'User'} 👋`);
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Backend not connected. Check backend server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <NeonAuthScreen
      icon="🔒"
      title="Welcome Back"
      subtitle="Sign in to manage your books, exchanges, and orders."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      onFooterLinkPress={() => navigation.navigate('Register', { role: selectedRole })}
    >
      {/* Role Selection Chips */}
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
                isActive && styles.roleChipActive,
              ]}
            >
              <Text style={styles.roleChipIcon}>{role.icon}</Text>
              <Text style={[styles.roleChipText, isActive && styles.roleChipTextActive]}>
                {role.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Input Fields */}
      <NeonInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@university.edu"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <NeonInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      {/* Forgot Password Link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign In Action Button */}
      <NeonButton
        title={selectedRole === 'admin' ? "LOG IN AS ADMIN" : "LOG IN"}
        onPress={handleLogin}
        loading={loading}
      />

      {/* Explicit Admin Login Access Button */}
      <TouchableOpacity
        onPress={() => setSelectedRole(selectedRole === 'admin' ? 'student' : 'admin')}
        style={styles.adminToggleBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.adminToggleText}>
          {selectedRole === 'admin' ? "← Return to User Login" : "🛡️ Admin Login Access"}
        </Text>
      </TouchableOpacity>
    </NeonAuthScreen>
  );
}

const styles = StyleSheet.create({
  roleHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#090d20',
    borderWidth: 1.5,
    borderColor: 'rgba(88, 101, 242, 0.2)',
  },
  roleChipActive: {
    borderColor: '#00f0ff',
    backgroundColor: '#0c122e',
    shadowColor: '#00f0ff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  roleChipIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  roleChipTextActive: {
    color: '#00f0ff',
    fontWeight: '700',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: '#c084fc',
    fontWeight: '600',
  },
  adminToggleBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  adminToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
    letterSpacing: 0.3,
  },
});