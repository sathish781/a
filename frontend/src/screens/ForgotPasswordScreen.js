import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  async function submit() {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      Alert.alert('Message', res.data.message);
    } catch (error) {
      Alert.alert('Error', 'Unable to process request');
    }
  }

  return (
    <GlassScreen>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email. For demo project, password reset message will be shown.
        </Text>

        <AppTextInput
          placeholder="Email Address"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />

        <AppButton title="Submit" onPress={submit} />
      </GlassCard>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 22,
    marginTop: 120
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 22
  }
});