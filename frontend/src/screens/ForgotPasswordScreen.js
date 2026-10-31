import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';

import NeonAuthScreen, { NeonInput, NeonButton } from '../components/NeonAuthScreen';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [email, setEmail] = useState('');
  const [recoveryHint, setRecoveryHint] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    try {
      if (!email || !recoveryHint || !newPassword) {
        Alert.alert('Missing Fields', 'Please fill in all details to reset your password.');
        return;
      }

      setLoading(true);
      const res = await api.post('/auth/reset-with-hint', {
        email: email.trim().toLowerCase(),
        recoveryHint,
        newPassword
      });

      Alert.alert('Success 🎉', 'Your password has been reset successfully. Please log in with your new password.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Unable to process reset. Check your details or connection.';
      Alert.alert('Reset Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <NeonAuthScreen
      icon="🔄"
      title="RESET PASSWORD"
      subtitle="Verify your account using your unique recovery hint."
      footerText="Remembered your password?"
      footerLinkText="Log in"
      onFooterLinkPress={() => navigation.navigate('Login')}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: theme.primary, fontSize: 32, fontWeight: '300' }}>‹</Text>
      </TouchableOpacity>

      <NeonInput
        placeholder="Registered Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        icon="✉️"
      />

      <NeonInput
        placeholder="Recovery Hint"
        value={recoveryHint}
        onChangeText={setRecoveryHint}
        icon="❓"
      />

      <NeonInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        icon="🔒"
      />

      <NeonButton
        title="RESET PASSWORD"
        onPress={handleReset}
        loading={loading}
        style={{ marginTop: 10 }}
      />
    </NeonAuthScreen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: -150,
    left: -10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }
});