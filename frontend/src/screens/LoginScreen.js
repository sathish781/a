import React, { useState } from 'react';
import { Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('student@bookconnect.com');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      if (!email || !password) {
        Alert.alert('Missing Details', 'Enter email and password');
        return;
      }

      setLoading(true);

      const loggedUser = await login(email.trim(), password);

      Alert.alert('Success', `Welcome ${loggedUser.name}`);
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Backend not connected. Check backend terminal.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue your book search.</Text>

        <GlassCard>
          <AppTextInput
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <AppTextInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <AppButton title="Login" onPress={handleLogin} />
          )}

          <Text
            style={styles.link}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Forgot Password?
          </Text>

          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            New user? Create account
          </Text>
        </GlassCard>

        <GlassCard>
          <Text style={styles.demoTitle}>Demo Login</Text>
          <Text style={styles.demoText}>Student: student@bookconnect.com / student123</Text>
          <Text style={styles.demoText}>Admin: admin@bookconnect.com / admin123</Text>
          <Text style={styles.demoText}>Library: library@bookconnect.com / library123</Text>
          <Text style={styles.demoText}>Shop: shop@bookconnect.com / shop123</Text>
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 18,
  },
  link: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 10,
  },
  demoTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  demoText: {
    color: colors.muted,
    lineHeight: 22,
  },
});