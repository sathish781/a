import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import NeonAuthScreen, { NeonInput, NeonButton } from '../components/NeonAuthScreen';
import api from '../api/client';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      if (!email) {
        Alert.alert('Missing Field', 'Please enter your email address');
        return;
      }
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      Alert.alert('Message', res.data.message || 'Reset link sent to your email!');
    } catch (error) {
      Alert.alert('Error', 'Unable to process request. Check backend connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <NeonAuthScreen
      icon="🔑"
      title="Reset Password"
      subtitle="Enter your email address and we will send you password reset instructions."
      footerText="Remembered your password?"
      footerLinkText="Log in"
      onFooterLinkPress={() => navigation.navigate('Login')}
    >
      <NeonInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@university.edu"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <NeonButton
        title="SEND RESET LINK"
        onPress={submit}
        loading={loading}
      />
    </NeonAuthScreen>
  );
}