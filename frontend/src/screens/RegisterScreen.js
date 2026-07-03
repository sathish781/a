import React, { useState } from 'react';
import { Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

export default function RegisterScreen() {
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    college: '',
    location: '',
  });

  function setValue(key, value) {
    setForm({
      ...form,
      [key]: value,
    });
  }

  async function handleRegister() {
    try {
      if (!form.name || !form.email || !form.password) {
        Alert.alert('Missing Details', 'Name, email, and password are required');
        return;
      }

      setLoading(true);

      const createdUser = await register({
        ...form,
        email: form.email.trim(),
        role: form.role.trim().toLowerCase(),
      });

      Alert.alert('Success', `Account created for ${createdUser.name}`);
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Backend not connected. Check backend terminal.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join BookConnect and start sharing books.</Text>

        <GlassCard>
          <AppTextInput
            placeholder="Full Name"
            value={form.name}
            onChangeText={(v) => setValue('name', v)}
          />

          <AppTextInput
            placeholder="Email"
            value={form.email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(v) => setValue('email', v)}
          />

          <AppTextInput
            placeholder="Password"
            value={form.password}
            secureTextEntry
            onChangeText={(v) => setValue('password', v)}
          />

          <Text style={styles.help}>
            Role: student / library_staff / shop_owner / admin
          </Text>

          <AppTextInput
            placeholder="Role"
            value={form.role}
            autoCapitalize="none"
            onChangeText={(v) => setValue('role', v)}
          />

          <AppTextInput
            placeholder="Phone"
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
            placeholder="Location"
            value={form.location}
            onChangeText={(v) => setValue('location', v)}
          />

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <AppButton title="Register" onPress={handleRegister} />
          )}
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
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    marginBottom: 18,
  },
  help: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 2,
  },
});